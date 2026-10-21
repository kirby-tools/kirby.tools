<script setup lang="ts">
const VIEW_BUTTONS: PanelViewButton[] = [
  { plugin: "seo-audit", ratings: SEO_RATINGS },
  ...kirbyViewButtons(),
];
</script>

<template>
  <PanelMock>
    <PanelViewHeader :title="EXHIBITION_PAGE.title" :buttons="VIEW_BUTTONS" />
    <PanelSeoAuditSection />
  </PanelMock>
</template>
