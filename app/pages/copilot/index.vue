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
  ogImage: socialCardPath("copilot"),
});
</script>

<template>
  <PagesProduct :page="page!">
    <template #hero>
      <div
        class="absolute inset-0 z-[-1] flex items-start justify-center overflow-hidden"
      >
        <BackgroundCopilot
          class="h-full w-full scale-[2] transform lg:scale-[1.2]"
        />
      </div>
    </template>

    <template #scene>
      <ProductCopilotScene crop="hero" />
    </template>

    <template #feature-skills>
      <ProductCopilotSkills />
    </template>
    <template #feature-inline-suggestions>
      <ProductCopilotSuggestions />
    </template>
    <template #feature-toolbar-buttons>
      <ProductCopilotToolbarButton />
    </template>
    <template #feature-blocks-and-layouts>
      <ProductCopilotBlocks />
    </template>
  </PagesProduct>
</template>
