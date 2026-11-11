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
      class="mr-1 size-[1.25em] align-text-bottom transition-colors group-hover:text-primary"
    />
    <span
      class="border-b border-transparent text-primary transition-colors group-hover:bg-primary-50 hover:border-primary focus-visible:outline-primary dark:group-hover:bg-primary-900"
      >{{ download.label }}</span
    >
  </a>
</template>
