<script lang="ts" setup>
  import type { BreadcrumbItem } from '@nuxt/ui';

  import PollVoter from '~/components/PollVoter.vue';
  import type { PollData } from '~/types/polls';

  const route = useRoute();
  const pollId = route.params.id as string;

  const { data } = await useFetch<PollData>(`/api/polls/${pollId}`);

  const items = ref<BreadcrumbItem[]>([
    {
      label: 'active-polls',
      to: '/active-polls',
    },
    {
      label: 'Poll Details',
    },
  ]);

  const selectedOptions = ref<{ id: string; selected: boolean }[]>([]);

  onMounted(() => {
    data.value?.options.forEach((option) => {
      selectedOptions.value.push({
        id: option.id,
        selected: false,
      });
    });
  });
</script>

<template>
  <div class="flex flex-col">
    <UBreadcrumb :items="items" />

    <div class="mt-4 flex w-full flex-row gap-8">
      <!-- 폼 입력 영역 -->
      <div class="flex flex-2 flex-col gap-4">
        <!-- 타이틀 및 설명 -->
        <UCard class="rounded-2xl bg-white/3 p-4 shadow-md shadow-black hover:shadow-lg">
          <template #header>
            <div class="flex flex-col items-start justify-between gap-4">
              <h1 class="text-2xl font-bold">{{ data?.title }}</h1>
              <div class="text-muted flex flex-row items-center gap-2 text-sm">
                <UIcon name="i-lucide-clock" />
                <span>Created: </span>
                <span>
                  {{
                    new Date(data?.createdAt ?? '').toLocaleString('ko-KR', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })
                  }}
                </span>
              </div>
              <!-- 익명, 중복, 커스텀 옵션 여부 정보 -->
              <div class="text-muted flex flex-row items-center gap-4 text-sm">
                <div
                  v-if="data?.isAnonymous"
                  class="text-secondary flex flex-row items-center gap-1"
                >
                  <UIcon name="i-lucide-user-lock" />
                  <span>익명 투표</span>
                </div>
                <div v-else class="text-primary flex flex-row items-center gap-1">
                  <UIcon name="i-lucide-user" />
                  <span>공개(기명) 투표</span>
                </div>
                <div
                  v-if="data?.isMultipleChoice"
                  class="text-secondary flex flex-row items-center gap-1"
                >
                  <UIcon name="i-lucide-list-checks" />
                  <span>복수 선택 가능</span>
                </div>
                <div v-else class="text-primary flex flex-row items-center gap-1">
                  <UIcon name="i-lucide-list" />
                  <span>단일 선택</span>
                </div>
                <div
                  v-if="data?.allowCustomOptions"
                  class="text-secondary flex flex-row items-center gap-1"
                >
                  <UIcon name="i-lucide-ticket-plus" />
                  <span>커스텀 옵션 가능</span>
                </div>
                <div v-else class="text-primary flex flex-row items-center gap-1">
                  <UIcon name="i-lucide-ticket-x" />
                  <span>커스텀 옵션 불가능</span>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <!-- 설명 -->
            <div class="flex flex-col gap-2">
              <h3 class="flex flex-row items-center gap-2 text-lg font-bold">
                <UIcon name="i-lucide-file-text" />
                <span>내용</span>
              </h3>
              <p class="text-muted">{{ data?.description ?? '내용이 없습니다.' }}</p>
            </div>
          </template>
        </UCard>
        <!-- 투표 공간 -->
        <PollVoter v-if="data" :poll="data" />
      </div>
    </div>
  </div>
</template>
