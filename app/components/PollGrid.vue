<script setup lang="ts">
  withDefaults(
    defineProps<{
      polls: Poll[];
      pending: boolean;
      actionText?: string;
      emptyTitle?: string;
      emptyDescription?: string;
    }>(),
    {
      actionText: '투표하기',
      emptyTitle: '진행중인 투표가 없습니다',
      emptyDescription: '새로운 투표가 올라오길 기다려주세요',
    }
  );
</script>

<template>
  <div>
    <div v-if="pending" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="animate-spin text-3xl" />
    </div>
    <UEmpty
      v-else-if="polls.length === 0"
      icon="i-lucide-archive-x"
      :title="emptyTitle"
      :description="emptyDescription"
      class="flex-1"
    />
    <div v-else class="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <PollCard
        v-for="poll in polls"
        :key="poll.id"
        :poll="poll"
        :action-text="actionText"
      />
    </div>
  </div>
</template>
