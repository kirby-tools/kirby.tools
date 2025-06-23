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
  ogImage: "/social-card-copilot.png",
});
</script>

<template>
  <PagesProduct :page="page!">
    <template #hero-title>
      <span class="font-display" v-html="page!.hero.title" />
    </template>

    <template #hero>
      <div
        class="absolute inset-0 z-[-1] flex items-start justify-center overflow-hidden"
      >
        <ElementCopilotBackground
          class="h-full w-full scale-[2] transform lg:scale-[1.1]"
        />
      </div>
    </template>
  </PagesProduct>
</template>
