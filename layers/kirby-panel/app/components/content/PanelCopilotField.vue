<script setup lang="ts">
import { createFieldLabels, FieldBody } from "#kirby-plugin/copilot";
import { translate } from "#panel-mock/translate";

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    theme?: string;
    editable?: boolean;
    files?: boolean | "auto";
    userPrompt?: string;
    isGenerating?: boolean;
    canUndo?: boolean;
    fileNames?: string[];
  }>(),
  { editable: true, files: true },
);

const LABELS = createFieldLabels(translate);

const prompt = ref(props.userPrompt ?? "");
// A Mock stands on an image's view, where `files: auto` gets the plugin's note
// for the viewed file.
const modelFileText = computed(() =>
  props.files === "auto"
    ? translate("johannschopplich.copilot.context.file.model")
    : undefined,
);
</script>

<template>
  <!-- The PHP field's defaults for a field keyed `copilot`. -->
  <FieldBody
    v-model:prompt="prompt"
    :label="label || translate('johannschopplich.copilot.label')"
    name="copilot"
    :labels="LABELS"
    :icon="icon"
    :theme="theme"
    :editable="editable"
    :files="files"
    :user-prompt="userPrompt"
    :is-generating="isGenerating"
    :can-undo="canUndo"
    :file-names="fileNames"
    :model-file-text="modelFileText"
  />
</template>

<style>
/* `field-sizing` stands in for Kirby's `$library.autosize` where the browser
   has it. Autosize measures an empty textarea at its default two rows, which
   `field-sizing` ignores, so the minimum is two lines plus
   `--input-padding-multiline` above and below. */
.panel-mock .k-copilot-field .k-textarea-input-native {
  field-sizing: content;
  min-height: calc(2lh + 0.95rem);
  overflow: hidden;
}

@media (pointer: coarse) {
  .panel-mock .k-copilot-field .k-textarea-input-native {
    min-height: calc(2lh + 0.75rem);
  }
}
</style>
