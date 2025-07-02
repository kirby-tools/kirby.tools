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
    "/": { prerender: true },
    "/copilot/playground": {
      redirect: { to: "https://try.kirbycopilot.com", statusCode: 302 },
    },
    "/seo-audit/playground": {
      redirect: { to: "https://try.kirbyseo.com", statusCode: 302 },
    },
    "/docs": { redirect: "/" },
    "/docs/content-translator/changelog": {
      redirect: "/content-translator/changelog",
    },
    "/docs/live-preview/changelog": { redirect: "/live-preview/changelog" },
    "/docs/copilot": { redirect: "/docs/copilot/getting-started" },
    "/docs/seo-audit": { redirect: "/docs/seo-audit/get-started" },
    "/docs/headless": { prerender: true },
    // TODO: Find a better way to handle old `#pricing` links
    "/live-preview": { prerender: false },
    "/content-translator": { prerender: false },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
});
