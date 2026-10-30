<script setup lang="ts">
import type { DevicePreset } from "#kirby-plugin/live-preview";
import { FieldBody } from "#kirby-plugin/live-preview";
import { translate } from "#panel-mock/translate";

defineProps<{
  aspectRatio?: string;
  devicePreview?: DevicePreset;
}>();

const labels = {
  open: translate("open"),
  renderError: translate("johannschopplich.preview.error.render"),
};
</script>

<template>
  <FieldBody
    :label="translate('johannschopplich.preview.label')"
    :labels="labels"
    name="livepreview"
    :aspect-ratio="aspectRatio"
    :device-preview="devicePreview"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </FieldBody>
</template>

<style>
/* The Panel always shows the frame, empty until the first render. A Mock
   that stages the header alone would carry an empty frame of the minimum
   height below it. */
.panel-mock .k-field-type-preview [data-theme="passive"]:empty {
  display: none;
}
</style>
