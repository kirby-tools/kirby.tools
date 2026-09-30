<script setup lang="ts">
defineProps<{
  results: PanelSeoAuditResults;
  ratings: PanelSeoAuditRatings;
  version?: PanelSeoAuditContentVersion;
  timestamp: number;
  isStale?: boolean;
}>();
</script>

<template>
  <div class="panel-seo-audit-report">
    <k-box theme="passive">
      <PanelSeoAuditResult :results="results" :ratings="ratings" />
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
</template>
