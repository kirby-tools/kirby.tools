<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";

const route = useRoute();
const { currentProduct } = useProduct();

const { data: page } = await useAsyncData(
  withoutTrailingSlash(route.path),
  () => queryCollection("buy").path(withoutTrailingSlash(route.path)).first(),
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

const { getThemeColorFromPath } = useDynamicTheme();

defineOgImageComponent("Default", {
  headline: currentProduct.value?.label
    ? `Kirby ${currentProduct.value.label}`
    : "Kirby Tools",
  title,
  description,
  color: getThemeColorFromPath(route.path),
});
</script>

<template>
  <PagesBuy :page="page!">
    <template #image-pricing>
      <IllustrationPartnershapes22 class="mx-auto w-2/3" />
    </template>
  </PagesBuy>
</template>
