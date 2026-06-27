<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';

  definePageMeta({
    layout: false,
  });

  const { loggedIn } = useUserSession();

  // If already logged in, redirect to home
  onMounted(() => {
    if (loggedIn.value) {
      navigateTo('/');
    }
  });

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
      <div class="flex flex-col gap-4 text-center">
        <p class="text-muted mb-4 text-sm">
          Welcome! Please sign in with your Authentik account to continue.
        </p>

        <UButton
          to="/auth/authentik"
          label="Login with Authentik"
          icon="i-lucide-log-in"
          variant="solid"
          class="from-primary-300 to-primary-500 relative w-full items-center justify-center bg-linear-to-r py-4 hover:shadow-lg"
          external
        />
      </div>
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
