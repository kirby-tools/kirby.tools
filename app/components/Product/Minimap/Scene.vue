<script setup lang="ts">
const page = useExhibitionPage();
const { content } = page;
</script>

<template>
  <ExhibitionScene :page="page">
    <template #sidebar>
      <PanelMinimapSidebar :fields="minimapFields(content.text)" />
    </template>
  </ExhibitionScene>
</template>
