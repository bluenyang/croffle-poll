<script lang="tsx" setup>
  import type { TableColumn } from '@nuxt/ui';

  type Poll = {
    id: number;
    title: string;
    description: string;
    creatorName: string; // 투표 생성자 이름
    isAnonymous: boolean;
    isMultipleChoice: boolean;
    allowCustomOptions: boolean;
    optionType: 'TEXT' | 'DATE';
    isClosed: boolean;
    createdAt: string;
  };

  // 컴포넌트 레퍼런스 - Table에서 사용
  const UButton = resolveComponent('UButton');
  const UBadge = resolveComponent('UBadge');
  const UDropdownMenu = resolveComponent('UDropdownMenu');

  // 라우터
  const router = useRouter();

  // 테이블 컬럼 정의
  const columns: TableColumn<Poll>[] = [
    {
      accessorKey: 'id',
      header: '#',
      cell: ({ row }) => `#${row.getValue('id')}`,
      enableSorting: true,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => row.getValue('title'),
      enableSorting: true,
    },
    {
      accessorKey: 'creatorName',
      meta: {
        class: {
          th: 'text-center',
          td: 'text-center',
        },
      },
      header: 'Creator Name',
      cell: ({ row }) => row.getValue('creatorName'),
      enableSorting: true,
    },
    {
      accessorKey: 'isAnonymous',
      meta: {
        class: {
          th: 'text-center',
          td: 'text-center',
        },
      },
      header: 'isAnonymous',
      cell: ({ row }) => {
        const isAnonymous = row.getValue('isAnonymous');
        if (isAnonymous) {
          return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'Yes');
        }
        return h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'No');
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isMultipleChoice',
      meta: {
        class: {
          th: 'text-center',
          td: 'text-center',
        },
      },
      header: 'isMultipleChoice',
      cell: ({ row }) => {
        const isMultipleChoice = row.getValue('isMultipleChoice');
        if (isMultipleChoice) {
          return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'Yes');
        }
        return h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'No');
      },
      enableSorting: false,
    },
    {
      accessorKey: 'allowCustomOptions',
      meta: {
        class: {
          th: 'text-center',
          td: 'text-center',
        },
      },
      header: 'allowCustomOptions',
      cell: ({ row }) => {
        const allowCustomOptions = row.getValue('allowCustomOptions');
        if (allowCustomOptions) {
          return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'Yes');
        }
        return h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'No');
      },
      enableSorting: false,
    },
    {
      accessorKey: 'optionType',
      meta: {
        class: {
          th: 'text-center',
          td: 'text-center',
        },
      },
      header: 'optionType',
      cell: ({ row }) => {
        const optionType = row.getValue('optionType');
        if (optionType === 'TEXT') {
          return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'TEXT');
        }
        return h(UBadge, { color: 'info', variant: 'subtle' }, () => 'DATE');
      },
      enableSorting: true,
    },
    {
      accessorKey: 'isClosed',
      meta: {
        class: {
          th: 'text-center',
          td: 'text-center',
        },
      },
      header: 'isClosed',
      cell: ({ row }) => {
        const isClosed = row.getValue('isClosed');
        if (isClosed) {
          return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'Yes');
        }
        return h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'No');
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString(),
      enableSorting: true,
    },
    {
      id: 'actions',
      enableHiding: false,
      meta: {
        class: {
          th: 'text-center',
          td: 'text-center',
        },
      },
      header: 'Action',
      cell: ({ row }) => {
        // 향후에 다른 Action 추가를 상정하여 DropdownMenu로 구현. 현재는 투표를 하러 가는 액션 하나만 존재
        const items = [
          {
            type: 'label',
            label: 'Actions',
          },
          {
            label: 'Vote',
            onSelect() {
              router.push(`/poll/${row.original.id}/vote`);
            },
          },
          {
            label: 'View Results',
            onSelect() {
              router.push(`/poll/${row.original.id}/results`);
            },
          },
        ];

        return h(
          UDropdownMenu,
          {
            content: {
              align: 'end',
            },
            items,
            'aria-label': 'Actions dropdown',
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-arrow-right',
              color: 'neutral',
              class: 'text-muted',
              variant: 'ghost',
              'aria-label': 'Actions dropdown',
            })
        );
      },
    },
  ];

  // API에서 활성화된 투표 목록을 가져오는 fetcher.
  // useFetch === Nuxt의 Composition API
  const { data: polls, pending } = useFetch<Poll[]>('/api/polls/active', {
    lazy: true,
    default: () => [], // fetch가 완료되기 전까지 들어있을 기본값
  });

  // 테이블 레퍼런스. 필터링된 행의 개수를 보여주는 데 사용
  const table = useTemplateRef('table');
</script>

<template>
  <div class="flex h-full flex-col items-center">
    <div class="divide-accented w-full flex-1 divide-y">
      <div class="flex items-center gap-2 overflow-x-auto px-4 py-3.5">
        <UInput
          :model-value="(table?.tableApi?.getColumn('email')?.getFilterValue() as string)"
          class="max-w-sm min-w-[12ch]"
          placeholder="필터링 개발 중..."
          disabled
          @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
        />
      </div>

      <UTable ref="table" :data="polls" :columns="columns" :loading="pending" sticky class="h-96">
        <template #expanded="{ row }">
          <pre>{{ row.original }}</pre>
        </template>
      </UTable>

      <div class="text-muted px-4 py-3.5 text-sm">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} active poll(s) found.
      </div>
    </div>
  </div>
</template>
