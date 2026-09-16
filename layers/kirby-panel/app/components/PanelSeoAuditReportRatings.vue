<script setup lang="ts">
defineProps<{
  ratings: PanelSeoAuditRatings;
}>();

const CATEGORIES: PanelSeoAuditCategory[] = ["seo", "readability"];

const CATEGORY_LABEL: Record<PanelSeoAuditCategory, string> = {
  seo: "SEO",
  readability: "Readability",
};

const RATING_LABEL: Record<PanelSeoAuditCategoryRating, string> = {
  good: "Good",
  ok: "OK",
  bad: "Needs improvement",
  none: "Not available",
};
</script>

<template>
  <div class="flex flex-wrap gap-x-(--spacing-4) gap-y-(--spacing-1)">
    <template v-for="category in CATEGORIES" :key="category">
      <span
        v-if="ratings[category]"
        class="inline-flex items-center gap-(--spacing-2)"
      >
        <PanelSeoAuditRatingStatus
          :rating="ratings[category].rating"
          class="size-(--spacing-3)"
        />
        <span class="inline-flex gap-(--spacing-2)">
          <strong>{{ CATEGORY_LABEL[category] }}</strong>
          <span>{{ RATING_LABEL[ratings[category].rating] }}</span>
        </span>
      </span>
    </template>
  </div>
</template>
