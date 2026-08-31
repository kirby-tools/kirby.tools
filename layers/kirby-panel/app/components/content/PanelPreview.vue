<script setup lang="ts">
/* eslint-disable perfectionist/sort-imports -- Kirby's own order decides
   which rules win. */

// Import here rather than in the layer's plugin, so only pages that show a mock
// carry Kirby's stylesheet.
import "#kirby-panel/styles/config.css";
import "#kirby-panel/styles/reset.css";
import "#kirby-panel/components/View/Panel.vue?vue&type=style&index=0&lang.css";
// The `--item-*` tokens `k-choice-input` and `k-empty` read.
import "#kirby-panel/components/Collection/Item.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/styles/utilities.css";
import { extensions } from "#panel-preview/extensions";

withDefaults(
  defineProps<{
    theme?: "light" | "dark" | "auto";
    label?: string;
  }>(),
  { theme: "auto" },
);
</script>

<template>
  <figure class="panel-preview my-6">
    <figcaption class="panel-preview-chrome">
      <k-icon type="kirby" />
      <span>Kirby Panel</span>
      <span v-if="label" class="panel-preview-chrome-label">{{ label }}</span>
    </figcaption>

    <div class="k-panel" :data-theme="theme">
      <div class="panel-preview-stage">
        <slot />
      </div>
    </div>

    <!-- Where `k-icon` resolves a plugin icon: a `<use>` pointing at a symbol
         the Panel inlines into its own document. -->
    <svg hidden aria-hidden="true">
      <symbol
        v-for="(body, name) in extensions.icons"
        :id="`icon-${name}`"
        :key="name"
        viewBox="0 0 24 24"
        v-html="body"
      />
    </svg>
  </figure>
</template>

<style>
/* The class Kirby's stylesheet is scoped to: everything it puts on `:root`,
   `html` and `body` lands here instead. */
.panel-preview {
  display: block;
  overflow: hidden;
  border-radius: var(--ui-radius);
  border: 1px solid var(--ui-border);
}

/* Kirby only ever declares `color-scheme: dark`, because a Panel sits in a
   document that is otherwise light. Here the page around it may be either. */
.panel-preview:has(.k-panel[data-theme="light"]),
:root:not(.dark) .panel-preview:has(.k-panel[data-theme="auto"]) {
  color-scheme: light;
}

/* Kirby's view buttons, `k-table` and the mock's own view-header rule query a
   container. In the Panel that is the view; here it is a box inside a page, so
   the stage establishes one. */
.panel-preview .panel-preview-stage {
  container-type: inline-size;
  padding: var(--spacing-4);
  background: var(--panel-color-back);
}

/* Kirby's sheet redeclares `--font-sans` on `.panel-preview`, so the chrome
   inside it would read the Panel's system stack. This carries the docs font
   past the shadowing. */
:root {
  --panel-preview-chrome-font: var(--font-sans);
}

.panel-preview-chrome {
  --icon-size: 14px;

  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg);
  padding: 6px 10px;
  color: var(--ui-text-muted);
  font-family: var(--panel-preview-chrome-font);
  font-size: 12px;
}

.panel-preview-chrome-label {
  margin-left: auto;
  color: var(--ui-text-dimmed);
}
</style>
