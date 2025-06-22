<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";

const route = useRoute();

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
</script>

<template>
  <PagesBuy :page="page!" />
</template>
