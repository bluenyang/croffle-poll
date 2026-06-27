<script setup lang="ts">
import type { UserAddRequestDto } from '~~/shared/dto';

  const emit = defineEmits<{
    (e: 'submit'): void;
  }>();

  const isNewUserModalOpen = defineModel<boolean>('open');

  const initFormState: UserAddRequestDto = {
    nickname: '',
    email: '',
    role: 'MEMBER',
  };

  const newUserForm = reactive({ ...initFormState });

  const toast = useToast();
  const pending = ref<boolean>(false);

  async function onAddNewUserSubmit() {
    console.log(newUserForm);

    if (!newUserForm.nickname || newUserForm.nickname.trim() === '') {
      toast.add({
        title: 'Warning',
        description: '이름을 입력해주세요.',
        type: 'foreground',
        color: 'warning',
      });
      return;
    }

    if (!newUserForm.email || newUserForm.email.trim() === '') {
      toast.add({
        title: 'Warning',
        description: '이메일을 입력해주세요.',
        type: 'foreground',
        color: 'warning',
      });
      return;
    }

    if (!newUserForm.role || newUserForm.role.trim() === '') {
      toast.add({
        title: 'Warning',
        description: '역할을 선택해주세요.',
        type: 'foreground',
        color: 'warning',
      });
      return;
    }

    pending.value = true;
    try {
      await $fetch('/api/admin/users', {
        method: 'POST',
        body: newUserForm,
      });

      toast.add({
        title: 'Success',
        description: 'User added successfully',
        type: 'foreground',
        color: 'success',
      });
    } catch (error) {
      console.error(error);
      toast.add({
        title: 'Error',
        description: 'Failed to add user',
        type: 'foreground',
        color: 'error',
      });
    } finally {
      pending.value = false;
      isNewUserModalOpen.value = false;
      emit('submit');
    }
  }

  watch(isNewUserModalOpen, (isOpen) => {
    if (isOpen) {
      Object.assign(newUserForm, initFormState);
    }
  });
</script>

<template>
  <UModal
    v-model:open="isNewUserModalOpen"
    title="New User"
    :ui="{
      footer: 'justify-end',
    }"
  >
    <template #body>
      <UForm id="add-user-form" class="flex flex-col gap-4" @submit="onAddNewUserSubmit">
        <UFormField label="Nickname" class="w-full" :ui="{ label: 'text-muted' }">
          <UInput
            v-model="newUserForm.nickname"
            placeholder="Nickname"
            :ui="{
              trailing: 'pl-4',
              base: 'bg-black py-4 text-muted',
            }"
            icon="i-lucide-user"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Email" class="w-full" :ui="{ label: 'text-muted' }">
          <UInput
            v-model="newUserForm.email"
            placeholder="Email"
            :ui="{
              trailing: 'pl-4',
              base: 'bg-black py-4 text-muted',
            }"
            icon="i-lucide-mail"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Role" class="w-full" :ui="{ label: 'text-muted' }">
          <USelectMenu
            v-model="newUserForm.role"
            :items="['USER', 'ADMIN']"
            placeholder="Select Role"
            :ui="{
              base: 'bg-black py-4 text-muted',
            }"
            icon="i-lucide-user"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton type="button" color="neutral" variant="outline" @click="isNewUserModalOpen = false">
        Cancel
      </UButton>
      <UButton type="submit" color="primary" form="add-user-form" :loading="pending">Save</UButton>
    </template>
  </UModal>
</template>
