<script setup lang="ts">
const title = "Playground";
const description = "Try Kirby SEO Audit in the interactive Panel playground.";

useSeoMeta({
  title,
  ogTitle: `${title} – Kirby Tools`,
  description,
  ogDescription: description,
});

defineOgImageComponent("Default", {
  title,
  description,
});
</script>

<template>
  <ClientOnly>
    <iframe src="https://try.kirbyseo.com" width="100%" height="100%" />
  </ClientOnly>
</template>
s
