<script setup lang="ts">
  import { format } from 'date-fns';

  defineProps<{
    poll: Poll;
    actionText?: string;
  }>();

  const router = useRouter();
</script>

<template>
  <UCard
    class="hover:border-primary cursor-pointer transition-colors"
    @click="router.push(`/polls/${poll.id}`)"
  >
    <template #header>
      <div class="flex flex-col">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-vote" />
            <UBadge>{{ poll.type }}</UBadge>
          </div>
          <UBadge v-if="poll.isAnonymous" color="info" variant="subtle">무기명</UBadge>
        </div>
        <h4 class="mt-2 text-lg font-semibold">{{ poll.title }}</h4>
        <p class="text-muted mt-1 text-sm">{{ poll.description }}</p>
      </div>
    </template>
    <template #default>
      <div>
        <div class="text-muted-foreground space-y-2 text-sm">
          <p>{{ `개설자: ${poll.creatorName}` }}</p>
          <p v-if="poll.createdAt">
            {{ `생성일: ${format(poll.createdAt, 'yyyy-MM-dd HH:mm')}` }}
          </p>
          <p v-if="poll.closedAt">
            {{ `마감일: ${format(poll.closedAt, 'yyyy-MM-dd HH:mm')}` }}
          </p>
        </div>
        <UButton v-if="actionText" class="mt-4 w-full" variant="outline">
          {{ actionText }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>
