<script lang="tsx" setup>
  import type { TableColumn } from '@nuxt/ui';

  const UButton = resolveComponent('UButton');
  const UBadge = resolveComponent('UBadge');
  const UDropdownMenu = resolveComponent('UDropdownMenu');

  const router = useRouter();

  const { data: votes } = await useFetch('/api/votes/active');
  console.log('Fetched active votes:', votes.value);

  type Vote = {
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

  const columns: TableColumn<Vote>[] = [
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
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => row.getValue('description'),
      enableSorting: false,
    },
    {
      accessorKey: 'creatorName',
      header: 'Creator Name',
      cell: ({ row }) => row.getValue('creatorName'),
      enableSorting: true,
    },
    {
      accessorKey: 'isAnonymous',
      header: 'isAnonymous',
      cell: ({ row }) => {
        const isAnonymous = row.getValue('isAnonymous');
        if (isAnonymous) {
          return h(UBadge, { color: 'neutral', variant: 'subtle' }, () => 'Yes');
        }
        return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'No');
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isMultipleChoice',
      header: 'isMultipleChoice',
      cell: ({ row }) => {
        const isMultipleChoice = row.getValue('isMultipleChoice');
        if (isMultipleChoice) {
          return h(UBadge, { color: 'neutral', variant: 'subtle' }, () => 'Yes');
        }
        return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'No');
      },
      enableSorting: false,
    },
    {
      accessorKey: 'allowCustomOptions',
      header: 'allowCustomOptions',
      cell: ({ row }) => {
        const allowCustomOptions = row.getValue('allowCustomOptions');
        if (allowCustomOptions) {
          return h(UBadge, { color: 'neutral', variant: 'subtle' }, () => 'Yes');
        }
        return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'No');
      },
      enableSorting: false,
    },
    {
      accessorKey: 'optionType',
      header: 'optionType',
      cell: ({ row }) => {
        const optionType = row.getValue('optionType');
        if (optionType === 'TEXT') {
          return h(UBadge, { color: 'neutral', variant: 'subtle' }, () => 'TEXT');
        }
        return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'DATE');
      },
      enableSorting: true,
    },
    {
      accessorKey: 'isClosed',
      header: 'isClosed',
      cell: ({ row }) => {
        const isClosed = row.getValue('isClosed');
        if (isClosed) {
          return h(UBadge, { color: 'neutral', variant: 'subtle' }, () => 'Yes');
        }
        return h(UBadge, { color: 'success', variant: 'subtle' }, () => 'No');
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
          td: 'text-right',
        },
      },
      header: 'Action',
      cell: ({ row }) => {
        const items = [
          {
            type: 'label',
            label: 'Actions',
          },
          {
            label: 'Go to details',
            onSelect() {
              router.push(`/votes/${row.original.id}`);
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
              variant: 'ghost',
              'aria-label': 'Actions dropdown',
            })
        );
      },
    },
  ];

  const activeVotes = computed<Vote[]>(() => {
    return (votes.value as Vote[]) || [];
  });

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

      <UTable ref="table" :data="activeVotes" :columns="columns" sticky class="h-96">
        <template #expanded="{ row }">
          <pre>{{ row.original }}</pre>
        </template>
      </UTable>

      <div class="text-muted px-4 py-3.5 text-sm">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} active vote(s) found.
      </div>
    </div>
  </div>
</template>
