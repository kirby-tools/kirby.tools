<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";

const route = useRoute();
const { productId } = useProduct();

const { data: page } = await useAsyncData(
  withoutTrailingSlash(route.path),
  () => queryCollection("pages").path(withoutTrailingSlash(route.path)).first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: page.value.title,
  ogTitle: `${page.value.title} – Kirby Tools`,
  description: page.value.description,
  ogDescription: page.value.description,
});

useMarkdownAlternate();

defineOgImage("Default", {
  productId: productId.value,
  title: page.value.title,
  description: page.value.description,
});
</script>

<template>
  <UContainer class="max-w-4xl">
    <UPage v-if="page">
      <UPageHeader :title="page.title" :description="page.description" />

      <UPageBody>
        <ContentRenderer v-if="page.body" :value="page" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
