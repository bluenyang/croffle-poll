<script setup lang="ts">
  import type { BreadcrumbItem, TableColumn } from '@nuxt/ui';
  import type { PollResultData, PollVotesData } from '~/types/polls';

  const route = useRoute();
  const pollId = route.params.id as string;

  const { data } = await useFetch<PollResultData>(`/api/polls/${pollId}/responses`);
  const pollResults = computed(() => {
    return data.value?.votes.map((v) => {
      if (data.value?.optionType === 'DATE') {
        return {
          ...v,
          value: new Date(v.value).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      }
      return v;
    });
  });

  const topVotes = computed(() => {
    return pollResults.value?.filter((v) => v.rank === 1) ?? [];
  });

  const topVotesConsensus = computed<number>(() => {
    if (!data.value || !topVotes.value || topVotes.value.length < 1) return 0;
    return (topVotes.value[0]!.count / data.value.totalVotes) * 100;
  });

  const items = ref<BreadcrumbItem[]>([
    {
      label: 'active-polls',
      to: '/active-polls',
    },
    {
      label: 'Poll Results',
    },
  ]);

  const tableCols: TableColumn<PollVotesData>[] = [
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => row.getValue('value'),
    },
    {
      accessorKey: 'count',
      header: 'Count',
      cell: ({ row }) => row.getValue('count'),
    },
    {
      accessorKey: 'voters',
      header: 'Voters',
      cell: ({ row }) => (row.getValue('voters') as string[]).join(', '),
    },
    {
      accessorKey: 'rank',
      header: 'Rank',
      cell: ({ row }) => row.getValue('rank'),
    },
  ];
</script>

<template>
  <div class="flex flex-col gap-4">
    <UBreadcrumb :items="items" />

    <h1 class="text-4xl font-bold">{{ data?.title }}</h1>

    <p>{{ data?.description }}</p>

    <div class="flex w-full flex-row gap-8">
      <div class="flex flex-1 flex-col items-center gap-4">
        <UCard
          class="border-primary/20 w-4/5 border bg-linear-to-br from-cyan-600/50 to-gray-800/50 to-50%"
          :ui="{
            header: 'pb-8',
            body: 'sm:pt-8',
          }"
        >
          <template #header>
            <div class="flex flex-col gap-4">
              <h3 class="text-base font-bold text-cyan-300">가장 많이 투표된 항목</h3>
              <div v-if="topVotes.length > 0" class="flex w-full flex-col gap-2">
                <p v-for="vote in topVotes" :key="vote.value" class="text-2xl font-bold">
                  {{ vote.value }}
                </p>
              </div>
            </div>
          </template>
          <template #default>
            <div class="flex w-full flex-row items-center justify-evenly">
              <div class="flex flex-col gap-2">
                <p class="text-2xl font-bold">{{ `${topVotesConsensus.toFixed(2)}%` }}</p>
                <p class="text-sm font-bold">Consensus</p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-2xl font-bold">{{ `${data?.totalVotes}` }}</p>
                <p class="text-sm font-bold">Total Votes</p>
              </div>
            </div>
          </template>
        </UCard>
      </div>
      <div class="flex flex-2">
        <UCard
          class="w-full divide-gray-700 rounded-2xl bg-white/3 shadow-md shadow-black hover:shadow-lg"
          :ui="{
            body: 'sm:p-0 sm:pb-4',
          }"
        >
          <template #header>
            <h3 class="text-base font-bold text-cyan-300">투표자 목록</h3>
          </template>
          <template #default>
            <div class="flex w-full flex-col gap-2">
              <UTable
                ref="table"
                :data="pollResults"
                :columns="tableCols"
                sticky
                class="h-full min-h-96 w-full"
              >
                <template #expanded="{ row }">
                  <pre>{{ row.original }}</pre>
                </template>
              </UTable>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
