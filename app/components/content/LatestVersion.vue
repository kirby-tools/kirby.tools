<script setup lang="ts">
import type { ProductId } from "#shared/products";
import { isProductId, PRODUCTS } from "#shared/products";

const props = defineProps<{
  product?: ProductId;
}>();

const { productId: routeProductId } = useProduct();

const productId = computed(() =>
  isProductId(props.product) ? props.product : routeProductId.value,
);
const githubRepo = computed(() =>
  productId.value ? PRODUCTS[productId.value].githubRepo : undefined,
);

const { data: latestVersion } = await useLatestProductVersion(productId);

// Products without a changelog on this site link GitHub's latest release instead.
const downloadUrl = computed(() => {
  if (!githubRepo.value) return "";
  return latestVersion.value?.title
    ? `https://github.com/${githubRepo.value}/archive/refs/tags/${latestVersion.value.title}.zip`
    : `https://github.com/${githubRepo.value}/releases/latest`;
});
</script>

<template>
  <a v-if="downloadUrl" :href="downloadUrl" class="font-medium">
    <Icon
      name="i-ri-download-line"
      class="group-hover:text-primary mr-1 size-[1.25em] align-text-bottom transition-colors"
    />
    <span
      class="text-primary group-hover:bg-primary-50 dark:group-hover:bg-primary-900 hover:border-primary focus-visible:outline-primary border-b border-transparent transition-colors"
      >{{
        latestVersion?.title
          ? `latest version ${latestVersion.title}`
          : "latest release"
      }}</span
    >
  </a>
</template>
