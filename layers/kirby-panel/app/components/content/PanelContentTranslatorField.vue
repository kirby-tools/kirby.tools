<script setup lang="ts">
import type { PanelContentTranslatorOptions } from "../../types/plugins";
import {
  TranslatorButtons,
  TranslatorField,
} from "#kirby-plugin/content-translator";
import { translate } from "#panel-mock/translate";

const props = withDefaults(
  defineProps<
    PanelContentTranslatorOptions & {
      label?: string;
      isTranslating?: boolean;
    }
  >(),
  { import: true, batch: true },
);

const resolution = useTranslatorActions(props);
</script>

<template>
  <!-- The PHP field's defaults for a field keyed `contentTranslator`. -->
  <TranslatorField
    :label="label || translate('johannschopplich.content-translator.label')"
    name="contenttranslator"
  >
    <TranslatorButtons
      :actions="resolution.groups"
      :is-translating="isTranslating"
      :info="
        resolution.hasDefaultLanguageInfo
          ? translate(
              'johannschopplich.content-translator.help.defaultLanguageInfo',
            )
          : undefined
      "
    />
  </TranslatorField>
</template>
