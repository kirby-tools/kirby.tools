<script setup lang="ts">
const title = "Playground";
const description = "Try Kirby Copilot in the interactive Panel playground.";

useSeoMeta({
  title,
  ogTitle: `${title} – Kirby Copilot`,
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
    <iframe src="https://try.kirbycopilot.com" width="100%" height="100%" />
  </ClientOnly>
</template>
