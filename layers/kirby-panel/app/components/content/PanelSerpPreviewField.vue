<script setup lang="ts">
import { SerpPreview } from "#kirby-plugin/serp-preview";
import { translate } from "#panel-mock/translate";

const props = defineProps<{
  /** The title of the page the field sits on, which the plugin falls back to. */
  viewTitle?: string;
  /** The form values `titleContentKey` and `descriptionContentKey` name. */
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
  <!-- What the PHP field sends as `label`, `name` and `title-separator` for a bare `type: serp-preview` field keyed `serpPreview`. -->
  <SerpPreview
    :label="translate('johannschopplich.serp-preview.label')"
    name="serppreview"
    title-separator="–"
    :site-url="siteUrl"
    :preview-path="previewPath"
  />
</template>
