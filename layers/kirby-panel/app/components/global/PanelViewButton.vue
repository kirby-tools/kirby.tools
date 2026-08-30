<script setup lang="ts">
// Kirby's `k-dropdown` is a `dialog` its script opens and places, neither of
// which a static mock can do. Restate it open instead.
//
// It lives in `global/`, because `k-view-buttons` resolves the `component` key
// against the app the same way it does for a view button a plugin ships.
defineOptions({ inheritAttrs: false });

defineProps<{
  items?: Record<string, unknown>[];
}>();
</script>

<template>
  <div class="panel-view-button">
    <k-view-button v-bind="$attrs" dropdown />

    <div class="k-dropdown">
      <k-dropdown-item
        v-for="(item, index) in items"
        :key="index"
        v-bind="item"
      >
        {{ item.text }}
      </k-dropdown-item>
    </div>
  </div>
</template>

<style>
.panel-view-button {
  position: relative;
}

/* Kirby's script places the dropdown flush under the button and lets it cover
   whatever the view puts below the header. Absolute here too, so the header
   keeps the height its border-bottom belongs at. */
.panel-view-button .k-dropdown {
  inset-block-start: 100%;
}

/* The view the dropdown would cover is not part of a mock cropped to the header,
   so the stage stands in for it. Enough for the dropdowns the docs show open; a
   taller one would be clipped and obvious. */
.panel-preview .panel-preview-stage:has(.panel-view-button) {
  padding-bottom: var(--spacing-12);
}
</style>
