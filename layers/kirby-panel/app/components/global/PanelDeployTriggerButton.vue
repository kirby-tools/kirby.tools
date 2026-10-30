<script setup lang="ts">
import type { PanelDeployTriggerButtonProps } from "../../types/plugins";
import { DeployTriggerButtonBody } from "#kirby-plugin/deploy-trigger";
import { translate } from "#panel-mock/translate";

defineProps<PanelDeployTriggerButtonProps>();
</script>

<template>
  <DeployTriggerButtonBody
    :label="translate('johannschopplich.deploy-trigger.label')"
    :is-deploying="isDeploying"
    class="panel-deploy-trigger-button"
    @click="click?.()"
  />
</template>
