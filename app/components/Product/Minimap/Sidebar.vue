<template>
  <PanelMock>
    <PanelViewHeader
      :title="EXHIBITION_PAGE.title"
      :buttons="KIRBY_VIEW_BUTTONS"
    />
    <PanelBlocksField name="text" label="Text" :blocks="EXHIBITION_BLOCKS" />

    <template #sidebar>
      <PanelMinimapSidebar :fields="MINIMAP_FIELDS" />
    </template>
  </PanelMock>
</template>
