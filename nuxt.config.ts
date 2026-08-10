import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { alternatePath } from "./shared/alternate";
import {
  PRODUCT_LIST,
  productChangelogPath,
} from "./shared/constants/products";

const SITE_URL = "https://kirby.tools";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "@vueuse/nuxt",
    "motion-v/nuxt",
    "nuxt-llms",
    "nuxt-og-image",
  ],

  compatibilityDate: "2026-01-01",

  css: ["~/assets/css/main.css"],

  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
        "copilot",
        "seo",
      ],
    },
  },

  runtimeConfig: {
    public: {
      paddle: {
        clientToken: "live_92e480cc12385b49df50126b4b9",
      },
    },
  },

  $development: {
    runtimeConfig: {
      public: {
        paddle: {
          clientToken: "test_16183d48cd7354531054a782859",
        },
      },
    },
  },

  icon: {
    clientBundle: {
      scan: {
        // TODO: Drop once the `@nuxt/icon` pin is lifted – 2.4.x scans
        // `yml`/`yaml` by default. `ts` stays regardless for `app.config.ts`.
        globInclude: ["**/*.{vue,jsx,tsx,ts,md,mdc,mdx,yml,yaml}"],
      },
    },
    // Skips `logos` and `simple-icons`, whose names are literals the client
    // bundle already inlines. `vscode-icons` stays – prose code block icons
    // resolve at runtime, so no scan can find them.
    serverBundle: {
      collections: ["ri", "lucide", "vscode-icons"],
    },
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

  mdc: {
    highlight: {
      noApiRoute: false,
    },
  },

  image: {
    quality: 80,
    format: ["webp"],
  },

  site: {
    url: SITE_URL,
    name: "Kirby Tools",
  },

  hooks: {
    // The crawler only reads `x-nitro-prerender` off HTML responses, so the
    // skill files – Markdown below a JSON index – have to be named up front.
    "prerender:routes": async function ({ routes }) {
      const skillsDir = fileURLToPath(
        new URL("server/assets/skills", import.meta.url),
      );
      const entries = await readdir(skillsDir, {
        recursive: true,
        withFileTypes: true,
      });

      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const file = relative(skillsDir, join(entry.parentPath, entry.name));
        routes.add(`/.well-known/agent-skills/${file}`);
      }
    },
  },

  llms: {
    domain: SITE_URL,
    title: "Kirby Tools",
    description:
      "Plugins for Kirby CMS: AI content generation, translation, SEO auditing, live preview, Panel navigation, and a headless API toolkit.",
    // Turns off `@nuxt/content`'s `/raw/**` route in favor of ours.
    contentRawMarkdown: false,
    full: {
      title: "Kirby Tools Full Documentation",
      description: `Every documentation page for all ${PRODUCT_LIST.length} plugins, concatenated as Markdown.`,
    },
    sections: [
      ...PRODUCT_LIST.map((product) => ({
        title: product.name,
        description: [
          `${product.description}.`,
          product.configKey
            ? `Composer package \`${product.composerPackage}\`, options under \`${product.configKey}\` in \`config.php\`.`
            : `Composer package \`${product.composerPackage}\`, configured through blueprints rather than \`config.php\`.`,
          product.license === "commercial"
            ? "Commercial plugin – free to run locally, licensed for production."
            : "Free and open source.",
          `Not for: ${product.notFor}`,
        ].join(" "),
        contentCollection: "docs",
        contentFilters: [
          {
            // No slash before the wildcard, so a flat documentation tree keeps
            // its index page at `/docs/<id>` alongside the nested pages.
            field: "path",
            operator: "LIKE" as const,
            value: `/docs/${product.id}%`,
          },
        ],
      })),
      {
        title: "Blog",
        description: "Release announcements and background articles.",
        contentCollection: "posts",
        contentFilters: [
          { field: "path", operator: "LIKE" as const, value: "/blog/%" },
        ],
      },
      {
        title: "Licensing",
        description:
          "The license agreement, the Zero One Edition it differs from, and which plugin generation runs on which Kirby version.",
        contentCollection: "pages",
        contentFilters: [
          { field: "path", operator: "LIKE" as const, value: "/license%" },
        ],
      },
    ],
    notes: [
      "These plugins install via Composer or as a ZIP into `site/plugins/` and are configured in `site/config/config.php` under their `johannschopplich.*` option key.",
      "Commercial plugins run unlicensed in local development. Production needs a license key, activated in the Panel's system view and stored in `site/config/.kirby-tools-licenses`. Each plugin is licensed separately.",
      "Append `.md` to any documentation or blog URL to retrieve its Markdown source, for example `https://kirby.tools/docs/copilot/getting-started.md`.",
      `Changelogs, newest release first: ${PRODUCT_LIST.filter(
        (product) => product.hasChangelog,
      )
        .map(
          (product) =>
            `${product.name} ${SITE_URL}${alternatePath(productChangelogPath(product.id))}`,
        )
        .join(", ")}.`,
      `Releases for the remaining plugins live on GitHub: ${PRODUCT_LIST.filter(
        (product) => !product.hasChangelog,
      )
        .map(
          (product) =>
            `${product.name} https://github.com/${product.githubRepo}/releases`,
        )
        .join(", ")}.`,
      `An agent skill per plugin – install with \`npx skills add ${SITE_URL}\`, or read the index at ${SITE_URL}/.well-known/agent-skills/index.json.`,
      `Every entry point above is documented at ${SITE_URL}/ai.md.`,
      `Retrieval keywords: ${PRODUCT_LIST.flatMap((product) => product.keywords).join(", ")}.`,
    ],
  },

  sitemap: {
    zeroRuntime: true,
  },

  ogImage: {
    zeroRuntime: true,
  },

  fonts: {
    families: [{ name: "Inter", weights: [400, 600, 700], global: true }],
  },

  routeRules: {
    // Global
    "/": {
      prerender: true,
      headers: {
        Link: [
          `<${SITE_URL}/sitemap.xml>; rel="sitemap"; type="application/xml"`,
          `<${SITE_URL}/sitemap.md>; rel="sitemap"; type="text/markdown"`,
          `<${SITE_URL}/llms.txt>; rel="describedby"; type="text/plain"`,
          `<${SITE_URL}/llms-full.txt>; rel="describedby"; type="text/plain"`,
        ].join(", "),
      },
    },
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
      redirect: "/docs/content-translator/php-classes",
    },
    "/docs/content-translator/hooks": {
      redirect: "/docs/content-translator/advanced/hooks",
    },
    "/docs/content-translator/kirbytags": {
      redirect: "/docs/content-translator/advanced/kirbytags",
    },
    "/docs/content-translator/configuration/translator-function": {
      redirect: "/docs/content-translator/providers/custom-translator",
    },
    "/docs/content-translator/configuration/deepl": {
      redirect: "/docs/content-translator/providers/deepl",
    },
    "/docs/content-translator/providers": {
      redirect: "/docs/content-translator/providers/deepl",
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
      routes: [
        "/robots.txt",
        "/sitemap.xml",
        "/sitemap.md",
        "/.well-known/agent-skills/index.json",
      ],
    },
  },
});
