<script setup lang="ts">
import type { ProductId } from "#shared/products";
import type { SocialCardFormat } from "#shared/social-card";
import { isProductId } from "#shared/products";

definePageMeta({
  layout: false,
  standalone: true,
  validate(route) {
    const { product } = route.params;
    return (
      import.meta.dev && typeof product === "string" && isProductId(product)
    );
  },
});

const route = useRoute();
const productId = computed(() => route.params.product as ProductId);
const format = computed<SocialCardFormat>(() =>
  route.query.format === "4x3" ? "4x3" : "og",
);

useSeoMeta({ title: "Social Card" });
</script>

<template>
  <SocialCard :product-id="productId" :format="format" />
</template>
