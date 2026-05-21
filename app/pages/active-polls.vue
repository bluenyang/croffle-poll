<script setup lang="ts">
  const { data: pollData, pending } = await useLazyFetch<Poll[]>('/api/polls/active', {
    default: () => [],
  });
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <div class="flex w-full flex-col">
      <h1 class="text-3xl font-bold">현재 진행중인 투표</h1>
      <p class="text-muted mt-1">현재 진행 중인 투표 및 의견 수렴</p>
    </div>
    <PollGrid :polls="pollData" :pending="pending" action-text="투표하기" />
  </div>
</template>
