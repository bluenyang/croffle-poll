<script setup lang="ts">
  import type { User } from '~/types/users';

  interface EditPasswordModalProps {
    fetchUrl: string;
  }

  const { fetchUrl } = defineProps<EditPasswordModalProps>();

  const emit = defineEmits<{
    (e: 'submit'): void;
  }>();

  const user = defineModel<User | null>('user');
  const isEditPasswordModalOpen = defineModel<boolean>('open');

  const newPassword = ref<string>('');
  const showPassword = ref<boolean>(false);

  const toast = useToast();
  const pending = ref<boolean>(false);

  async function onEditPasswordSumit() {
    if (!newPassword.value || newPassword.value.trim() === '') {
      toast.add({
        title: 'Warning',
        description: '새 비밀번호를 입력해주세요.',
        type: 'foreground',
        color: 'warning',
      });
      return;
    }

    pending.value = true;
    try {
      await $fetch(fetchUrl, {
        method: 'PATCH',
        body: {
          newPassword: newPassword.value,
          userId: user.value?.id ?? null,
        },
      });

      toast.add({
        title: 'Success',
        description: 'Password edited successfully',
        type: 'foreground',
        color: 'success',
      });
    } catch (error) {
      console.error(error);
      toast.add({
        title: 'Error',
        description: 'Failed to edit password',
        type: 'foreground',
        color: 'error',
      });
    } finally {
      pending.value = false;
      isEditPasswordModalOpen.value = false;
      emit('submit');
    }
  }

  watch(isEditPasswordModalOpen, (isOpen) => {
    if (isOpen) {
      newPassword.value = '';
      showPassword.value = false;
    }
  });
</script>

<template>
  <UModal
    v-model:open="isEditPasswordModalOpen"
    title="Edit Password"
    :ui="{
      footer: 'justify-end',
    }"
  >
    <template #body>
      <UForm id="edit-password-form" class="flex flex-col gap-4" @submit="onEditPasswordSumit">
        <UFormField label="New Password" class="w-full" :ui="{ label: 'text-muted' }">
          <UInput
            v-model="newPassword"
            placeholder="Password"
            :type="showPassword ? 'text' : 'password'"
            :ui="{
              trailing: 'pl-4',
              base: 'bg-black py-4 text-muted',
            }"
            icon="i-lucide-lock"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        @click="isEditPasswordModalOpen = false"
      >
        Cancel
      </UButton>
      <UButton type="submit" color="primary" form="edit-password-form" :loading="pending">
        Save
      </UButton>
    </template>
  </UModal>
</template>
