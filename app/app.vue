<script setup>
  useHead({
    meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    link: [{ rel: 'icon', href: '/favicon.ico' }],
    htmlAttrs: {
      lang: 'ko',
    },
  });

  const title = 'Croffle Dev. Poll Platform';
  const description =
    'Croffle Dev. Poll Platform is a web application designed to facilitate the creation and management of polls for developers. It provides an intuitive interface for users to create, share, and analyze polls on various topics related to software development.';

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
  });
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
