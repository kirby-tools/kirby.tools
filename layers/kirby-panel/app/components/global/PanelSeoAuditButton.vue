<script setup lang="ts">
import type { PanelSeoAuditButtonProps } from "../../types/plugins";

const props = withDefaults(defineProps<PanelSeoAuditButtonProps>(), {
  label: "SEO Audit",
  theme: "positive-icon",
});

const RATING_ORDER = ["bad", "ok", "good"] as const;
const BADGE_THEMES: Record<PanelSeoAuditCategoryRating, string> = {
  good: "positive",
  ok: "notice",
  bad: "negative",
  none: "passive",
};

const badge = computed(() => {
  if (!props.ratings) return;
  const ratings = Object.values(props.ratings).map(({ rating }) => rating);
  const worstRating =
    RATING_ORDER.find((rating) => ratings.includes(rating)) ?? "none";

  return {
    theme: BADGE_THEMES[worstRating],
    text: props.isStale ? "!" : undefined,
  };
});
</script>

<template>
  <k-button
    :text="label"
    :icon="isAnalyzing ? 'loader' : 'seo-audit-analyze'"
    :theme="theme"
    :badge="badge"
    :disabled="isAnalyzing"
    variant="filled"
    size="sm"
    responsive
    @click="click?.()"
  />
</template>
