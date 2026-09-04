<script setup lang="ts">
import type { ContentSearchLink } from "@nuxt/ui";
import { joinURL } from "ufo";
import { PRODUCT_LIST, productDocsPath } from "#shared/products";
import { resolveThemeColor } from "#shared/theme";

const siteConfig = useSiteConfig();
const appConfig = useAppConfig();
const route = useRoute();
const themeColor = computed(() => resolveThemeColor(route.path));

watch(
  themeColor,
  (color) => {
    appConfig.ui.colors.primary = color;
  },
  { immediate: true },
);
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
const { navigation, files, isLoading } = useContentSearchData();

if (import.meta.server) {
  useHead({
    htmlAttrs: {
      lang: "en",
    },
    link: [
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      {
        rel: "canonical",
        href: joinURL(siteConfig.url, route.path),
      },
    ],
  });
}

useHead({
  link: [
    {
      rel: "icon",
      href: () => createFaviconDataUri(themeColor.value),
      sizes: "any",
      type: "image/svg+xml",
    },
  ],
});

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
        :loading="isLoading"
        :fuse="{ resultLimit: 100 }"
      />
    </ClientOnly>
  </UApp>
</template>
