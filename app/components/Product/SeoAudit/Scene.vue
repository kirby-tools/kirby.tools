<script setup lang="ts">
import type { ContentVersion, Rating, Report } from "#kirby-plugin/seo-audit";

const ANALYSIS_DURATION = 800;

const isOnSocialCard = inject(socialCardKey, false);
const reducedMotion = usePreferredReducedMotion();
const page = useExhibitionPage();
const {
  cursor,
  isDialogOpen,
  openCount,
  hasReaderOpenedDialog,
  openDialog,
  closeDialog,
} = useScene("seo-audit", page, [{ click: "SEO Audit" }]);
const { isPending: isAnalyzing, start: startAnalysis } = useTimeoutFn(
  openDialog,
  ANALYSIS_DURATION,
  { immediate: false },
);

// A SocialCard shows the Scene at its best: no bad results, and an ok SEO rating.
const ratings: Report["ratings"] = isOnSocialCard
  ? { ...SEO_RATINGS, seo: { score: 70, rating: "ok" } }
  : SEO_RATINGS;

const rating: Rating = isOnSocialCard
  ? { ...SEO_PAGE_RATING, seo: "ok", counts: { good: 2, ok: 1, bad: 0 } }
  : SEO_PAGE_RATING;

const results: Report["results"] = isOnSocialCard
  ? {
      ...SEO_RESULTS,
      seo: SEO_RESULTS.seo.filter((result) => result.rating !== "bad"),
    }
  : SEO_RESULTS;

// The report open on load reads the published page; a run reads the form, so
// it reports unsaved changes once there are some.
const report = shallowRef<{
  version: ContentVersion;
  timestamp: number;
}>({ version: "latest", timestamp: SEO_REPORT_TIMESTAMP });

const viewButton = computed<PanelViewButton>(() => ({
  plugin: "seo-audit",
  rating,
  isAnalyzing: isAnalyzing.value,
  click: analyze,
}));

function analyze() {
  report.value = {
    version: page.hasDiff.value ? "changes" : "latest",
    timestamp: Date.now(),
  };
  if (reducedMotion.value === "reduce") openDialog();
  else startAnalysis();
}
</script>

<template>
  <ExhibitionScene
    :key="openCount"
    :page="page"
    :view-button="viewButton"
    :cursor="cursor"
    @cancel="closeDialog"
  >
    <template v-if="isDialogOpen" #dialog>
      <PanelSeoAuditReportDialog
        :autofocus="hasReaderOpenedDialog"
        :ratings="ratings"
        :results="results"
        :version="report.version"
        :timestamp="report.timestamp"
      />
    </template>
  </ExhibitionScene>
</template>
