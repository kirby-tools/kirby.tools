<script setup lang="ts">
import { productDownload } from "#shared/products";

const { productId } = useProduct();

const { data: latestVersion } = await useLatestProductVersion(productId);

const download = computed(() =>
  productId.value
    ? productDownload(productId.value, latestVersion.value?.title)
    : undefined,
);
</script>

<template>
  <a v-if="download" :href="download.url" class="font-medium">
    <Icon
      name="i-ri-download-line"
      class="group-hover:text-primary mr-1 size-[1.25em] align-text-bottom transition-colors"
    />
    <span
      class="text-primary group-hover:bg-primary-50 dark:group-hover:bg-primary-900 hover:border-primary focus-visible:outline-primary border-b border-transparent transition-colors"
      >{{ download.label }}</span
    >
  </a>
</template>
