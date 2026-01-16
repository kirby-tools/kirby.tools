export default defineNuxtConfig({
  modules: [
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxt/image",
    "@nuxt/ui",
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

    experimental: {
      sqliteConnector: "native",
    },
  },

  image: {
    quality: 80,
    format: ["webp"],
  },

  site: {
    url: "https://kirby.tools",
    name: "Kirby Tools",
  },

  sitemap: {
    zeroRuntime: true,
  },

  routeRules: {
    // Global
    "/": { prerender: true },
    "/license": { prerender: true },
    "/license/zero-one-edition": { prerender: true },
    // Playgrounds
    "/copilot/playground": {
      redirect: { to: "https://try.kirbycopilot.com", statusCode: 302 },
    },
    "/seo-audit/playground": {
      redirect: { to: "https://try.kirbyseo.com", statusCode: 302 },
    },
    // Core
    "/docs": { redirect: "/" },
    // Copilot
    "/docs/copilot": { redirect: "/docs/copilot/getting-started" },
    "/docs/copilot/usage/placeholders": {
      redirect: "/docs/copilot/prompt-dialog/placeholders",
    },
    "/docs/copilot/usage/files": {
      redirect: "/docs/copilot/prompt-dialog/files",
    },
    "/docs/copilot/usage/blocks-and-layouts": {
      redirect: "/docs/copilot/advanced/blocks-and-layouts",
    },
    "/docs/copilot/usage/reference": {
      redirect: "/docs/copilot/advanced/reference",
    },
    // Content Translator
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
    // SEO Audit
    "/docs/seo-audit": { redirect: "/docs/seo-audit/getting-started" },
    // Other plugins
    "/docs/live-preview/changelog": { redirect: "/live-preview/changelog" },
    "/docs/headless": { redirect: "/docs/headless/getting-started" },
    "/docs/headless/getting-started": { prerender: true },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/robots.txt", "/sitemap.xml"],
    },
  },
});
