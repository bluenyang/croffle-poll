// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-auth-utils'],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'system', // 기본값 다크모드
    fallback: 'dark',
    classSuffix: '',
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    initAdmin: {
      initEmail: process.env.INIT_ADMIN_EMAIL,
      password: process.env.INIT_ADMIN_PASSWORD,
    },
  },
  routeRules: {
    '/': { prerender: false },
  },

  compatibilityDate: '2025-01-15',
  nitro: {
    preset: 'node-server',
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },
});
