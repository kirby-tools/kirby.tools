<script setup lang="ts">
defineProps<{
  tree?: boolean;
}>();
</script>

<template>
  <PanelMock label="Languages">
    <PanelContentTranslatorCoverage
      :languages="TRANSLATOR_COVERAGE_LANGUAGES"
    />
    <PanelContentTranslatorTree v-if="tree" :items="TRANSLATOR_COVERAGE_TREE" />
  </PanelMock>
</template>

<style>
/* Kirby's `k-stats` wraps below 14rem per stat, which orphans a ring in a narrow feature card. */
.product-feature-card .panel-content-translator-coverage .k-stats {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.product-feature-card .panel-content-translator-coverage .k-stat {
  padding-inline: var(--spacing-3);
}
</style>
