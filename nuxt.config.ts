export default defineNuxtConfig({
  modules: [
    "@nuxt/image",
    "@nuxt/ui-pro",
    "@nuxt/content",
    "@vueuse/nuxt",
    "nuxt-og-image",
  ],

  compatibilityDate: "2025-06-01",

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
          /// keep-sorted
          langs: ["bash", "diff", "json", "php", "yaml"],
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
    "/docs/content-translator": {
      redirect: "/docs/content-translator/getting-started",
    },
    "/docs/content-translator/configuration": {
      redirect: "/docs/content-translator/configuration/global",
    },
    "/docs/content-translator/php-api": {
      redirect: "/docs/content-translator/advanced/php-api",
    },
    "/docs/content-translator/hooks": {
      redirect: "/docs/content-translator/advanced/hooks",
    },
    "/docs/content-translator/kirbytags": {
      redirect: "/docs/content-translator/configuration/kirbytags",
    },
    "/docs/content-translator/examples": {
      redirect: "/docs/content-translator/examples/basic-usage",
    },
    "/docs/content-translator/migration": {
      redirect: "/docs/content-translator/getting-started/migration",
    },
    "/docs/live-preview/changelog": { redirect: "/live-preview/changelog" },
    "/docs/copilot": { redirect: "/docs/copilot/getting-started" },
    "/docs/seo-audit": { redirect: "/docs/seo-audit/getting-started" },
    "/docs/headless": { redirect: "/docs/headless/getting-started" },
    "/docs/headless/getting-started": { prerender: true },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
});
