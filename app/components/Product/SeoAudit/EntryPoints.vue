<script setup lang="ts">
const VIEW_BUTTONS: PanelViewButton[] = [
  {
    component: "PanelSeoAuditButton",
    props: { ...PLUGIN_VIEW_BUTTONS["seo-audit"], ratings: SEO_RATINGS },
  },
  ...kirbyViewButtons(),
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
            {
              icon: 'seo-audit-analyze',
              text: 'Analyze',
              theme: 'positive-icon',
            },
          ]"
        />
      </PanelSeoAuditSectionBody>
    </PanelSection>
  </PanelMock>
</template>
