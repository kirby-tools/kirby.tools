<script setup lang="ts">
defineProps<{
  rating: PanelSeoAuditRating | PanelSeoAuditCategoryRating;
}>();

const RATING_COLOR_MAP: Record<
  PanelSeoAuditRating | PanelSeoAuditCategoryRating,
  string
> = {
  good: "green",
  ok: "orange",
  bad: "red",
  feedback: "gray",
  none: "gray",
};
</script>

<template>
  <div
    class="shrink-0 rounded-full"
    :style="{ backgroundColor: `var(--color-${RATING_COLOR_MAP[rating]}-600)` }"
  />
</template>
