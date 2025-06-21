<script setup lang="ts">
import { joinURL } from "ufo";

const siteConfig = useSiteConfig();
const route = useRoute();
const colorMode = useColorMode();
const color = computed(() =>
  colorMode.value === "dark" ? "#171717" : "white",
);
const { currentProduct } = useProduct();

const { data: navigation } = await useAsyncData("navigation", () =>
  queryCollectionNavigation("docs"),
);

const { data: files } = useLazyAsyncData(
  "search",
  () => queryCollectionSearchSections("docs"),
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
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
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
        shortcut="meta_k"
        :navigation="navigation"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
