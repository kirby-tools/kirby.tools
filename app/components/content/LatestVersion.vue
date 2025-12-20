<script setup lang="ts">
import { GITHUB_REPOS } from "#shared/constants";

const props = defineProps<{
  product?: string;
}>();

const { currentProductId } = useProduct();

const productId = computed(() => props.product || currentProductId.value);
const githubRepo = computed(() =>
  productId.value ? GITHUB_REPOS[productId.value] : undefined,
);

const { data: latestVersion } = await useAsyncData(
  `download-latest-${productId.value}`,
  () =>
    queryCollection("versions")
      .where("path", "LIKE", `%${productId.value}/%`)
      .order("date", "DESC")
      .first(),
);

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
