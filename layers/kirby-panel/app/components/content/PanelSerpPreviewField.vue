<script setup lang="ts">
import { Field } from "#kirby-plugin/serp-preview";
import { translate } from "#panel-mock/translate";

const props = defineProps<{
  viewTitle?: string;
  content?: object;
  siteUrl: string;
  previewPath: string;
}>();

providePanelPage({
  title: () => props.viewTitle ?? "",
  content: () => props.content ?? {},
});
</script>

<template>
  <!-- The PHP field's defaults for a field keyed `serpPreview`. -->
  <Field
    :label="translate('johannschopplich.serp-preview.label')"
    name="serppreview"
    title-separator="–"
    :site-url="siteUrl"
    :preview-path="previewPath"
  />
</template>
