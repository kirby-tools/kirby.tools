<script setup lang="ts">
import "#kirby-panel/components/Layout/Stats.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Layout/Stat.vue?vue&type=style&index=0&lang.css";

defineProps<{
  languages: PanelContentTranslatorLanguageCoverage[];
}>();

const formatStatInfo = (language: PanelContentTranslatorLanguageCoverage) => {
  const { incompletePageCount: count } = language;
  if (count === 0) return "All pages translated";
  return `${count} incomplete ${count === 1 ? "page" : "pages"}`;
};
</script>

<template>
  <PanelSection
    label="Translation Coverage"
    class="panel-content-translator-coverage"
  >
    <dl class="k-stats">
      <!-- The plugin lays the percentage over its ring where Kirby's `k-stat` prints the value. -->
      <div
        v-for="language in languages"
        :key="language.code"
        class="k-stat items-center"
        :data-theme="language.percentage >= 100 ? 'positive' : 'info'"
      >
        <dt class="k-stat-label">{{ language.name }}</dt>
        <dd
          class="k-stat-value relative mb-[var(--spacing-2)] flex items-center justify-center"
        >
          <PanelContentTranslatorRing :value="language.percentage" />
          <span
            class="absolute text-[length:var(--text-lg)] [font-weight:var(--font-bold)]"
          >
            {{ language.percentage }}%
          </span>
        </dd>
        <dd class="k-stat-info">{{ formatStatInfo(language) }}</dd>
      </div>
    </dl>
  </PanelSection>
</template>
