<script setup lang="ts">
  import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui';
  import EditPasswordModal from '~/components/modal/EditPasswordModal.vue';

  const { clear } = useUserSession();
  const toast = useToast();
  const colorMode = useColorMode();

  const isChangePasswordModalOpen = ref<boolean>(false);

  // aside 네비게이션 메뉴 아이템 정의
  const navItems: NavigationMenuItem[][] = [
    [
      {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/',
      },
      {
        label: 'Active Polls',
        icon: 'i-lucide-vote',
        to: '/active-polls',
      },
      {
        label: 'History',
        icon: 'i-lucide-history',
        to: '/history',
      },
      {
        label: 'Team',
        icon: 'i-lucide-users',
        to: '/team',
      },
    ],
    [
      {
        label: 'Create New',
        icon: 'i-lucide-plus',
        to: '/poll/new',
        class: 'p-2 border border-muted rounded-lg hover:border-inverted/50',
      },
    ],
  ];

  const navFooterItems = computed<NavigationMenuItem[]>(() => [
    {
      label: colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode',
      icon: colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon',
      class: 'hover:cursor-pointer',
      onSelect() {
        colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
      },
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings',
    },
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      class: 'hover:cursor-pointer',
      onSelect: onLogout,
    },
  ]);

  const profileItems: DropdownMenuItem[] = [
    {
      type: 'label',
      label: 'Profile Actions',
    },
    {
      label: 'Change Password',
      onSelect() {
        isChangePasswordModalOpen.value = true;
      },
    },
  ];

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

  async function onLogout() {
    try {
      // 세션 삭제 및 프론트 상태 초기화
      await clear();

      toast.add({
        title: 'Logout Success',
        description: 'You have been logged out successfully.',
        type: 'foreground',
      });

      // 로그아웃 후 로그인 페이지로 이동
      await navigateTo('/login');
    } catch {
      toast.add({
        title: 'Logout Failed',
        description: 'Failed to logout',
        type: 'foreground',
        color: 'error',
      });
    }
  }
</script>

<template>
  <!-- Main Layout -->
  <div class="flex h-screen flex-row">
    <USidebar
      class="flex h-full shrink-0 flex-col"
      collapsible="offcanvas"
      side="left"
      variant="sidebar"
      :ui="{
        container: 'flex h-full flex-col',
      }"
    >
      <!-- Sidebar Header -->
      <template #header>
        <div class="flex flex-row items-center justify-center gap-2 py-4">
          <!-- Logo -->
          <img src="/logo.png" alt="main logo" class="size-12 select-none" />
          <!-- Brand Name -->
          <div class="flex flex-col">
            <span class="cursor-default text-xl font-bold select-none">Croffle Dev.</span>
            <span class="text-muted cursor-default text-sm select-none">Development Team</span>
          </div>
        </div>
      </template>
      <template #default>
        <!-- Navigation Menu -->
        <UNavigationMenu
          orientation="vertical"
          :items="navItems"
          :ui="{
            link: 'px-2 py-4 overflow-hidden not-data-[active]:text-highlighted',
          }"
        />
      </template>
      <template #footer>
        <UNavigationMenu
          class="w-full"
          orientation="vertical"
          :items="navFooterItems"
          :ui="{
            link: 'px-2 py-4 overflow-hidden not-data-[active]:text-highlighted',
          }"
        />
      </template>
    </USidebar>
    <!-- Main Content -->
    <div class="flex grow flex-col overflow-y-auto">
      <!-- Main Content Header -->
      <div class="mx-8 mt-4 max-w-[90%] grow flex-col gap-4">
        <slot />
      </div>
      <UFooter>
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
    <EditPasswordModal v-model:open="isChangePasswordModalOpen" :fetch-url="`/api/auth/password`" />
  </div>
</template>
