<script setup lang="ts">
  import type { FormSubmitEvent } from '@nuxt/ui';

  import IconRadioGroup from '~/components/IconRadioGroup.vue';
  import SwitchFormField from '~/components/SwitchFormField.vue';
  import type { PollCreationState } from '~/types/polls';

  const formState = reactive<PollCreationState>({
    title: '',
    description: '',
    isMultipleChoice: false,
    allowCustomOptions: false,
    isAnonymous: false,
    optionType: 'TEXT',
    options: [],
  });

  const pending = ref<boolean>(false);

  const toast = useToast();

  async function onSubmit(_: FormSubmitEvent<PollCreationState>) {
    pending.value = true;
    try {
      const payload = {
        ...formState,
        optionType: formState.optionType,
        options: formState.options.map((opt) => {
          if (formState.optionType === 'TEXT') {
            return { content: opt.text };
          } else {
            const date = opt.date?.toString() ?? '';
            const time = opt.time?.toString() ?? '00:00';
            return { content: `${date}T${time}` };
          }
        }),
      };

      await $fetch('/api/polls', {
        method: 'POST',
        body: payload,
      });

      toast.add({
        title: 'Success',
        description: 'Poll created successfully',
        type: 'foreground',
      });

      navigateTo('/active-polls');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);

      const serverMessage = e.data?.message || 'Failed to create poll';

      toast.add({
        title: 'Error',
        description: serverMessage,
        type: 'foreground',
        color: 'error',
      });

      if (e.statusCode === 401) {
        navigateTo('/login');
      }
    } finally {
      pending.value = false;
    }
  }
</script>

<template>
  <div class="flex flex-col">
    <!-- 페이지 헤더 -->
    <h1 class="mb-2 text-base font-bold text-cyan-500">Draft Phase</h1>
    <h2 class="text-3xl font-bold">Create New Poll</h2>
    <p class="text-muted mt-2">
      Create a new poll by filling out the form below. You can add multiple options and set the poll
      duration. Once you're done, click "Create Poll" to publish it.
    </p>
    <!-- 작섣 폼 -->
    <UForm class="my-8" @submit="onSubmit">
      <!-- 폼 레이아웃 - 좌우 분리 -->
      <div class="mt-4 flex w-full flex-row gap-8">
        <!-- 폼 입력 영역 -->
        <div class="flex flex-2 flex-col gap-4">
          <!-- 타이틀 및 설명 -->
          <UCard class="rounded-2xl bg-white/3 p-4 shadow-md shadow-black hover:shadow-lg">
            <div class="flex flex-col gap-8">
              <UFormField
                label="Title"
                name="title"
                :ui="{
                  label: 'text-cyan-400 font-bold text-base',
                }"
              >
                <UInput
                  v-model="formState.title"
                  placeholder="Enter poll title"
                  class="w-full"
                  :ui="{ base: 'text-base md:text-base p-2 bg-black' }"
                />
              </UFormField>
              <UFormField
                label="Description"
                name="description"
                :ui="{
                  label: 'text-cyan-400 font-bold text-base',
                }"
              >
                <UTextarea
                  v-model="formState.description"
                  placeholder="Enter poll description"
                  :rows="5"
                  class="w-full"
                  :ui="{ base: 'text-base md:text-base p-2 bg-black' }"
                />
              </UFormField>
            </div>
          </UCard>
          <!-- Poll 옵션의 타입 선택기 -->
          <IconRadioGroup v-model="formState.optionType" />
          <!-- 옵션 편집기. 선택된 옵션 타입에 따라 동적으로 렌더링 -->
          <OptionEditor v-model="formState.options" :type="formState.optionType" />
        </div>
        <!-- 우측 -->
        <div class="flex-1">
          <!-- Poll 옵션. Sticky -->
          <div class="sticky top-20 flex flex-col gap-8">
            <UCard
              class="divide-gray-700 rounded-2xl bg-white/3 shadow-md shadow-black hover:shadow-lg"
            >
              <!-- 옵션 카드 헤더 -->
              <template #header>
                <h3 class="text-lg font-bold text-cyan-400">Poll Options</h3>
              </template>
              <template #default>
                <div class="flex flex-col gap-2">
                  <!-- 스위치 형태 -->
                  <SwitchFormField
                    v-model="formState.isAnonymous"
                    label="Anonymous"
                    name="isAnonymous"
                    description="Hide the identity of the voter"
                  />
                  <SwitchFormField
                    v-model="formState.isMultipleChoice"
                    label="Allow Multiple Selections"
                    name="isMultipleChoice"
                    description="Allow voters to select multiple options when voting"
                  />
                  <SwitchFormField
                    v-model="formState.allowCustomOptions"
                    label="Allow Custom Options"
                    name="allowCustomOptions"
                    description="Allow voters to add their own options"
                  />
                </div>
              </template>
            </UCard>

            <!-- 생성버튼 -->
            <div class="group relative inline-block cursor-pointer">
              <!-- hover 그림자 -->
              <div
                class="to-primary-500 absolute -inset-1 rounded-lg bg-linear-to-r from-cyan-400 opacity-0 blur transition duration-300 group-hover:opacity-75"
              ></div>

              <UButton
                type="submit"
                label="Create Poll"
                icon="i-lucide-message-square-plus"
                variant="solid"
                :loading="pending"
                class="from-primary-300 to-primary-500 relative w-full items-center justify-center bg-linear-to-r py-4 hover:shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>
