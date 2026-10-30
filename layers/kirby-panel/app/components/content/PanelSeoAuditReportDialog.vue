<script setup lang="ts">
import type { ContentVersion, Report } from "#kirby-plugin/seo-audit";
import { createReportLabels, ReportDialogBody } from "#kirby-plugin/seo-audit";
import { translate } from "#panel-mock/translate";

const props = defineProps<{
  results: Report["results"];
  /** Left out with `version` and `timestamp` by a changelog of a release whose report printed none of them. */
  ratings?: Report["ratings"];
  version?: ContentVersion;
  timestamp?: number;
  autofocus?: boolean;
}>();

const labels = createReportLabels(translate, "en");
const timestamp = useSeoAuditTimestamp(() => props.timestamp);
</script>

<template>
  <PanelDialog
    size="large"
    :cancel-button="false"
    :submit-button="false"
    :autofocus="autofocus"
    class="k-seo-audit-report-dialog"
  >
    <ReportDialogBody
      :results="results"
      :ratings="ratings"
      :version="version"
      :timestamp="timestamp"
      :labels="labels"
    />
  </PanelDialog>
</template>
