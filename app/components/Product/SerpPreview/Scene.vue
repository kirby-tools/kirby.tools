<script setup lang="ts">
const page = useExhibitionPage();
const { content } = page;
</script>

<template>
  <ExhibitionScene :page="page">
    <template #main>
      <PanelSerpPreviewField
        :view-title="content.title"
        :content="content"
        :favicon-url="EXHIBITION_SITE.faviconUrl"
        :site-title="EXHIBITION_SITE.title"
        :site-url="EXHIBITION_URL.origin"
        :preview-path="EXHIBITION_URL.pathname"
        description-content-key="description"
      />
    </template>
  </ExhibitionScene>
</template>
