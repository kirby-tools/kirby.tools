<script setup lang="ts">
const props = defineProps<{
  results: PanelSeoAuditResults;
  isDialog?: boolean;
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
    <slot name="header" />

    <k-text
      class="pb-[var(--spacing-2)] [&>div+div]:mt-[var(--spacing-4)]"
      :style="{
        '--link-color': 'var(--color-text)',
        '--link-color-hover':
          'light-dark(var(--color-blue-800), var(--color-blue-500))',
      }"
    >
      <div v-for="(group, index) in groups" :key="group.rating">
        <div
          class="mb-[var(--spacing-2)] inline-flex items-center gap-[var(--spacing-2)]"
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
          class="flex items-start gap-[var(--spacing-2)]"
        >
          <PanelSeoAuditRatingStatus
            :rating="group.rating"
            class="mt-[var(--spacing-1)] size-[var(--spacing-3)]"
          />
          <div v-html="replaceTrailingExclamation(item.text)" />
        </div>

        <hr
          v-if="index < groups.length - 1"
          class="my-[var(--spacing-4)]"
          :style="{
            background: isDialog
              ? undefined
              : 'light-dark(var(--color-gray-350), var(--color-border))',
          }"
        />
      </div>
    </k-text>

    <slot name="footer" />
  </div>
</template>
