<script setup lang="ts">
import "#kirby-panel/components/Text/Headline.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  title?: string;
  buttons?: (Record<string, unknown> | string)[];
}>();

const buttons = computed(() =>
  (props.buttons ?? []).map((button, index) =>
    typeof button === "string"
      ? button
      : {
          key: index,
          component: button.items ? "PanelViewButton" : undefined,
          props: button,
        },
  ),
);
</script>

<template>
  <k-header class="panel-view-header">
    {{ title }}

    <template #buttons>
      <k-view-buttons :buttons="buttons" />
    </template>
  </k-header>
</template>

<style>
/* Kirby pads the header itself and reserves a gap below it for the view. A mock
   cropped to the header shows no view, so the gap goes and Kirby's own padding
   stands in for the stage's. */
.panel-preview .panel-view-header {
  margin-bottom: 0;
}

.panel-preview .panel-preview-stage:has(> .panel-view-header) {
  padding-top: 0;
}

/* Kirby keeps title and buttons on one line from a 70rem viewport up, but the
   mock is a box a few hundred pixels wide inside such a viewport. It wraps on
   its own width instead. */
@media screen and (min-width: 70rem) {
  .panel-preview .panel-view-header {
    flex-wrap: wrap;
  }
}

@container (min-width: 40rem) {
  .panel-preview .panel-view-header {
    flex-wrap: nowrap;
  }
}
</style>
