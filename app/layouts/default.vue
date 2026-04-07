<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';

  // aside 네비게이션 메뉴 아이템 정의
  const navItems: NavigationMenuItem[] = [
    {
      label: 'Home',
      icon: 'i-lucide-house',
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
</script>

<template>
  <!-- Main Layout -->
  <div :class="{ dark: true }" class="flex h-screen flex-row">
    <USidebar
      class="border-default flex h-full shrink-0 flex-col border-r"
      collapsible="none"
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
            link: 'px-2 py-4 overflow-hidden',
          }"
        />
      </template>
      <template #footer>
        <!-- Create Poll Button -->
        <NuxtLink
          to="/poll/new"
          class="focus:ring-primary mb-16 w-full rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          <UButton
            label="Create Poll"
            icon="i-lucide-message-square-plus"
            variant="solid"
            class="from-primary-300 to-primary-500 w-full items-center justify-center bg-linear-to-r py-4"
          />
        </NuxtLink>
      </template>
    </USidebar>
    <!-- Main Content -->
    <div class="flex grow flex-col overflow-y-auto">
      <!-- Main Content Header -->
      <UHeader
        class="py-4"
        :ui="{
          container: 'mx-8 max-w-[90%]',
        }"
      >
        <template #title>
          <!-- Title Link -->
          <NuxtLink to="/" class="flex flex-row items-center gap-2 focus:outline-none">
            <p class="text-2xl font-bold">
              <span>Croffle Dev. </span>
              <span class="text-primary">Poll Platform</span>
            </p>
          </NuxtLink>
        </template>
        <template #right>
          <!-- GitHub Link -->
          <UTooltip text="Go to GitHub">
            <UButton
              color="neutral"
              variant="ghost"
              to="https://github.com/team-croffle/croffle-poll/releases"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
            />
          </UTooltip>
        </template>
      </UHeader>
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
  </div>
</template>
