<script setup lang="ts">
import type { PanelSeoAuditButtonProps } from "../../types/plugins";
import { ViewButtonBody } from "#kirby-plugin/seo-audit";
import { translate } from "#panel-mock/translate";

defineProps<PanelSeoAuditButtonProps>();
</script>

<template>
  <ViewButtonBody
    :label="translate('johannschopplich.seo-audit.label')"
    :rating="rating"
    :is-analyzing="isAnalyzing"
    @click="click?.()"
  />
</template>
