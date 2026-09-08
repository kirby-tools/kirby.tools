<script setup lang="ts">
// The minimap borrows the `--menu-*` tokens from Kirby's own menu, which no
// other mock renders and whose stylesheet is therefore not in the bundle.
import "#kirby-panel/components/View/Menu.vue?vue&type=style&index=0&lang.css";

withDefaults(
  defineProps<{
    fields?: PanelMinimapField[];
    open?: boolean;
  }>(),
  { open: true },
);
</script>

<template>
  <nav class="k-panel-minimap" :data-open="String(open)">
    <div class="k-panel-minimap-body">
      <menu>
        <div v-for="field in fields" :key="field.label">
          <div
            class="k-panel-minimap-menu-item"
            :class="open ? 'py-(--spacing-2)' : 'py-(--spacing-3)'"
            :data-active="String(Boolean(field.active))"
          >
            <template v-if="open">
              <span class="k-label-text [font-weight:var(--font-semi)]">
                {{ field.label }}
              </span>
              <span
                v-if="field.required"
                data-theme="negative"
                class="ms-(--spacing-1) text-[color:var(--theme-color-600)] [font-weight:var(--font-semi)]"
                >✶</span
              >
            </template>
            <div v-else class="h-px flex-1 bg-(--color-text)" />
          </div>

          <div
            v-for="(block, index) in field.blocks"
            :key="index"
            class="k-panel-minimap-menu-item flex items-center gap-(--spacing-2) py-(--spacing-1)"
            :data-active="String(Boolean(block.active))"
          >
            <k-icon :type="block.icon" />
            <span class="k-label-text">{{ block.text }}</span>
          </div>
        </div>
      </menu>
    </div>

    <k-button
      :icon="open ? 'angle-right' : 'angle-left'"
      size="xs"
      class="k-panel-minimap-toggle"
    />
  </nav>
</template>

<style>
/* In the Panel the sidebar is fixed to the viewport and the view keeps clear of
   it through `--main-end`. A Mock's Panel reaches no further than its own box,
   so the anchor is the Panel element and the stage takes the margin. */
.panel-mock .k-panel:has(> .k-panel-minimap) {
  position: relative;
}

.panel-mock .k-panel:has(> .k-panel-minimap) .panel-mock-stage {
  margin-inline-end: var(--menu-width-open);
}

.panel-mock .k-panel:has(> .k-panel-minimap[data-open="false"]) .panel-mock-stage {
  margin-inline-end: calc(var(--menu-toggle-width) + 2 * var(--menu-padding));
}

.panel-mock .k-panel-minimap {
  position: absolute;
  inset-inline-end: 0;
  inset-block: 0;
  width: var(--menu-width-open);
  border-left: 1px solid var(--menu-color-border);
  background-color: var(--panel-color-back);
}

.panel-mock .k-panel-minimap[data-open="false"] {
  width: calc(var(--menu-toggle-width) + 2 * var(--menu-padding));
}

.panel-mock .k-panel-minimap-body {
  padding-block: var(--menu-padding);
  overflow: hidden;
  height: 100%;
}

/* The Panel fades the handle in on hover, which a figure has no pointer for. */
.panel-mock .k-panel-minimap-toggle {
  --button-align: flex-start;
  --button-height: 100%;
  --button-width: var(--menu-toggle-width);
  position: absolute;
  inset-block: 0;
  inset-inline-end: 100%;
  align-items: flex-start;
  border-radius: 0;
  overflow: visible;
}

.panel-mock .k-panel-minimap-toggle .k-button-icon {
  display: grid;
  place-items: center;
  height: var(--menu-toggle-height);
  width: var(--menu-toggle-width);
  margin-top: var(--menu-padding);
  border-block: 1px solid var(--menu-color-border);
  border-inline-start: 1px solid var(--menu-color-border);
  background: var(--panel-color-back);
  border-start-start-radius: var(--button-rounded);
  border-end-start-radius: var(--button-rounded);
}

.panel-mock .k-panel-minimap-menu-item {
  border-inline-start: 1px solid transparent;
  padding-inline: var(--menu-padding);
}

.panel-mock .k-panel-minimap-menu-item[data-active="true"] {
  border-inline-start-color: var(--color-focus);
}
</style>
