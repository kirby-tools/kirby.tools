<script setup lang="ts">
import { HtmlString } from "#kirby-panel/panel/html";
// Kirby's `k-dialog` teleports into a portal the Panel owns, which puts its
// content beside the page rather than in the mock.
import "#kirby-panel/components/Dialogs/Dialog.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Body.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Buttons.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Fields.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Footer.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Layout/Overlay.vue?vue&type=style&index=0&lang.css";

const props = withDefaults(
  defineProps<{
    size?: "small" | "default" | "medium" | "large" | "huge";
    buttons?: Record<string, unknown>[];
    fields?: Record<string, Record<string, unknown>>;
    value?: Record<string, unknown>;
  }>(),
  { size: "default" },
);

// Kirby escapes field text unless the key marks it trusted, so `<help>` is what
// lets a mock's help text carry a link.
const fields = computed(() => HtmlString.resolve(props.fields));

const values = ref({ ...props.value });
</script>

<template>
  <div class="panel-dialog k-dialog" :data-size="size">
    <div class="k-dialog-body">
      <k-fieldset
        v-if="fields"
        :fields="fields"
        :value="values"
        class="k-dialog-fields"
        @input="values = $event"
      />
      <slot />
    </div>

    <footer v-if="buttons" class="k-dialog-footer">
      <k-button-group
        :buttons="buttons"
        variant="filled"
        class="k-dialog-buttons"
      />
    </footer>
  </div>
</template>

<style>
/* A dialog with no view behind it: the stage does what `k-portal` does,
   centering the dialog and dimming what it covers. A figure that shows the view
   too puts the dialog in a `PanelDialogPortal` instead. */
.panel-preview .panel-preview-stage:has(> .panel-dialog) {
  display: flex;
  justify-content: center;
  background: var(--overlay-color-back);
}
</style>
