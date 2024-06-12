<script setup lang="ts">
const { data: page } = await useAsyncData("content-translator", () =>
  queryContent("/content-translator").findOne(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: page.value.title,
  ogTitle: `${page.value.title} – Kirby Tools`,
  description: page.value.description,
  ogDescription: page.value.description,
  ogImage: "https://kirby.tools/social-card-content-translator.png",
  twitterImage: "https://kirby.tools/social-card-content-translator.png",
});
</script>

<template>
  <LandingPage :page="page">
    <template #image-pricing>
      <IllustrationPartnershapes22 class="mx-auto w-3/4" />
    </template>
    <template #image-cta>
      <IllustrationPartnershapes7 class="mx-auto w-1/2" />
    </template>
  </LandingPage>
</template>
