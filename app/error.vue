<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

useSeoMeta({
  title: "Page not found",
  description: "Sorry, this page could not be found.",
});

const { data: navigation } = await useAsyncData("navigation", async () => {
  const result = await Promise.all([
    queryCollectionNavigation("pages").then(
      (data) => data.find((item) => item.path === "/docs")?.children ?? [],
    ),
    queryCollectionNavigation("docs"),
  ]);
  return result.flat();
});

const { data: files } = useLazyAsyncData(
  "search",
  async () => {
    const result = await Promise.all([
      queryCollectionSearchSections("pages"),
      queryCollectionSearchSections("docs"),
    ]);
    return result.flat();
  },
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
        :navigation="navigation"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>

    <UToaster />
  </div>
</template>
