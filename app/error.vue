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

    <UError :error="error" class="px-4" :ui="{ leading: 'mb-8' }">
      <template #leading>
        <Illustration name="partnershapes-16" class="w-48 sm:w-60" />
      </template>
    </UError>

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
