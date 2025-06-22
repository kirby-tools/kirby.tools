<script setup lang="ts">
const route = useRoute();
const { currentProduct } = useProduct();

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

defineOgImageComponent("Default", {
  headline: currentProduct.value?.label
    ? `Kirby ${currentProduct.value.label}`
    : "Kirby Tools",
  title,
  description,
});
</script>

<template>
  <PagesBuy :page="page!">
    <template #image-pricing>
      <IllustrationPartnershapes22 class="mx-auto w-2/3" />
    </template>
  </PagesBuy>
</template>
