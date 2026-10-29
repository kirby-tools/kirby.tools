<script setup lang="ts">
import { CopilotFieldBody } from "#kirby-plugin/copilot";
import { translate } from "#panel-mock/translate";

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    theme?: string;
    size?: string;
    editable?: boolean;
    files?: boolean | "auto";
    userPrompt?: string;
    open?: boolean;
    isGenerating?: boolean;
    canUndo?: boolean;
    fileCount?: number;
  }>(),
  { editable: true, files: true },
);

const LABELS = {
  generate: translate("johannschopplich.copilot.generate"),
  stop: translate("johannschopplich.copilot.stop"),
  undo: translate("johannschopplich.copilot.undo"),
  prompt: translate("johannschopplich.copilot.prompt.label"),
  context: translate("johannschopplich.copilot.context"),
  placeholder: translate("johannschopplich.copilot.prompt.placeholder"),
  reset: translate("johannschopplich.copilot.context.reset"),
  selectFiles: translate("johannschopplich.copilot.files.select"),
  clearFiles: translate("johannschopplich.copilot.delete"),
};

const prompt = ref(props.userPrompt ?? "");
const isOpen = ref(props.open);
</script>

<template>
  <!-- The PHP field's defaults for a field keyed `copilot`. -->
  <CopilotFieldBody
    v-model:prompt="prompt"
    v-model:open="isOpen"
    :label="label || translate('johannschopplich.copilot.label')"
    name="copilot"
    :labels="LABELS"
    :icon="icon"
    :theme="theme"
    :size="size"
    :editable="editable"
    :files="files"
    :user-prompt="userPrompt"
    :is-generating="isGenerating"
    :can-undo="canUndo"
    :file-count="fileCount"
  />
</template>

<style>
/* What Kirby's `$library.autosize` sets inline on mount, a script no Mock runs.
   It measures an empty textarea at its default two rows, which `field-sizing`
   ignores, so the minimum is two lines plus `--input-padding-multiline` above
   and below. */
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
