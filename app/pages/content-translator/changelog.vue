<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";

const route = useRoute();
const { currentProduct } = useProduct();

const { data: page } = await useAsyncData(
  withoutTrailingSlash(route.path),
  () =>
    queryCollection("changelog").path(withoutTrailingSlash(route.path)).first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: page.value.title,
  ogTitle: `${page.value.title} – Kirby Tools`,
  description: page.value.description,
  ogDescription: page.value.description,
});

defineOgImageComponent("Default", {
  headline: currentProduct.value?.label
    ? `Kirby ${currentProduct.value.label}`
    : "Kirby Tools",
  title: page.value.title,
  description: page.value.description,
});
</script>

<template>
  <PagesChangelog v-if="page" :page="page" />
</template>
