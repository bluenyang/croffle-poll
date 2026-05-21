<script setup lang="ts">
  const { data: pollData, pending } = await useLazyFetch<Poll[]>('/api/polls/closed', {
    default: () => [],
  });
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <div class="flex w-full flex-col">
      <h1 class="text-3xl font-bold">완료된 투표 기록</h1>
      <p class="text-muted mt-1">과거 진행되었던 투표 및 의견 수렴 결과를 확인해 보세요</p>
    </div>
    <PollGrid
      :polls="pollData"
      :pending="pending"
      action-text="결과 보기"
      empty-title="완료된 투표가 없습니다"
      empty-description="종료된 투표 기록이 존재하지 않습니다"
    />
  </div>
</template>
