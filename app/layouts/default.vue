<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';

  const items: NavigationMenuItem[] = [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
    },
    {
      label: 'Active Votes',
      icon: 'i-lucide-vote',
      to: '/active-votes',
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
</script>

<template>
  <div :class="{ dark: true }" class="flex h-screen flex-row">
    <USidebar
      class="border-default flex h-full flex-col border-r"
      collapsible="none"
      side="left"
      variant="sidebar"
      :ui="{
        container: 'flex h-full flex-col',
      }"
    >
      <template #header>
        <div class="flex flex-row items-center justify-center gap-2 py-4">
          <img src="/logo.png" alt="main logo" class="size-12" />
          <div class="flex flex-col">
            <span class="text-xl font-bold">Croffle Dev.</span>
            <span class="text-muted text-sm">Development Team</span>
          </div>
        </div>
      </template>
      <template #default>
        <UNavigationMenu
          orientation="vertical"
          :items="items"
          :ui="{
            link: 'p-1.5 overflow-hidden',
          }"
        />
      </template>
      <template #footer>
        <UButton
          label="Create Vote"
          icon="i-lucide-message-square-plus"
          variant="solid"
          class="from-primary-300 to-primary-500 mb-16 w-full items-center justify-center bg-linear-to-r py-4"
        />
      </template>
    </USidebar>
    <div class="grow overflow-y-auto">
      <UHeader
        :ui="{
          container: 'mx-8 max-w-[90%]',
        }"
      >
        <template #title>
          <NuxtLink to="/" class="flex flex-row items-center gap-2 focus:outline-none">
            <p class="text-2xl font-bold">
              <span>Croffle Dev. </span>
              <span class="text-primary">Vote Platform</span>
            </p>
          </NuxtLink>
        </template>
        <template #right>
          <UTooltip text="Go to GitHub" :kbds="['meta', 'G']">
            <UButton
              color="neutral"
              variant="ghost"
              to="https://github.com/team-croffle/croffle-vote"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
            />
          </UTooltip>
        </template>
      </UHeader>
      <slot />
    </div>
  </div>
</template>
