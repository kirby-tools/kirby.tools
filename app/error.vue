<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

useSeoMeta({
  title: "Page not found",
  description: "Sorry, this page could not be found.",
});

const { data: navigation } = await useAsyncData(
  "navigation",
  () => queryCollectionNavigation("docs"),
  {
    transform: (data) =>
      data.find((item) => item.path === "/docs")?.children || [],
  },
);
const { data: files } = useLazyAsyncData(
  "search",
  () => queryCollectionSearchSections("docs"),
  {
    server: false,
  },
);
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage>
          <UError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        shortcut="meta_k"
        :navigation="navigation"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>

    <UToaster />
  </div>
</template>
