<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    theme?: string;
    /** The last report's ratings, which the plugin keeps in its storage. */
    ratings?: PanelSeoAuditRatings;
    /** Whether the page was published since the last report. */
    isStale?: boolean;
    /** An analysis in progress, which the plugin keeps in its own state. */
    isAnalyzing?: boolean;
    /** Analyzes the page and opens the report, which the plugin does itself. */
    click?: () => void;
  }>(),
  { label: "SEO Audit", theme: "positive-icon" },
);

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
