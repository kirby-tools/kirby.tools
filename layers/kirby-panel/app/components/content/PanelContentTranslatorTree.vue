<script setup lang="ts">
import "#kirby-panel/components/Navigation/Tree.vue?vue&type=style&index=0&lang.css";

defineProps<{
  items: PanelContentTranslatorTreeEntry[];
}>();
</script>

<template>
  <PanelSection
    label="Pages to Translate"
    class="panel-content-translator-tree"
  >
    <ul class="k-tree flex flex-col gap-[2px]">
      <PanelContentTranslatorTreeNode
        v-for="item in items"
        :key="item.label"
        :item="item"
        :level="0"
      />
    </ul>
  </PanelSection>
</template>

<style>
/* Kirby paints tree branches on the Panel background. The plugin wraps each top-level page in an item card. */
.panel-mock .panel-content-translator-tree > .k-tree > li {
  background: var(--item-color-back);
  box-shadow: var(--item-shadow);
  border-radius: var(--rounded);
  overflow: hidden;
}
</style>
