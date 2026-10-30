<script setup lang="ts">
// The plugin's default `updateInterval`.
const UPDATE_INTERVAL = 500;

const page = useExhibitionPage();
const preview = refThrottled(page.content, UPDATE_INTERVAL);
</script>

<template>
  <ExhibitionScene :page="page">
    <template #aside>
      <PanelLivePreviewField aspect-ratio="3/4">
        <ProductLivePreviewPage
          v-bind="preview"
          :lang="page.languageCode.value"
        />
      </PanelLivePreviewField>
    </template>
  </ExhibitionScene>
</template>
