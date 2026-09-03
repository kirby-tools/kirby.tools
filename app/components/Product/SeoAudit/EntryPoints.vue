<script setup lang="ts">
const VIEW_BUTTONS: PanelViewButton[] = [
  PLUGIN_VIEW_BUTTONS["seo-audit"],
  ...KIRBY_VIEW_BUTTONS,
];
</script>

<template>
  <PanelMock>
    <PanelViewHeader :title="EXHIBITION_PAGE.title" :buttons="VIEW_BUTTONS" />
    <PanelSection label="SEO Audit">
      <PanelSeoAuditSectionBody>
        <PanelButtonGroup
          layout="collapsed"
          variant="filled"
          :buttons="[
            { icon: 'seo-audit-analyze', text: 'Analyze', theme: 'positive' },
          ]"
        />
      </PanelSeoAuditSectionBody>
    </PanelSection>
  </PanelMock>
</template>
