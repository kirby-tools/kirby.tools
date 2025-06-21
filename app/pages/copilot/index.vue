<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection("product").path(route.path).first(),
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
  <PagesProduct :page="page!">
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
