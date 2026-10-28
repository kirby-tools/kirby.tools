<script setup lang="ts">
const VIEW_BUTTONS: PanelViewButton[] = [
  { plugin: "seo-audit", rating: SEO_PAGE_RATING },
  ...kirbyViewButtons(),
];
</script>

<template>
  <PanelMock>
    <PanelViewHeader :title="EXHIBITION_PAGE.title" :buttons="VIEW_BUTTONS" />
    <PanelFieldset>
      <k-column>
        <PanelSeoAuditField />
      </k-column>
    </PanelFieldset>
  </PanelMock>
</template>
