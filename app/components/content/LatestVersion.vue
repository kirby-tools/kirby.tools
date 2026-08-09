<script setup lang="ts">
import type { ProductId } from "#shared/constants";
import { isProductId, PRODUCTS } from "#shared/constants";

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

const downloadUrl = computed(() =>
  githubRepo.value && latestVersion.value?.title
    ? `https://github.com/${githubRepo.value}/archive/refs/tags/${latestVersion.value.title}.zip`
    : "",
);
</script>

<template>
  <a v-if="downloadUrl" :href="downloadUrl" class="font-medium">
    <Icon
      name="i-ri-download-line"
      class="group-hover:text-primary mr-1 size-[1.25em] align-text-bottom transition-colors"
    />
    <span
      class="text-primary group-hover:bg-primary-50 dark:group-hover:bg-primary-900 hover:border-primary focus-visible:outline-primary border-b border-transparent transition-colors"
      >latest version {{ latestVersion?.title }}</span
    >
  </a>
</template>
