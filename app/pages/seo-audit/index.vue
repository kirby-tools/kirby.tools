<script setup lang="ts">
import { withoutTrailingSlash } from "ufo";

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
  ogImage: "/social-card-seo-audit.png",
});
</script>

<template>
  <PagesProduct :page="page!">
    <template #sections-cta>
      <UPageSection
        :ui="{
          container: 'pt-0 sm:pt-0 lg:pt-0',
        }"
      >
        <UPageCTA
          variant="subtle"
          orientation="horizontal"
          :ui="{
            container: 'sm:py-16 lg:py-16',
            title: 'text-3xl sm:text-4xl text-center lg:text-7xl lg:text-left',
          }"
        >
          <template #title>
            <span class="text-(--ui-seoAudit)">Never Slip</span> on SEO Again
          </template>

          <IllustrationLuckyUnlucky12 class="mx-auto w-2/3" />
        </UPageCTA>
      </UPageSection>
    </template>

    <template #cta-image>
      <IllustrationLuckyUnlucky6 class="mx-auto w-1/3" />
    </template>
  </PagesProduct>
</template>
