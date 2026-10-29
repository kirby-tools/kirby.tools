<template>
  <PanelMock label="Languages">
    <PanelContentTranslatorCoverage
      :languages="TRANSLATOR_COVERAGE_LANGUAGES"
      :tree="TRANSLATOR_COVERAGE_TREE"
    />
  </PanelMock>
</template>

<style>
/* Kirby's `k-stats` fits as many columns as `minmax(14rem, 1fr)` allows, which
   orphans a ring on a Stage too narrow for three. Three columns that narrow
   leave Kirby's `--spacing-6` inline padding no room for the ring. */
.panel-mock .k-content-translator-coverage .k-stats {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.panel-mock .k-content-translator-coverage .k-stat {
  padding-inline: var(--spacing-3);
}
</style>
