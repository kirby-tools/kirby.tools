<script setup lang="ts">
const page = useExhibitionPage();
const { content } = page;
</script>

<template>
  <ExhibitionScene :page="page">
    <template #main>
      <PanelSection label="SERP Preview">
        <PanelSerpPreviewSnippet
          :favicon-url="EXHIBITION_SITE.faviconUrl"
          :site-title="EXHIBITION_SITE.title"
          :site-url="EXHIBITION_SITE.url"
          :title="`${content.title} – ${EXHIBITION_SITE.title}`"
          :description="content.description"
        />
      </PanelSection>
    </template>
  </ExhibitionScene>
</template>
