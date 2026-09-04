<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";
import { socialCardPath } from "#shared/social-card";

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
  ogImage: socialCardPath("seo-audit"),
});
</script>

<template>
  <PagesProduct :page="page!">
    <template #feature-scores>
      <ProductSeoAuditReport />
    </template>
    <template #feature-entry-points>
      <ProductSeoAuditEntryPoints />
    </template>
    <template #feature-keyphrase>
      <ProductSeoAuditKeyphrase />
    </template>
    <template #feature-languages>
      <ProductSeoAuditLanguages />
    </template>
    <template #feature-local-analysis>
      <ProductSeoAuditLocalAnalysis />
    </template>

    <template #cta-image>
      <IllustrationLuckyUnlucky6
        class="w-1/4 max-lg:mt-4 lg:mx-auto lg:w-1/3"
      />
    </template>
  </PagesProduct>
</template>
