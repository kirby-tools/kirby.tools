<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";
import { isProductId, PRODUCTS } from "#shared/products";

definePageMeta({
  validate(route) {
    const { product } = route.params;
    return (
      typeof product === "string" &&
      isProductId(product) &&
      PRODUCTS[product].license === "commercial"
    );
  },
});

const route = useRoute();
const { productId, product } = useProduct();

const { data: page } = await useAsyncData(
  withoutTrailingSlash(route.path),
  () => queryCollection("buy").path(withoutTrailingSlash(route.path)).first(),
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
  title,
  ogTitle: `${title} – ${product.value!.name}`,
  description,
  ogDescription: description,
});

defineOgImage("Default", {
  productId: productId.value,
  title,
  description,
});
</script>

<template>
  <PagesBuy :page="page!" />
</template>
