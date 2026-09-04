<script setup lang="ts">
import type { ExhibitionProductId } from "#shared/exhibition";
import type { SocialCardFormat } from "#shared/social-card";
import { isExhibitionProductId } from "#shared/exhibition";

definePageMeta({
  layout: false,
  standalone: true,
  validate(route) {
    const { product } = route.params;
    return (
      import.meta.dev &&
      typeof product === "string" &&
      isExhibitionProductId(product)
    );
  },
});

const route = useRoute();
const productId = computed(() => route.params.product as ExhibitionProductId);
const format = computed<SocialCardFormat>(() =>
  route.query.format === "4x3" ? "4x3" : "og",
);
</script>

<template>
  <SocialCard :product-id="productId" :format="format" />
</template>
