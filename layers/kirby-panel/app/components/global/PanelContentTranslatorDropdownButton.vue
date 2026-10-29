<script setup lang="ts">
import type { PanelContentTranslatorDropdownButtonProps } from "../../types/plugins";
import {
  TranslatorDropdownButton,
  TranslatorDropdownItems,
} from "#kirby-plugin/content-translator";
import { translate } from "#panel-mock/translate";

const props = withDefaults(
  defineProps<PanelContentTranslatorDropdownButtonProps>(),
  { import: true, batch: true },
);

const resolution = useTranslatorActions(props);
</script>

<template>
  <div class="panel-content-translator-dropdown-button relative">
    <TranslatorDropdownButton
      :actions="resolution.groups"
      :label="
        label ||
        translate('johannschopplich.content-translator.viewButton.label')
      "
      :theme="theme"
      :is-translating="isTranslating"
      :inert="open"
      @run="run?.($event)"
    />
    <!-- Kirby's dropdown keeps its open state internal and places itself by
         measuring its opener, so a Mock that shows it open renders the items
         below the button. The button is inert meanwhile, since a click would
         open the plugin's own dropdown as a modal over them. -->
    <PanelDropdown v-if="open" align-x="start">
      <TranslatorDropdownItems
        :actions="resolution.groups"
        @run="run?.($event)"
      />
    </PanelDropdown>
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
