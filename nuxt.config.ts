// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';


export default {

  // Nutze SSR für Heroku
  target: 'server',

  server: {
      host: '0.0.0.0',
      port: process.env.PORT || 3000
  },

  ssr: false,

  modules: [
      '@primevue/nuxt-module',
      '@nuxt/eslint',
      '@unocss/nuxt'
  ],

  primevue: {
      options: {
          theme: {
              options: {
                  cssLayer: { name: 'primevue', order: 'preflights, primevue, icons, shortcuts, default' },
                  prefix: 'p',
                  darkModeSelector: '.dark', // Standardmäßiger Prefix
              },
              preset: Aura,
          },
      },
      directives: {
          include: '*',
      },
      composables: {
          include: '*',
      },
      components: {
          include: '*',
      },
  },
    css: [
        "primeicons/primeicons.css", // PrimeIcons CSS
    ],
  unocss: {
      uno: true,
      attributify: true,
      outputToCssLayers: true,
      preflight: false,
      typography: true,
      content: {
          filesystem: [],
          pipeline: {},
      },
  },

  compatibilityDate: '2024-12-17',
};