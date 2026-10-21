<script setup lang="ts">
import type { PanelContentTranslatorOptions } from "../../../shared/types/plugins";

const props = withDefaults(
  defineProps<
    PanelContentTranslatorOptions & {
      label?: string;
      theme?: string;
      /** A run in progress, which the plugin reads from its translation state. */
      isTranslating?: boolean;
      /** Shows the dropdown open, for a Mock the reader doesn't click. */
      open?: boolean;
      /** Runs the picked action, which the plugin runs itself. */
      run?: (action: PanelContentTranslatorAction) => void;
    }
  >(),
  { label: "Translator", theme: "notice-icon", import: true, batch: true },
);

const dropdown = useTemplateRef<{ toggle: () => void }>("dropdown");

const options = computed<PanelDropdownOption[]>(() =>
  contentTranslatorActions(props)
    .filter((group) => group.length > 0)
    .flatMap((group, index) => [
      ...(index > 0 ? (["-"] as const) : []),
      ...group.map((action) => ({
        text: action.text,
        icon: action.icon,
        disabled: action.disabled || props.isTranslating,
        click: props.run && (() => props.run!(action)),
      })),
    ]),
);
</script>

<template>
  <div class="panel-content-translator-dropdown-button relative">
    <k-button
      :text="label"
      :icon="isTranslating ? 'loader' : 'content-translator-global'"
      :theme="theme"
      size="sm"
      variant="filled"
      responsive
      dropdown
      @click="dropdown?.toggle()"
    />
    <PanelDropdown v-if="open" :options="options" align-x="start" />
    <k-dropdown v-else ref="dropdown" :options="options" />
  </div>
</template>

<style>
/* A Mock that stages the header alone has no view for the dropdown to cover, so
   the stage stands in for it. Enough for the dropdowns the docs show open; a
   taller one would clip visibly. */
.panel-mock
  .panel-mock-stage:has(
    .panel-content-translator-dropdown-button > .panel-dropdown
  ) {
  padding-bottom: var(--spacing-12);
}
</style>
