<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";

definePageMeta({
  layout: "docs",
});

const route = useRoute();
const { productId, product } = useProduct();

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
    ).andWhere((query) => query.where("path", "LIKE", `%${productId.value}/%`));
  },
);

useSeoMeta({
  title: page.value.title,
  ogTitle: `${page.value.title} – ${product.value?.name}`,
  description: page.value.description,
  ogDescription: page.value.description,
});

useMarkdownAlternate();

const { getThemeColorFromPath } = useDynamicTheme();

defineOgImage("Default", {
  headline: product.value?.name ?? "Kirby Tools",
  title: page.value.title,
  description: page.value.description,
  color: getThemeColorFromPath(route.path),
});
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" :description="page.description">
      <template #links>
        <PageMarkdownActions />
      </template>
    </UPageHeader>

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
