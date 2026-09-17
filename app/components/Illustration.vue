<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();

const loadSvgMarkup = ILLUSTRATION_LOADERS[props.name];
if (!loadSvgMarkup) {
  throw createError({
    statusCode: 500,
    statusMessage: `Unknown illustration "${props.name}"`,
    fatal: true,
  });
}

const svgMarkup = await loadSvgMarkup();
</script>

<template>
  <div aria-hidden="true" class="[&>svg]:size-full" v-html="svgMarkup" />
</template>
