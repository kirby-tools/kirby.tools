<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";
import { isProductId, PRODUCTS } from "#shared/products";

definePageMeta({
  // Enforces `hasChangelog`: a product without one 404s instead of rendering empty.
  validate(route) {
    const { product } = route.params;
    return (
      typeof product === "string" &&
      isProductId(product) &&
      !!PRODUCTS[product].hasChangelog
    );
  },
});

const route = useRoute();
const { productId } = useProduct();

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

useMarkdownAlternate();

defineOgImage("Default", {
  productId: productId.value,
  title: page.value.title,
  description: page.value.description,
});
</script>

<template>
  <PagesChangelog v-if="page" :page="page" />
</template>
