<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    /** An analysis in progress, which the plugin keeps in its own state. */
    isAnalyzing?: boolean;
    /** The last report, which the plugin keeps in its storage. */
    results?: PanelSeoAuditResults;
    ratings?: PanelSeoAuditRatings;
    version?: PanelSeoAuditContentVersion;
    timestamp?: number;
    /** Whether the page was published since the last report. */
    isStale?: boolean;
  }>(),
  { label: "SEO Audit" },
);
</script>

<template>
  <k-section :label="label">
    <div class="[&>*+*]:mt-[var(--spacing-4)]">
      <k-button-group layout="collapsed">
        <k-button
          :icon="isAnalyzing ? 'loader' : 'seo-audit-analyze'"
          text="Analyze"
          variant="filled"
          theme="positive-icon"
          :disabled="isAnalyzing"
        />
      </k-button-group>

      <div v-if="results && timestamp">
        <k-box theme="passive">
          <PanelSeoAuditResult :results="results">
            <template v-if="ratings" #header>
              <PanelSeoAuditReportRatings
                :ratings="ratings"
                class="mb-[var(--spacing-3)]"
              />
            </template>
          </PanelSeoAuditResult>
        </k-box>

        <p
          class="mt-[var(--spacing-2)] text-[length:var(--text-sm)] text-[color:var(--color-text-dimmed)]"
        >
          <PanelSeoAuditReportMeta
            :version="version"
            :timestamp="timestamp"
            :is-stale="isStale"
          />
        </p>
      </div>
    </div>
  </k-section>
</template>
