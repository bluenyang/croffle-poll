// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui'],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark', // 기본값 다크모드
    fallback: 'dark',
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',
  nitro: {
    preset: process.env.NITRO_PRESET || 'netlify',
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
