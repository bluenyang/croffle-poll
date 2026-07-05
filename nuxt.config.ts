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
    db: {
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE
    },
    authentikAdminGroup: process.env.AUTHENTIK_ADMIN_GROUP,
  },
  routeRules: {
    '/': { prerender: false },
  },

  compatibilityDate: '2025-01-15',
  nitro: {
    preset: 'node-server',
  },
  vite: {
    optimizeDeps: {
      include: [
        'date-fns',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
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
