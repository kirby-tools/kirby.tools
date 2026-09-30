<script setup lang="ts">
const ANALYSIS_DURATION = 800;

const isOnSocialCard = inject(socialCardKey, false);
const reducedMotion = usePreferredReducedMotion();
const page = useExhibitionPage();
const {
  isOpen: isDialogOpen,
  openCount,
  hasReaderOpened: hasReaderOpenedDialog,
  open: openDialog,
  close: closeDialog,
} = useSceneDialog();
const { isPending: isAnalyzing, start: startAnalysis } = useTimeoutFn(
  openDialog,
  ANALYSIS_DURATION,
  { immediate: false },
);

// A SocialCard shows the Scene at its best: no bad results, and an ok SEO rating.
const ratings: PanelSeoAuditRatings = isOnSocialCard
  ? { ...SEO_RATINGS, seo: { rating: "ok" } }
  : SEO_RATINGS;

const results: PanelSeoAuditResults = isOnSocialCard
  ? {
      ...SEO_RESULTS,
      seo: SEO_RESULTS.seo.filter((result) => result.rating !== "bad"),
    }
  : SEO_RESULTS;

const viewButton = computed<PanelViewButton>(() => ({
  component: "PanelSeoAuditButton",
  props: {
    ...PLUGIN_VIEW_BUTTONS["seo-audit"],
    ratings,
    isAnalyzing: isAnalyzing.value,
    click: analyze,
  },
}));

function analyze() {
  if (reducedMotion.value === "reduce") openDialog();
  else startAnalysis();
}
</script>

<template>
  <ExhibitionScene
    :key="openCount"
    :page="page"
    :view-button="viewButton"
    @cancel="closeDialog"
  >
    <template v-if="isDialogOpen" #dialog>
      <PanelDialog size="large" :autofocus="hasReaderOpenedDialog">
        <PanelSeoAuditResult
          title="SEO & Readability Scores"
          :ratings="ratings"
          :results="results"
          version="changes"
          :timestamp="SEO_REPORT_TIMESTAMP"
        />
      </PanelDialog>
    </template>
  </ExhibitionScene>
</template>
