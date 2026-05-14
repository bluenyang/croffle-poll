<script setup lang="ts">
  import { format } from 'date-fns';

  const router = useRouter();

  const { data: pollData, pending } = await useFetch<Poll[]>('/api/polls/active', {
    lazy: true,
    default: () => [],
  });
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <div class="flex w-full flex-col">
      <h1 class="text-3xl font-bold">현재 진행중인 투표</h1>
      <p class="text-muted mt-1">현재 진행 중인 투표 및 의견 수렴</p>
    </div>
    <div v-if="pending" class="flex items-center justify-center">
      <UIcon name="i-lucide-loader-2" class="animate-spin" />
    </div>
    <UEmpty
      v-else-if="pollData.length === 0"
      icon="i-lucide-archive-x"
      title="진행중인 투표가 없습니다"
      description="새로운 투표가 올라오길 기다려주세요"
      class="flex-1"
    />
    <div v-else class="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="poll in pollData" :key="poll.id" class="flex flex-col">
        <UCard
          :key="poll.id"
          class="hover:border-primary cursor-pointer transition-colors"
          @click="router.push(`/polls/${poll.id}`)"
        >
          <template #header>
            <div class="flex">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-vote" />
                  <UBadge>{{ poll.type }}</UBadge>
                </div>
                <UBadge v-if="poll.isAnonymous" color="info" variant="subtle">무기명</UBadge>
              </div>
              <h4 class="mt-2">{{ poll.title }}</h4>
              <p class="text-muted mt-1 text-sm">{{ poll.description }}</p>
            </div>
          </template>
          <template #default>
            <div class="">
              <div class="text-muted-foreground space-y-2 text-sm">
                <p>{{ `개설자: ${poll.creatorName}` }}</p>
                <p v-if="poll.createdAt">
                  {{ `생성일: ${format(poll.createdAt, 'yyyy-MM-dd HH:mm')}` }}
                </p>
                <p v-if="poll.closedAt">
                  {{ `마감일: ${format(poll.closedAt, 'yyyy-MM-dd HH:mm')}` }}
                </p>
              </div>
              <UButton class="mt-4 w-full" variant="outline">투표하기</UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
