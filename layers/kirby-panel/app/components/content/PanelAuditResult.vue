<script setup lang="ts">
const props = defineProps<{
  report: PanelAuditResultEntry[];
  title?: string;
}>();

const RATING_LABEL: Record<PanelAuditRating, string> = {
  good: "Good",
  ok: "OK",
  bad: "Needs improvement",
  feedback: "Feedback",
};

const RATING_BADGE_COLOR_MAP: Partial<Record<PanelAuditRating, string>> = {
  good: "green",
  ok: "orange",
  bad: "red",
};

const RATING_COLOR_MAP: Record<PanelAuditRating, string> = {
  good: "green",
  ok: "orange",
  bad: "red",
  feedback: "gray",
};

const replaceTrailingExclamation = (text: string) => text.replace(/!$/, ".");

const groups = computed(() =>
  Object.keys(RATING_LABEL)
    .map((rating) => ({
      rating: rating as PanelAuditRating,
      items: props.report.filter((item) => item.rating === rating),
    }))
    .filter((group) => group.items.length > 0),
);
</script>

<template>
  <div class="panel-audit-result">
    <k-text v-if="title" class="mb-(--spacing-4)">
      <h2>{{ title }}</h2>
    </k-text>

    <k-text
      class="pb-(--spacing-2) [&>div+div]:mt-[var(--spacing-4)]"
      :style="{
        '--link-color': 'var(--color-text)',
        '--link-color-hover':
          'light-dark(var(--color-blue-800), var(--color-blue-500))',
      }"
    >
      <div v-for="(group, index) in groups" :key="group.rating">
        <div class="mb-(--spacing-2) inline-flex items-center gap-1.5">
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
          <div
            class="mt-(--spacing-1) size-3 shrink-0 rounded-full"
            :style="{
              backgroundColor: `var(--color-${RATING_COLOR_MAP[group.rating]}-600)`,
            }"
          />
          <div v-html="replaceTrailingExclamation(item.text)" />
        </div>

        <hr v-if="index < groups.length - 1" class="my-(--spacing-4)" />
      </div>
    </k-text>
  </div>
</template>

<style>
/* The `<hr>` keeps Kirby's default in a dialog. Inside a section the result
   sits on a passive box, whose grey swallows it, so only there is it darkened. */
.k-section .panel-audit-result hr {
  background: light-dark(var(--color-gray-350), var(--color-border));
}
</style>
