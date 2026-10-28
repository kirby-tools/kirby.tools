<script setup lang="ts">
import type { PanelSeoAuditButtonProps } from "../../types/plugins";
import { AuditButton } from "#kirby-plugin/seo-audit";
import { translate } from "#panel-mock/translate";

defineProps<PanelSeoAuditButtonProps>();
</script>

<template>
  <AuditButton
    :label="translate('johannschopplich.seo-audit.label')"
    :rating="rating"
    :is-analyzing="isAnalyzing"
    @click="click?.()"
  />
</template>
