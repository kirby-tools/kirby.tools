<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection("pages").path(route.path).first(),
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

defineOgImageComponent("Default", {
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
