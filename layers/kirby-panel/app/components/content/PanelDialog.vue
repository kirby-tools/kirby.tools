<script setup lang="ts" generic="T extends Record<string, unknown>">
import { HtmlString } from "#kirby-panel/panel/html";
import { translate } from "#panel-mock/translate";
// Kirby's `k-dialog` teleports into a portal the Panel owns, which puts its
// content beside the page rather than in the Mock.
import "#kirby-panel/components/Dialogs/Dialog.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Body.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Buttons.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Fields.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Footer.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Layout/Overlay.vue?vue&type=style&index=0&lang.css";

type DialogButton = boolean | { text?: string; icon?: string; theme?: string };

const props = withDefaults(
  defineProps<{
    size?: "small" | "default" | "medium" | "large" | "huge";
    cancelButton?: DialogButton;
    submitButton?: DialogButton;
    fields?: Record<string, Record<string, unknown>>;
    value?: T;
    /**
     * Whether the dialog takes focus as it mounts, as Kirby's overlay does as
     * it opens. Meant for a dialog the reader opens: one shown on load leaves
     * the page's focus alone.
     */
    autofocus?: boolean;
  }>(),
  { size: "default" },
);

const emit = defineEmits<{ cancel: []; submit: [value: T] }>();

// What `showModal()` focuses in Kirby's `<dialog>` when nothing in it asks for
// focus, and where Kirby's `focus` helper then leaves it.
const FOCUSABLE_SELECTOR =
  ":is(a[href], button, input, select, textarea, [contenteditable=true], [tabindex]):not([disabled], [type=hidden], [tabindex='-1'])";

// Kirby escapes field text unless the key marks it trusted, so `<help>` is what
// lets a Mock's help text carry a link.
const fields = computed(() => HtmlString.resolve(props.fields));

// Kirby's inputs change the arrays they are given in place, which the Panel
// builds fresh for every dialog it opens.
const values = shallowRef(props.value && structuredClone(props.value));

const dialog = useTemplateRef<HTMLFormElement>("dialog");

onMounted(() => {
  if (!props.autofocus) return;
  // An element that asks for focus comes first; `[data-autofocus]` marks the
  // Mock's stand-in for a plugin editor that focuses itself.
  const target =
    dialog.value!.querySelector<HTMLElement>("[autofocus], [data-autofocus]") ??
    dialog.value!.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  target?.focus({ preventScroll: true });
});

const buttons = computed(() =>
  [
    props.cancelButton && {
      click: () => emit("cancel"),
      class: "k-dialog-button-cancel",
      icon: "cancel",
      text: translate("cancel"),
      ...(props.cancelButton === true ? {} : props.cancelButton),
    },
    props.submitButton && {
      class: "k-dialog-button-submit",
      icon: "check",
      text: translate("confirm"),
      theme: "positive",
      type: "submit",
      ...(props.submitButton === true ? {} : props.submitButton),
    },
  ].filter(Boolean),
);
</script>

<template>
  <form
    ref="dialog"
    class="panel-dialog k-dialog"
    :data-size="size"
    method="dialog"
    @submit.prevent="values && emit('submit', values)"
  >
    <slot name="header" />

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

    <footer v-if="buttons.length" class="k-dialog-footer">
      <k-button-group
        :buttons="buttons"
        variant="filled"
        class="k-dialog-buttons"
      />
    </footer>
  </form>
</template>

<style>
/* The dim Kirby paints in the portal it opens. Declared here rather than on
   either box, because `Dialog.vue`'s stylesheet, imported here, is what brings
   `--overlay-color-back`. */
.panel-mock .panel-mock-portal,
.panel-mock .panel-mock-stage:has(> .panel-dialog) {
  background: var(--overlay-color-back);
}

/* The stage stands in for the portal where the dialog is all there is. */
.panel-mock .panel-mock-stage:has(> .panel-dialog) {
  display: flex;
  /* Cards crop the stage taller than the dialog, which `stretch` would fill. */
  align-items: start;
  justify-content: center;
}
</style>
