<script setup lang="ts">
const props = defineProps<{
  results: PanelSeoAuditResults;
  ratings?: PanelSeoAuditRatings;
  title?: string;
  version?: PanelSeoAuditContentVersion;
  timestamp?: string;
}>();

const RATING_LABEL: Record<PanelSeoAuditRating, string> = {
  good: "Good",
  ok: "OK",
  bad: "Needs improvement",
  feedback: "Feedback",
};

const RATING_BADGE_COLOR_MAP: Partial<Record<PanelSeoAuditRating, string>> = {
  good: "green",
  ok: "orange",
  bad: "red",
};

const replaceTrailingExclamation = (text: string) => text.replace(/!$/, ".");

const groups = computed(() => {
  const items = Object.values(props.results).flat();

  return Object.keys(RATING_LABEL)
    .map((rating) => ({
      rating: rating as PanelSeoAuditRating,
      items: items.filter((item) => item.rating === rating),
    }))
    .filter((group) => group.items.length > 0);
});
</script>

<template>
  <div class="panel-seo-audit-result">
    <div v-if="title" class="mb-(--spacing-6) flex items-start justify-between">
      <k-text>
        <h2>{{ title }}</h2>
        <PanelSeoAuditReportRatings
          v-if="ratings"
          :ratings="ratings"
          class="mt-(--spacing-3)"
        />
      </k-text>
    </div>
    <PanelSeoAuditReportRatings
      v-else-if="ratings"
      :ratings="ratings"
      class="mb-(--spacing-3)"
    />

    <k-text
      class="pb-(--spacing-2) [&>div+div]:mt-[var(--spacing-4)]"
      :style="{
        '--link-color': 'var(--color-text)',
        '--link-color-hover':
          'light-dark(var(--color-blue-800), var(--color-blue-500))',
      }"
    >
      <div v-for="(group, index) in groups" :key="group.rating">
        <div
          class="mb-(--spacing-2) inline-flex items-center gap-(--spacing-2)"
        >
          <h3
            class="text-[length:var(--text-font-size)]/[var(--text-line-height)] text-[color:var(--color-text)]"
          >
            {{ RATING_LABEL[group.rating] }}
          </h3>
          <!-- Kirby's badge hangs in a button's top-right corner. Here it
               follows the heading in the text flow. -->
          <span
            class="k-button-badge static transform-none [font-weight:var(--font-semi)] shadow-none"
            :data-theme="RATING_BADGE_COLOR_MAP[group.rating]"
            >{{ group.items.length }}</span
          >
        </div>

        <div
          v-for="(item, itemIndex) in group.items"
          :key="itemIndex"
          class="flex items-start gap-(--spacing-2)"
        >
          <PanelSeoAuditRatingStatus
            :rating="group.rating"
            class="mt-(--spacing-1) size-(--spacing-3)"
          />
          <div v-html="replaceTrailingExclamation(item.text)" />
        </div>

        <hr v-if="index < groups.length - 1" class="my-(--spacing-4)" />
      </div>
    </k-text>

    <p
      v-if="timestamp"
      class="mt-(--spacing-4) text-[color:var(--color-text-dimmed)]"
    >
      <PanelSeoAuditReportMeta :version="version" :timestamp="timestamp" />
    </p>
  </div>
</template>

<style>
/* The `<hr>` keeps Kirby's default in a dialog. Inside a section the result
   sits on a passive box of the same gray, so only there is it darkened. */
.k-section .panel-seo-audit-result hr {
  background: light-dark(var(--color-gray-350), var(--color-border));
}
</style>
