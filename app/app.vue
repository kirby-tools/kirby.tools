<script setup lang="ts">
import type { ContentSearchLink } from "@nuxt/ui";
import { joinURL } from "ufo";
import { PRODUCT_LIST, productDocsPath } from "#shared/constants";

const siteConfig = useSiteConfig();
const route = useRoute();
const colorMode = useColorMode();
const color = computed(() =>
  colorMode.value === "dark" ? "#0c0a09" : "white",
);
const { product } = useProduct();

const searchLinks: ContentSearchLink[] = PRODUCT_LIST.map((listed) => ({
  label: listed.name,
  icon: listed.icon,
  to: productDocsPath(listed.id),
}));
const { getThemeColorFromPath, createFaviconDataUri } = useDynamicTheme();

const { data: navigation } = await useSiteNavigation();
const { data: files } = useSiteSearch();

if (import.meta.server) {
  const themeColor = getThemeColorFromPath(route.path);

  useHead({
    htmlAttrs: {
      lang: "en",
    },
    link: [
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      {
        rel: "icon",
        href: createFaviconDataUri(themeColor),
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        rel: "canonical",
        href: joinURL(siteConfig.url, route.path),
      },
    ],
  });
}

useSeoMeta({
  themeColor: color,
  titleTemplate: () => `%s – ${product.value?.name ?? "Kirby Tools"}`,
  ogSiteName: "Kirby Tools",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <AppHeader />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        :links="searchLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
