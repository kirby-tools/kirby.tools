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
    <template #sections-cta>
      <UContainer>
        <UPageCTA
          variant="subtle"
          orientation="horizontal"
          :ui="{
            container: 'sm:py-16 lg:py-16',
            title: 'text-3xl sm:text-4xl text-center lg:text-7xl lg:text-left',
          }"
        >
          <template #title>
            <span class="text-(--ui-color-lima)">Never Slip</span> on SEO Again
          </template>

          <IllustrationLuckyUnlucky12 class="mx-auto w-2/3" />
        </UPageCTA>
      </UContainer>
    </template>

    <template #cta-image>
      <IllustrationLuckyUnlucky6 class="mx-auto w-1/3" />
    </template>
  </PagesProduct>
</template>
