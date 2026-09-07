<script setup lang="ts">
defineProps<{
  faviconUrl?: string;
  siteTitle?: string;
  siteUrl?: string;
  /**
   * The title and description the plugin resolves from `titleContentKey`,
   * `defaultTitle` and the page, which a mock has no content to resolve from.
   */
  title?: string;
  description?: string;
}>();
</script>

<template>
  <div
    class="panel-serp-preview-snippet overflow-hidden rounded-(--input-rounded) bg-(--input-color-back) p-4"
  >
    <div class="mb-2 flex items-center gap-3">
      <span
        v-if="faviconUrl"
        class="inline-flex size-[26px] items-center justify-center rounded-full border border-solid border-[color:var(--serp-favicon-border)] bg-[color:var(--serp-favicon-background)]"
      >
        <img class="block size-[18px]" :src="faviconUrl" alt="" />
      </span>
      <div class="flex flex-col">
        <span class="text-sm text-[color:var(--serp-color-text)]">{{
          siteTitle
        }}</span>
        <span
          class="line-clamp-1 text-xs text-[color:var(--serp-color-text)]"
          >{{ siteUrl }}</span
        >
      </div>
    </div>

    <h3 class="line-clamp-1 text-xl text-[color:var(--serp-color-title)]">
      {{ title }}
    </h3>

    <p
      v-if="description"
      class="mt-1 line-clamp-2 text-sm text-[color:var(--serp-color-text)]"
    >
      {{ description }}
    </p>
  </div>
</template>

<style>
/* Google's own snippet colors, which the plugin sets on the section and no
   Kirby token carries. */
.panel-mock .panel-serp-preview-snippet {
  --serp-favicon-background: light-dark(#f1f3f4, #fff);
  --serp-favicon-border: light-dark(#ecedef, #5c5f5e);
  --serp-color-title: light-dark(#1a0dab, #99c3ff);
  --serp-color-text: light-dark(#4d5156, #bfbfbf);
}
</style>
