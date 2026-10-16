<script setup lang="ts">
import { translate } from "#panel-mock/translate";
import "#kirby-panel/components/Text/Headline.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  title?: string;
  buttons?: PanelViewButton[];
  hasDiff?: boolean;
}>();

const emit = defineEmits<(event: "discard" | "save") => void>();

// The buttons `k-form-controls` shows for unsaved changes, drawn here because
// its script opens Panel dialogs a Mock lacks. Discard and Save hand their
// click to the host, which keeps the page.
const FORM_CONTROLS: {
  theme: string;
  text?: string;
  title?: string;
  icon: string;
  responsive?: boolean;
  event?: "discard" | "save";
}[] = [
  {
    theme: "notice",
    text: translate("discard"),
    icon: "undo",
    responsive: true,
    event: "discard",
  },
  { theme: "notice", text: translate("save"), icon: "check", event: "save" },
  { title: translate("options"), theme: "notice", icon: "dots" },
];

const buttons = computed(() =>
  (props.buttons ?? []).map((button, index) =>
    typeof button === "string"
      ? button
      : "component" in button
        ? { key: index, ...button }
        : {
            key: index,
            component: button.options ? "PanelViewButton" : undefined,
            props: button,
          },
  ),
);
</script>

<template>
  <k-header class="panel-view-header">
    {{ title }}

    <template #buttons>
      <k-view-buttons :buttons="buttons">
        <template v-if="hasDiff" #after>
          <k-button-group layout="collapsed" class="k-form-controls">
            <k-button
              v-for="button in FORM_CONTROLS"
              :key="button.icon"
              v-bind="button"
              size="sm"
              variant="filled"
              class="k-form-controls-button"
              @click="button.event && emit(button.event)"
            />
          </k-button-group>
        </template>
      </k-view-buttons>
    </template>
  </k-header>
</template>

<style>
/* Kirby pads the header itself and reserves a gap below it for the view. A Mock that
   stages the header alone shows no view, so the gap goes and Kirby's own padding
   stands in for the stage's. */
.panel-mock .panel-view-header:last-child {
  margin-bottom: 0;
}

.panel-mock
  .panel-mock-stage:has(
    > .panel-view-header,
    > .panel-mock-view > .panel-view-header
  ) {
  padding-top: 0;
}

/* Kirby keeps title and buttons on one line from a 70rem viewport up, but the
   Mock is a box a few hundred pixels wide inside such a viewport. It wraps on
   its own width instead. */
@media screen and (min-width: 70rem) {
  .panel-mock .panel-view-header {
    flex-wrap: wrap;
  }
}

@container panel-stage (min-width: 40rem) {
  .panel-mock .panel-view-header {
    flex-wrap: nowrap;
  }
}
</style>
