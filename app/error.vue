<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

useSeoMeta({
  title: "Page not found",
  description: "This page does not exist.",
});

const { navigation, files, isLoading } = useContentSearchData();
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
        :loading="isLoading"
        :fuse="{ resultLimit: 100 }"
      />
    </ClientOnly>

    <UToaster />
  </div>
</template>
