<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";
import { PRODUCTS } from "#shared/products";

const route = useRoute();

const { data: page } = await useAsyncData(
  withoutTrailingSlash(route.path),
  () =>
    queryCollection("product").path(withoutTrailingSlash(route.path)).first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;

useSeoMeta({
  titleTemplate: "",
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

defineOgImage("Default", {
  productId: "headless",
  title: PRODUCTS.headless.tagline,
  description,
});
</script>

<template>
  <PagesProduct :page="page!" />
</template>
