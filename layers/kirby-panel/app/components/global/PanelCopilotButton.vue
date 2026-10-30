<script setup lang="ts">
import type { PanelCopilotButtonProps } from "../../types/plugins";
import { ViewButtonBody } from "#kirby-plugin/copilot";
import { translate } from "#panel-mock/translate";

defineProps<PanelCopilotButtonProps>();
</script>

<template>
  <ViewButtonBody
    :label="label || translate('johannschopplich.copilot.label')"
    :icon="icon"
    :theme="theme"
    :is-generating="isGenerating"
    @click="!isGenerating && click?.()"
    @abort="abort?.()"
  />
</template>
