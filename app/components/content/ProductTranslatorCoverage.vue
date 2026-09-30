<template>
  <PanelMock label="Languages">
    <PanelContentTranslatorCoverage
      :languages="TRANSLATOR_COVERAGE_LANGUAGES"
    />
    <PanelContentTranslatorTree :items="TRANSLATOR_COVERAGE_TREE" />
  </PanelMock>
</template>

<style>
/* Kirby's `k-stats` wraps below 14rem per stat, which orphans a ring on a narrow Stage. */
.panel-mock .panel-content-translator-coverage .k-stats {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.panel-mock .panel-content-translator-coverage .k-stat {
  padding-inline: var(--spacing-3);
}
</style>
