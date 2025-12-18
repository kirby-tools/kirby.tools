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

const downloadUrl = computed(() => {
  if (!githubRepo.value || !latestVersion.value?.title) return undefined;
  return `https://github.com/${githubRepo.value}/archive/refs/tags/${latestVersion.value.title}.zip`;
});
</script>

<template>
  <UButton
    v-if="downloadUrl"
    :href="downloadUrl"
    icon="i-ri-download-line"
    size="sm"
    class="rounded-sm px-1.25 py-0.75 align-text-bottom"
    :ui="{
      leadingIcon: 'size-[1.25em]',
    }"
  >
    Download {{ latestVersion?.title }}
  </UButton>
</template>
