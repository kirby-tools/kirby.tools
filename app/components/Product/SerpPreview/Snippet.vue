<template>
  <PanelMock>
    <PanelViewHeader
      :title="EXHIBITION_PAGE.title"
      :buttons="KIRBY_VIEW_BUTTONS"
    />
    <PanelSection label="SERP Preview">
      <PanelSerpPreviewSnippet
        :site-title="EXHIBITION_SITE.title"
        :site-url="EXHIBITION_SITE.url"
        :title="`${EXHIBITION_PAGE.title} – ${EXHIBITION_SITE.title}`"
        :description="EXHIBITION_PAGE.description"
      />
    </PanelSection>
  </PanelMock>
</template>
