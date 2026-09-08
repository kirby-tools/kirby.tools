<template>
  <PanelMock class="product-minimap-sidebar">
    <PanelFieldset>
      <PanelBlocksField name="text" label="Text" :blocks="EXHIBITION_BLOCKS" />

      <PanelField label="Description" name="description">
        <PanelInput :value="EXHIBITION_PAGE.description" buttons />
      </PanelField>

      <PanelField label="Dates" name="dates" type="text">
        <PanelInput :value="EXHIBITION_PAGE.dates" />
      </PanelField>
    </PanelFieldset>

    <template #sidebar>
      <PanelMinimapSidebar :fields="MINIMAP_FIELDS" />
    </template>
  </PanelMock>
</template>

<style>
/* The sidebar sets the Panel's height; the Stage is cropped to it. */
.product-minimap-sidebar.panel-mock .k-panel-minimap {
  position: relative;
  inset: auto;
  margin-inline-start: auto;
}

.product-minimap-sidebar.panel-mock .panel-mock-stage {
  position: absolute;
  inset: 0;
  overflow: clip;
}
</style>
