<script setup lang="ts">
  import type { FormSubmitEvent } from '@nuxt/ui';
  import type { PollData } from '~/types/polls';

  type VotePayload = {
    pollId: number;
    optionIds: number[];
    customOptionValue: string[];
  };

  type SingleSelctedOptions = {
    selectedOptionId: number | null;
    addedOptionValue: string;
  };

  type MultipleSelctedOptions = {
    selectedOptionIds: number[];
    addedOptionValues: string[];
  };

  interface PollVoterProps {
    poll: PollData;
  }

  const { poll } = defineProps<PollVoterProps>();
  // 단일 선택 모드에서 선택된 항목과 커스텀 항목을 관리
  const singleSelctedOptions = ref<SingleSelctedOptions>({
    selectedOptionId: null,
    addedOptionValue: '',
  });
  const selectedSingleIdStr = computed({
    // 화면(Radio)으로 나갈 땐 string으로 포장
    get: () =>
      singleSelctedOptions.value.selectedOptionId
        ? String(singleSelctedOptions.value.selectedOptionId)
        : undefined,
    // 화면에서 클릭해서 들어올 땐 다시 number로 변환해서 상태에 저장
    set: (val) => {
      if (val === 'custom') {
        singleSelctedOptions.value.selectedOptionId = -1;
      } else {
        singleSelctedOptions.value.selectedOptionId = val ? Number(val) : null;
      }
    },
  });

  const multipleSelctedOptions = ref<MultipleSelctedOptions>({
    selectedOptionIds: [],
    addedOptionValues: [],
  });
  const selectedMultipleIdsStr = computed({
    get: () => multipleSelctedOptions.value.selectedOptionIds.map((v) => String(v)),
    set: (val) => {
      multipleSelctedOptions.value.selectedOptionIds = val.map((v) => Number(v));
    },
  });

  // UI 컴포넌트에 전달하기 위해 옵션 목록을 가공
  const mappedMultipleOptionItems = computed(() => {
    return poll.options.map((option) => ({
      value: String(option.id), // UI 컴포넌트가 요구하는 string 형태
      label: formatOptionValue(option.value), // 화면에 보여줄 텍스트
    }));
  });

  const mappedSingleOptionItems = computed(() => {
    const items = poll.options.map((option) => ({
      value: String(option.id), // UI 컴포넌트가 요구하는 string 형태
      label: formatOptionValue(option.value), // 화면에 보여줄 텍스트
    }));
    if (poll.allowCustomOptions) {
      items.push({
        value: '-1',
        label: '직접 입력',
      });
    }
    return items;
  });

  const isSubmitting = ref(false);
  const toast = useToast();

  function addOption() {
    if (poll.isMultipleChoice) {
      multipleSelctedOptions.value.addedOptionValues.push('');
    } else {
      singleSelctedOptions.value.addedOptionValue = '';
    }
  }

  function formatOptionValue(value: string) {
    if (poll.optionType === 'DATE') {
      return new Date(value).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return value;
  }

  async function submitVote(_: FormSubmitEvent<VotePayload>) {
    // 선택된 항목이 없는 경우 방어 로직
    if (poll.isMultipleChoice) {
      if (
        multipleSelctedOptions.value.addedOptionValues.length === 0 &&
        multipleSelctedOptions.value.selectedOptionIds.length === 0
      ) {
        toast.add({
          title: '알림',
          description: '투표할 항목을 하나 이상 선택해주세요.',
          color: 'warning',
        });
        return;
      }
    } else {
      // 단일 선택 방어 로직: '직접 입력'을 선택해놓고 값을 입력하지 않은 경우
      if (singleSelctedOptions.value.selectedOptionId === -1) {
        if (singleSelctedOptions.value.addedOptionValue.trim() === '') {
          toast.add({
            title: '알림',
            description: '직접 입력할 항목 내용을 작성해주세요.',
            color: 'warning',
          });
          return;
        }
      } else if (!singleSelctedOptions.value.selectedOptionId) {
        // 아무런 선택도 하지 않은 경우
        toast.add({ title: '알림', description: '투표할 항목을 선택해주세요.', color: 'warning' });
        return;
      }
    }

    isSubmitting.value = true;

    try {
      // 단일 선택이든 다중 선택이든 백엔드 처리가 편하도록 배열 형태로 통일해서 전송
      let selectedOptionIds: number[] = [];
      let addedOptions: string[] = [];

      // 선택된 항목과 커스텀 항목을 취합
      // 단일 선택과 다중 선택의 로직이 동일하므로, 공통 로직으로 처리
      if (poll.isMultipleChoice) {
        selectedOptionIds = multipleSelctedOptions.value.selectedOptionIds;
        addedOptions = multipleSelctedOptions.value.addedOptionValues;
      } else {
        // 서버에 보낼 데이터는 배열로 통일
        // -1(직접 입력 식별자)은 서버에 보내는 OptionIds 배열에서 제외
        selectedOptionIds =
          singleSelctedOptions.value.selectedOptionId &&
          singleSelctedOptions.value.selectedOptionId !== -1
            ? [singleSelctedOptions.value.selectedOptionId]
            : [];
        addedOptions = singleSelctedOptions.value.addedOptionValue
          ? [singleSelctedOptions.value.addedOptionValue]
          : [];
      }

      // 백엔드에 전달할 페이로드 생성
      const payload = {
        pollId: poll.id,
        optionIds: selectedOptionIds,
        customOptionValue: addedOptions,
      };

      // console.log('서버로 보낼 투표 데이터:', payload);

      // API 호출
      await $fetch(`/api/polls/${poll.id}`, {
        method: 'POST',
        body: payload,
      });

      toast.add({ title: '성공', description: '투표가 완료되었습니다!', color: 'success' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('투표 실패:', error);
      toast.add({
        title: '오류',
        description: error.data?.message || '투표에 실패했습니다.',
        color: 'error',
      });
    } finally {
      isSubmitting.value = false;
    }
  }

  onMounted(() => {
    console.log(poll);
  });
</script>

<template>
  <UForm class="flex w-full flex-row gap-4" @submit="submitVote">
    <UCard
      class="flex-2 divide-y-0 rounded-2xl bg-white/3 p-4 shadow-md shadow-black hover:shadow-lg"
      :ui="{
        body: 'sm:pt-0',
      }"
    >
      <template #header>
        <div class="flex flex-row items-center justify-between">
          <h3 class="text-primary text-lg font-bold">Options</h3>

          <!-- Add Option Button -->
          <UButton
            v-if="poll.isMultipleChoice && poll.allowCustomOptions"
            variant="ghost"
            class="text-secondary"
            size="sm"
            @click="addOption"
          >
            <UIcon name="i-lucide-circle-plus" class="size-4" />
            <span>Add Option</span>
          </UButton>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col gap-6">
          <div v-if="poll.isMultipleChoice" class="flex flex-col gap-3">
            <UFormField
              label="option"
              name="option"
              class="w-full"
              :ui="{
                wrapper: 'w-full',
                label: 'hidden',
              }"
            >
              <UCheckboxGroup
                v-model="selectedMultipleIdsStr"
                indicator="start"
                variant="card"
                :items="mappedMultipleOptionItems"
                :ui="{
                  fieldset: 'flex flex-col w-full gap-4',
                  item: `items-center gap-4 not-has-data-[state=checked]:bg-black`,
                }"
              >
                <template #label="{ item }">
                  <div class="flex flex-col items-start gap-2">
                    <span class="font-bold">{{ item.label }}</span>
                  </div>
                </template>
              </UCheckboxGroup>
              <div v-if="poll.allowCustomOptions" class="mt-2 flex flex-col gap-2">
                <div
                  v-for="(_, index) in multipleSelctedOptions.addedOptionValues"
                  :key="index"
                  class="flex w-full flex-row items-center gap-2"
                >
                  <UInput
                    v-model="multipleSelctedOptions.addedOptionValues[index]"
                    icon="i-lucide-square-check"
                    placeholder="Add custom option"
                    class="flex-1"
                    :ui="{
                      base: 'text-sm md:text-sm font-medium font-bold py-3.5 bg-black ps-14 border border-primary',
                      leading: 'ps-3',
                      leadingIcon: 'bg-primary',
                    }"
                  />

                  <UButton
                    variant="ghost"
                    class="hover:bg-red-700/30"
                    :ui="{ base: 'size-8 p-0 flex items-center justify-center' }"
                    @click="multipleSelctedOptions.addedOptionValues.splice(index, 1)"
                  >
                    <UIcon name="i-lucide-trash" class="size-4 bg-red-500" />
                  </UButton>
                </div>
              </div>
            </UFormField>
          </div>
          <div v-else class="flex flex-col gap-3">
            <UFormField
              label="option"
              name="option"
              class="w-full"
              :ui="{
                wrapper: 'w-full',
                label: 'hidden',
              }"
            >
              <URadioGroup
                v-model="selectedSingleIdStr"
                indicator="start"
                variant="card"
                :items="mappedSingleOptionItems"
                :ui="{
                  fieldset: 'flex flex-col w-full gap-4',
                  item: `items-center gap-4 not-has-data-[state=checked]:bg-black`,
                }"
              >
                <template #label="{ item }">
                  <div class="flex flex-col items-start gap-2">
                    <span class="font-bold">{{ item.label }}</span>
                  </div>
                </template>
              </URadioGroup>

              <!-- 직접입력 -->
              <div
                v-if="poll.allowCustomOptions && selectedSingleIdStr === '-1'"
                class="mt-4 flex w-full flex-row items-center gap-2"
              >
                <UInput
                  v-model="singleSelctedOptions.addedOptionValue"
                  icon="i-lucide-pen-line"
                  placeholder="직접 추가할 항목을 입력해주세요"
                  class="flex-1"
                  :ui="{
                    base: 'text-sm md:text-sm font-medium font-bold py-3.5 bg-black ps-14 border border-primary',
                    leading: 'ps-3',
                    leadingIcon: 'bg-primary',
                  }"
                />
              </div>
            </UFormField>
          </div>
        </div>
      </template>
    </UCard>
    <!-- 우측 -->
    <div class="flex-1">
      <!-- Poll 옵션. Sticky -->
      <div class="sticky top-20 flex flex-col gap-8">
        <UCard class="frounded-2xl bg-white/3 p-4 shadow-md shadow-black hover:shadow-lg">
          <!-- hover 그림자 -->
          <div
            class="to-primary-500 absolute -inset-1 rounded-lg bg-linear-to-r from-cyan-400 opacity-0 blur transition duration-300 group-hover:opacity-75"
          ></div>

          <UButton
            type="submit"
            label="투표하기"
            icon="i-lucide-message-square-plus"
            variant="solid"
            :loading="isSubmitting"
            class="from-primary-300 to-primary-500 relative w-full items-center justify-center bg-linear-to-r py-4 hover:shadow-lg"
          />
        </UCard>
      </div>
    </div>
  </UForm>
</template>
