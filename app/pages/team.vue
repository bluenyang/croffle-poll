<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';

  import AddNewUserModal from '~/components/modal/AddNewUserModal.vue';
  import DeleteUserModal from '~/components/modal/DeleteUserModal.vue';
  import EditPasswordModal from '~/components/modal/EditPasswordModal.vue';
  import type { User } from '~/types/users';

  const UDropdownMenu = resolveComponent('UDropdownMenu');
  const UButton = resolveComponent('UButton');

  const { data: users, status, execute } = await useLazyFetch<User[]>('/api/admin/users', {});

  const isNewUserModalOpen = ref<boolean>(false);
  const isEditPasswordModalOpen = ref<boolean>(false);
  const isDeleteModalOpen = ref<boolean>(false);
  const selectedUser = ref<User | null>(null);

  const tableCols: TableColumn<User>[] = [
    {
      accessorKey: 'id',
      header: '#',
      cell: ({ row }) => `#${row.getValue('id')}`,
      enableSorting: true,
    },
    {
      accessorKey: 'nickname',
      header: 'Nickname',
      cell: ({ row }) => row.getValue('nickname'),
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => row.getValue('email'),
      enableSorting: true,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => row.getValue('role'),
      enableSorting: true,
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
            label: 'Edit Password',
            onSelect() {
              selectedUser.value = row.original;
              isEditPasswordModalOpen.value = true;
            },
          },
          {
            label: 'Delete',
            onSelect() {
              selectedUser.value = row.original;
              isDeleteModalOpen.value = true;
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
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex w-full flex-row items-center justify-between">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-bold">Team Workspace Management</h1>
        <p class="text-muted">해당 서비스를 이용하는 팀원들의 정보를 관리할 수 있습니다.</p>
      </div>
      <UButton
        icon="i-lucide-user-plus"
        color="primary"
        class="bg-primary/20 text-primary border-primary h-15 border px-8 py-2 text-base font-bold"
        @click="isNewUserModalOpen = true"
      >
        <span>Add New Member</span>
      </UButton>
    </div>

    <UTable
      ref="table"
      :data="users"
      :columns="tableCols"
      :loading="status === 'pending'"
      sticky
      class="h-96"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>

    <!-- New User -->
    <AddNewUserModal v-model:open="isNewUserModalOpen" @submit="execute" />

    <!-- Password Modal -->
    <EditPasswordModal
      v-model:open="isEditPasswordModalOpen"
      v-model:user="selectedUser"
      :fetch-url="`/api/admin/users/password`"
      @submit="execute"
    />

    <!-- Delete Modal -->
    <DeleteUserModal
      v-model:open="isDeleteModalOpen"
      v-model:user="selectedUser"
      :fetch-url="`/api/admin/users`"
      @submit="execute"
    />
  </div>
</template>
