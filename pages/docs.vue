<script setup lang="ts">
import type { NavItem } from "@nuxt/content";

const navigation = inject<Ref<NavItem[]>>("navigation", ref([]));
// TODO: Remove when fixed upstream
const _mapContentNavigation = mapContentNavigation;

const links = computed(
  () => navigation.value.find((item) => item._path === "/docs")?.children ?? [],
);
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside>
          <template #top>
            <UContentSearchButton size="sm" />
          </template>

          <UNavigationTree :links="_mapContentNavigation(links)" />
        </UAside>
      </template>

      <NuxtPage />
    </UPage>
  </UContainer>
</template>
