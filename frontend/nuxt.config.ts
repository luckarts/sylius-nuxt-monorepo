export default defineNuxtConfig({
  // Mode de développement
  devtools: { enabled: true },

  // TypeScript strict
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // Modules
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/i18n', '@nuxtjs/tailwindcss'],

  // CSS
  css: ['~/assets/styles/main.css'],

  // Auto-import des composants
  components: [
    {
      path: '~/components',
      pathPrefix: false, // Ne pas ajouter le chemin comme prefix au nom
    },
  ],

  // Variables d'environnement
  runtimeConfig: {
    // Privé (serveur seulement)
    apiSecret: '',
    syliusApiUrl: process.env.SYLIUS_API_URL || 'http://localhost:8000',

    // Public (client + serveur)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '', // Utilise le proxy local
      appName: 'Sylius Nuxt Application',
    },
  },

  // Route rules (ISR, SSR, SPA)
  routeRules: {
    '/': { isr: 3600 }, // Incremental Static Regeneration
    '/admin/**': { ssr: false }, // SPA pour admin
    '/api/**': {
      cors: true,
      proxy: { to: `${process.env.SYLIUS_API_URL || 'http://localhost:8000'}/api/**` },
    },
  },

  // App config
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Sylius Nuxt Application',
      meta: [{ name: 'description', content: 'Application e-commerce avec Sylius et Nuxt' }],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Nitro (server)
  nitro: {
    compressPublicAssets: true,
    preset: 'node-server', // ou 'vercel', 'netlify', etc.
  },

  // Build
  build: {
    transpile: [],
  },

  // Vite
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/_variables.scss" as *;',
        },
      },
    },
  },

  // Internationalisation
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'fr',
    bundle: {
      optimizeTranslationDirective: false, // Disable deprecated feature
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    locales: [
      {
        code: 'fr',
        iso: 'fr-FR',
        file: 'fr-FR.ts',
        name: 'Français',
      },
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.ts',
        name: 'English',
      },
    ],
    langDir: 'locales',
  },

  // Expérimental
  experimental: {
    payloadExtraction: false,
    viewTransition: true,
  },

  compatibilityDate: '2025-01-17',
})
