export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],

  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-og-image",
  ],

  site: {
    url: "https://kirby.tools",
  },

  content: {
    highlight: {
      theme: {
        light: "github-light",
        default: "github-light",
        dark: "github-dark",
      },
      langs: ["json", "bash", "yaml", "php"],
    },
  },

  image: {
    quality: 80,
    format: ["webp"],
  },

  ui: {
    icons: ["heroicons", "ri"],
  },

  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md`
    "components:extend": (components) => {
      const globals = components.filter((c) =>
        ["UBadge"].includes(c.pascalName),
      );
      for (const c of globals) c.global = true;
    },
  },

  routeRules: {
    "/": { redirect: "/live-preview", prerender: false },
    "/docs": { redirect: "/docs/get-started", prerender: false },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/live-preview", "/api/search.json"],
    },
  },
});
