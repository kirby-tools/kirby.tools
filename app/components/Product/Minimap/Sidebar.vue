<script setup lang="ts">
// The figure stands beside the hero text, so the crop keeps to the blocks that
// stay short. The sidebar lists the field's full contents either way, which is
// the point it makes.
const BLOCKS = EXHIBITION_BLOCKS.filter((block) => block.type !== "text");
</script>

<template>
  <PanelMock>
    <PanelViewHeader
      :title="EXHIBITION_PAGE.title"
      :buttons="KIRBY_VIEW_BUTTONS"
    />
    <PanelBlocksField name="text" label="Text" :blocks="BLOCKS" />

    <template #sidebar>
      <PanelMinimapSidebar :fields="MINIMAP_FIELDS" />
    </template>
  </PanelMock>
</template>
