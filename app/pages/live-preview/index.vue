<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";

definePageMeta({
  middleware: ["pricing-redirect"],
});

const route = useRoute();

const { data: page } = await useAsyncData(
  withoutTrailingSlash(route.path),
  () =>
    queryCollection("product").path(withoutTrailingSlash(route.path)).first(),
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
  titleTemplate: "",
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: "/social-card-live-preview.png",
});
</script>

<template>
  <PagesProduct :page="page!">
    <template #cta-image>
      <IllustrationPartnershapes20
        class="w-1/3 max-lg:mt-4 lg:mx-auto lg:w-1/2"
      />
    </template>
  </PagesProduct>
</template>
