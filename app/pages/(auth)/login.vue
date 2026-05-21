<script setup lang="ts">
  import type { FormSubmitEvent, NavigationMenuItem } from '@nuxt/ui';

  interface LoginData {
    email: string;
    password: string;
  }

  definePageMeta({
    layout: false,
  });

  const show = ref(false);
  const pending = ref(false);

  const formData = reactive<LoginData>({
    email: '',
    password: '',
  });

  const { loggedIn, user, fetch: refreshSession } = useUserSession();
  const toast = useToast();

  // footer 네비게이션 메뉴 아이템 정의
  const footerItems: NavigationMenuItem[] = [
    {
      label: 'BlueNyang',
      to: 'https://www.bluenyang.kr',
      target: '_blank',
    },
    {
      label: 'Releases',
      to: 'https://github.com/team-croffle/croffle-poll/releases',
      target: '_blank',
    },
  ];

  async function onSubmit(_: FormSubmitEvent<LoginData>) {
    pending.value = true;
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: formData,
      });

      await refreshSession();

      if (loggedIn) {
        toast.add({
          title: 'Login Success',
          description: `You have been logged in successfully with ${user.value?.nickname ?? ''}!`,
          type: 'foreground',
        });
        navigateTo('/');
      }
    } catch (err) {
      console.error(err);

      toast.add({
        title: 'Login Failed',
        description: 'Failed to login',
        type: 'foreground',
        color: 'error',
      });
    } finally {
      pending.value = false;
    }
  }
</script>

<template>
  <div class="flex h-screen w-screen flex-col items-center justify-center gap-4">
    <div class="flex flex-col items-center gap-2">
      <div class="flex flex-row items-center gap-4">
        <img src="/logo.png" alt="main logo" class="size-10 select-none" />
        <h1 class="text-3xl font-bold">Croffle Poll</h1>
      </div>
      <div class="flex flex-row items-center gap-2">
        <UIcon name="i-lucide-lock" class="text-primary size-4" />
        <p class="text-muted">Secure Access for the Croffle Dev. Team</p>
      </div>
    </div>
    <UCard class="w-full max-w-md rounded-2xl bg-white/3 p-4 shadow-lg shadow-black">
      <UForm class="flex flex-col gap-4" @submit="onSubmit">
        <UFormField label="Email" class="w-full" :ui="{ label: 'text-muted' }">
          <UInput
            v-model="formData.email"
            class="w-full"
            placeholder="example@croffledev.kr"
            icon="i-lucide-mail"
            :ui="{
              base: 'bg-black py-4',
            }"
          />
        </UFormField>
        <UFormField label="Password" class="w-full" :ui="{ label: 'text-muted' }">
          <UInput
            v-model="formData.password"
            placeholder="Password"
            :type="show ? 'text' : 'password'"
            :ui="{
              trailing: 'pl-4',
              base: 'bg-black py-4',
            }"
            icon="i-lucide-lock"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton
          type="submit"
          label="Login"
          icon="i-lucide-log-in"
          variant="solid"
          class="from-primary-300 to-primary-500 relative mt-4 w-full items-center justify-center bg-linear-to-r py-4 hover:shadow-lg"
        />
      </UForm>
    </UCard>

    <UFooter class="w-full min-w-4/5">
      <template #left>
        <p class="text-muted text-sm">
          © {{ new Date().getFullYear() }} BlueNyang. All rights reserved.
        </p>
      </template>

      <UNavigationMenu :items="footerItems" variant="link" />

      <template #right>
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/team-croffle/croffle-poll"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </div>
</template>
