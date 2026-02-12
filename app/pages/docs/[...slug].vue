<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";

definePageMeta({
  layout: "docs",
});

const route = useRoute();
const { currentProductId, currentProduct } = useProduct();

const { data: page } = await useAsyncData(
  withoutTrailingSlash(route.path),
  () => queryCollection("docs").path(withoutTrailingSlash(route.path)).first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const { data: surround } = await useAsyncData(
  `${withoutTrailingSlash(route.path)}-surround`,
  () => {
    return queryCollectionItemSurroundings(
      "docs",
      withoutTrailingSlash(route.path),
      {
        fields: ["description"],
      },
    ).andWhere((query) =>
      query.where("path", "LIKE", `%${currentProductId.value}/%`),
    );
  },
);

useSeoMeta({
  title: page.value.title,
  ogTitle: `${page.value.title} – ${currentProduct.value?.label}`,
  description: page.value.description,
  ogDescription: page.value.description,
});

const { getThemeColorFromPath } = useDynamicTheme();

defineOgImageComponent("Default", {
  headline: currentProduct.value?.label
    ? `Kirby ${currentProduct.value.label}`
    : "Kirby Tools",
  title: page.value.title,
  description: page.value.description,
  color: getThemeColorFromPath(route.path),
});
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" :description="page.description" />

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template #right>
      <UContentToc :links="page.body?.toc?.links" />
    </template>
  </UPage>
</template>
