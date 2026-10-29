<script setup lang="ts">
import {
  createBatchTranslationDialogFields,
  createBatchTranslationHelp,
  createStrategyField,
  createTranslationDialogFields,
  createTranslationSubmitButton,
} from "#kirby-plugin/content-translator";
import { translate } from "#panel-mock/translate";

const props = withDefaults(
  defineProps<{
    /** The batch dialog, which asks for the languages too. */
    batch?: boolean;
    /** The site's languages, the default language first. */
    languages?: readonly { code: string; name: string }[];
    /** Whether both DeepL and Copilot are set up, so the editor picks one. */
    hasStrategyChoice?: boolean;
    strategyName?: "deepl" | "ai";
    /** The models the `cascade` option translates along, e.g. "4 pages". */
    cascadeModels?: string;
    autofocus?: boolean;
  }>(),
  {
    languages: () => [
      { code: "en", name: "English" },
      { code: "de", name: "Deutsch" },
      { code: "es", name: "Español" },
      { code: "fr", name: "Français" },
    ],
    hasStrategyChoice: true,
    strategyName: "ai",
  },
);

const emit = defineEmits<{
  cancel: [];
  submit: [value: { languages?: string[]; strategyName?: string }];
}>();

const SUBMIT_BUTTON = createTranslationSubmitButton({ t: translate });

const defaultLanguage = computed(() => props.languages[0]!);
const secondaryLanguages = computed(() => props.languages.slice(1));
// ChatGPT, for a site whose Copilot is set up with OpenAI.
const strategyField = computed(() =>
  props.hasStrategyChoice
    ? createStrategyField({
        isCustomStrategy: false,
        aiProvider: "openai",
        t: translate,
      })
    : undefined,
);
const cascadeHelp = computed(() =>
  props.cascadeModels
    ? translate("johannschopplich.content-translator.dialog.cascadeHelp", {
        models: props.cascadeModels,
      })
    : undefined,
);

const fields = computed(() =>
  props.batch
    ? createBatchTranslationDialogFields({
        help: createBatchTranslationHelp({
          defaultLanguage: defaultLanguage.value,
          cascadeHelp: cascadeHelp.value,
          t: translate,
        }),
        strategyField: strategyField.value,
        translationLanguages: secondaryLanguages.value,
        t: translate,
      })
    : createTranslationDialogFields({
        help: cascadeHelp.value,
        strategyField: strategyField.value,
      }),
);

const value = computed(() => ({
  ...(props.batch && {
    languages: secondaryLanguages.value.map(({ code }) => code),
  }),
  ...(props.hasStrategyChoice && { strategyName: props.strategyName }),
}));
</script>

<template>
  <PanelDialog
    :submit-button="SUBMIT_BUTTON"
    :fields="fields"
    :value="value"
    :autofocus="autofocus"
    @cancel="emit('cancel')"
    @submit="emit('submit', $event)"
  />
</template>
