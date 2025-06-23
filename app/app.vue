<script setup lang="ts">
import { PRODUCT_ITEMS } from "#shared/constants";
import { joinURL } from "ufo";

const siteConfig = useSiteConfig();
const route = useRoute();
const colorMode = useColorMode();
const color = computed(() =>
  colorMode.value === "dark" ? "#0c0a09" : "white",
);
const { currentProduct } = useProduct();

const { data: navigation } = await useAsyncData("navigation", async () => {
  const result = await Promise.all([
    queryCollectionNavigation("pages"),
    queryCollectionNavigation("docs"),
  ]);
  return result.flat();
});

const { data: files } = useLazyAsyncData(
  "search",
  async () => {
    const result = await Promise.all([
      queryCollectionSearchSections("pages"),
      queryCollectionSearchSections("docs"),
    ]);
    return result.flat();
  },
  {
    server: false,
  },
);

if (import.meta.server) {
  useHead({
    htmlAttrs: {
      lang: "en",
    },
    link: [
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      {
        rel: "icon",
        href: "/favicon.svg",
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
  titleTemplate: `%s – ${currentProduct.value?.label ? `Kirby ${currentProduct.value.label}` : "Kirby Tools"}`,
  ogSiteName: "Kirby Tools",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        :link="PRODUCT_ITEMS"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
