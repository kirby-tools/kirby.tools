<script setup lang="ts">
const props = defineProps<{
  results: PanelSeoAuditResults;
  /** Left out with `version` and `timestamp` by a changelog of a release whose report printed none of them. */
  ratings?: PanelSeoAuditRatings;
  version?: PanelSeoAuditContentVersion;
  timestamp?: number;
  autofocus?: boolean;
}>();

const heading = computed(() => {
  const { seo, readability } = props.results;
  if (seo.length > 0 && readability.length > 0)
    return "SEO & Readability Scores";
  return seo.length > 0 ? "SEO Scores" : "Readability Scores";
});
</script>

<template>
  <PanelDialog
    size="large"
    :cancel-button="false"
    :submit-button="false"
    :autofocus="autofocus"
  >
    <PanelSeoAuditResult :results="results" is-dialog>
      <template #header>
        <div class="mb-[var(--spacing-6)] flex items-start justify-between">
          <k-text>
            <h2>{{ heading }}</h2>
            <PanelSeoAuditReportRatings
              v-if="ratings"
              :ratings="ratings"
              class="mt-[var(--spacing-3)]"
            />
          </k-text>
        </div>
      </template>

      <template v-if="timestamp" #footer>
        <p class="mt-[var(--spacing-4)] text-[color:var(--color-text-dimmed)]">
          <PanelSeoAuditReportMeta :version="version" :timestamp="timestamp" />
        </p>
      </template>
    </PanelSeoAuditResult>
  </PanelDialog>
</template>
