<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection("buy").path(route.path).first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;

useSeoMeta({
  title,
  ogTitle: `${title} – Kirby Tools`,
  description,
  ogDescription: description,
});
</script>

<template>
  <PagesBuy :page="page!">
    <template #image-pricing>
      <IllustrationPartnershapes22 class="mx-auto w-2/3" />
    </template>
  </PagesBuy>
</template>
