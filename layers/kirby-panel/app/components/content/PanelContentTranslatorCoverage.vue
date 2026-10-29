<script setup lang="ts">
import type {
  TranslationLanguageCoverage,
  TranslationTreeEntry,
} from "#kirby-plugin/content-translator";
import {
  createCoverageLabels,
  TranslationCoverage,
} from "#kirby-plugin/content-translator";
import { translate } from "#panel-mock/translate";
// The plugin borrows the markup of Kirby's `k-stats` and `k-tree` without
// their components.
import "#kirby-panel/components/Layout/Stats.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Layout/Stat.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Navigation/Tree.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  languages: TranslationLanguageCoverage[];
  tree?: TranslationTreeEntry[];
}>();

const labels = createCoverageLabels(translate);
// The plugin loads a page's children when it opens; the Mock holds them all
// and only flips the page open.
const stagedTree = ref(structuredClone(toRaw(props.tree ?? [])));

function toggle(item: TranslationTreeEntry) {
  item.isOpen = !item.isOpen;
}
</script>

<template>
  <TranslationCoverage
    :languages="languages"
    :tree="stagedTree"
    :labels="labels"
    @toggle="toggle"
  />
</template>
