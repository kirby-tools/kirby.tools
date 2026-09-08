<script setup lang="ts">
/* eslint-disable perfectionist/sort-imports -- Kirby's own order decides
   which rules win. */

// Imported here rather than in the layer's plugin, so only pages that show a
// mock carry Kirby's stylesheet.
import "#kirby-panel/styles/config.css";
import "#kirby-panel/styles/reset.css";
import "#kirby-panel/components/View/Panel.vue?vue&type=style&index=0&lang.css";
// The `--item-*` tokens `k-choice-input` and `k-empty` read.
import "#kirby-panel/components/Collection/Item.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/styles/utilities.css";
import { extensions } from "#panel-mock/extensions";

withDefaults(
  defineProps<{
    theme?: "light" | "dark" | "auto";
    label?: string;
    dialogAlign?: "start" | "end";
  }>(),
  { theme: "auto" },
);

const isInert = inject(panelMockInertKey, false);
</script>

<template>
  <figure class="panel-mock my-6">
    <figcaption class="panel-mock-chrome">
      <k-icon type="kirby" />
      <span>Kirby Panel</span>
      <span v-if="label" class="panel-mock-chrome-label">{{ label }}</span>
    </figcaption>

    <div class="k-panel" :data-theme="theme" :inert="isInert">
      <div class="panel-mock-stage">
        <!-- Kirby's overlay is a `<dialog>` opened with `showModal()`, so the
             platform inerts the view behind it. Nothing here is in the top
             layer. -->
        <template v-if="$slots.dialog">
          <div class="panel-mock-view" inert>
            <slot />
          </div>

          <div class="panel-mock-portal" :data-align="dialogAlign">
            <slot name="dialog" />
          </div>
        </template>
        <slot v-else />
      </div>

      <slot name="sidebar" />
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
.panel-mock {
  display: block;
  /* Kirby's sheet stacks a Panel against the viewport – `.k-header` alone sits
     at `z-index: 300`, which outranks the docs navigation. */
  isolation: isolate;
  overflow: clip;
  border-radius: var(--ui-radius);
  border: 1px solid var(--ui-border);
}

/* Kirby only ever declares `color-scheme: dark`, because a Panel sits in a
   document that is otherwise light. Here the page around it may be either. */
.panel-mock:has(.k-panel[data-theme="light"]),
:root:not(.dark) .panel-mock:has(.k-panel[data-theme="auto"]) {
  color-scheme: light;
}

/* `display: contents` drops the box, not the node: the stage's `:has(> …)`
   rules stop at the wrapper, so nothing behind a dialog can be styled by one. */
.panel-mock .panel-mock-view {
  display: contents;
}

/* Kirby opens its portal over the viewport; a Mock's Panel reaches no further
   than the stage. */
.panel-mock .panel-mock-portal {
  position: absolute;
  inset: 0;
  z-index: var(--z-dialog);
  display: flex;
  /* `.k-overlay[open]` also sets `overscroll-behavior: contain`, against a
     viewport it fills. Kept here, it would stop the page under a pointer over
     the stage even when nothing overflows. */
  overflow: auto;
  /* In place of `--dialog-margin`, which Kirby sizes for a viewport: the dialog
     keeps the inset of everything else on the stage. */
  padding: var(--panel-stage-inset);
}

.panel-mock .panel-mock-portal > * {
  margin: auto;
}

.panel-mock .panel-mock-portal[data-align="start"] > * {
  margin-top: 0;
}

.panel-mock .panel-mock-portal[data-align="end"] > * {
  margin-bottom: 0;
}

/* Kirby's view buttons, `k-table` and the mock's own view-header rule query a
   container. In the Panel that is the view; here it is a box inside a page, so
   the stage establishes one. */
.panel-mock .panel-mock-stage {
  /* The anchor for what Kirby fixes to the viewport: the dialog portal and
     the notification. */
  position: relative;
  container-type: inline-size;
  container-name: panel-stage;
  --panel-stage-inset: var(--spacing-4);
  padding: var(--panel-stage-inset);
  background: var(--panel-color-back);
}

/* Kirby's sheet redeclares `--font-sans` on `.panel-mock`, so the chrome
   inside it would read the Panel's system stack; the docs font is declared
   again for it. */
:root {
  --panel-mock-chrome-font: var(--font-sans);
}

.panel-mock-chrome {
  --icon-size: 14px;

  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg);
  padding: 8px 12px;
  color: var(--ui-text-highlighted);
  font-family: var(--panel-mock-chrome-font);
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
}

.panel-mock-chrome-label {
  margin-left: auto;
  color: var(--ui-text-dimmed);
}
</style>
