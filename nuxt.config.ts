export default defineNuxtConfig({
  modules: [
    "@nuxt/image",
    "@nuxt/ui-pro",
    "@nuxt/content",
    "@vueuse/nuxt",
    "nuxt-og-image",
  ],

  compatibilityDate: "2025-06-01",

  future: {
    compatibilityVersion: 4,
  },

  css: ["~/assets/css/main.css"],

  icon: {
    customCollections: [
      {
        prefix: "tools",
        dir: "./app/assets/icons",
      },
    ],
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: "github-light",
            light: "github-light",
            dark: "github-dark",
          },
          langs: ["json", "bash", "yaml", "php"],
        },
      },
    },
  },

  image: {
    quality: 80,
    format: ["webp"],
  },

  site: {
    url: "https://kirby.tools",
  },

  routeRules: {
    "/docs": { redirect: "/" },
    "/docs/seo-audit": { redirect: "/docs/seo-audit/get-started" },
    "/docs/copilot": { redirect: "/docs/copilot/getting-started" },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        "/",
        "/content-translator",
        "/live-preview",
        "/copilot",
        "/seo-audit",
      ],
    },
  },
});
