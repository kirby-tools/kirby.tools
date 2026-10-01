<script setup lang="ts">
const page = useExhibitionPage();
</script>

<template>
  <ExhibitionScene :page="page">
    <template #sidebar>
      <PanelMinimapSidebar :fields="MINIMAP_FIELDS" />
    </template>
  </ExhibitionScene>
</template>
