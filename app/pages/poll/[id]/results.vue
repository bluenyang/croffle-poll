<script setup lang="ts">
  import type { BreadcrumbItem } from '@nuxt/ui';
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
      label: 'Poll Results',
    },
  ]);
</script>

<template>
  <div class="flex flex-col gap-4">
    <UBreadcrumb :items="items" />

    <h1 class="text-4xl font-bold">{{ data?.title }}</h1>

    <p>{{ data?.description }}</p>
  </div>
</template>
