<script setup lang="ts">
import type { ContentVersion, Report } from "#kirby-plugin/seo-audit";
import { createReportLabels, FieldBody } from "#kirby-plugin/seo-audit";
import { translate } from "#panel-mock/translate";

const props = defineProps<{
  isAnalyzing?: boolean;
  results?: Report["results"];
  ratings?: Report["ratings"];
  version?: ContentVersion;
  timestamp?: number;
  /** Whether the page was published since the last report. */
  isStale?: boolean;
}>();

const labels = createReportLabels(translate, "en");
const timestamp = useSeoAuditTimestamp(() => props.timestamp);
</script>

<template>
  <!-- The PHP field's defaults for a field keyed `seoAudit`. -->
  <FieldBody
    :label="translate('johannschopplich.seo-audit.label')"
    name="seoaudit"
    :labels="labels"
    :is-analyzing="isAnalyzing"
    :results="results"
    :ratings="ratings"
    :version="version"
    :timestamp="timestamp"
    :is-stale="isStale"
  />
</template>
