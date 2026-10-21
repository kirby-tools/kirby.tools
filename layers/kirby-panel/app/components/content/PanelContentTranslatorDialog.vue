<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** The batch dialog, which asks for the languages too. */
    batch?: boolean;
    /** The site's languages, the default language first. */
    languages?: readonly { code: string; name: string }[];
    /** Whether both DeepL and Copilot are set up, so the editor picks one. */
    strategies?: boolean;
    strategyName?: "deepl" | "ai";
    /** The models the `cascade` option translates along, e.g. "4 pages". */
    cascade?: string;
    autofocus?: boolean;
  }>(),
  {
    languages: () => [
      { code: "en", name: "English" },
      { code: "de", name: "Deutsch" },
      { code: "es", name: "Español" },
      { code: "fr", name: "Français" },
    ],
    strategies: true,
    strategyName: "ai",
  },
);

const emit = defineEmits<{
  cancel: [];
  submit: [value: { languages?: string[]; strategyName?: string }];
}>();

const SUBMIT_BUTTON = { icon: "translate", text: "Translate" };

const STRATEGY_FIELD = {
  type: "toggles",
  label: "Translate with",
  labels: true,
  grow: true,
  options: [
    { value: "deepl", text: "DeepL", icon: "translate" },
    { value: "ai", text: "ChatGPT", icon: "content-translator-openai" },
  ],
};

const defaultLanguage = computed(() => props.languages[0]!);
const secondaryLanguages = computed(() => props.languages.slice(1));
const cascadeHelp = computed(
  () =>
    props.cascade &&
    `${props.cascade} will also be translated and saved directly.`,
);

const fields = computed(() => ({
  ...(props.batch
    ? {
        languages: {
          type: "checkboxes",
          label: "Translate to",
          options: secondaryLanguages.value.map(({ code, name }) => ({
            value: code,
            text: name,
          })),
          help: [
            `Content from ${defaultLanguage.value.name} will be translated and saved to all selected languages. This may take a few seconds.`,
            cascadeHelp.value,
          ]
            .filter(Boolean)
            .join(" "),
        },
      }
    : cascadeHelp.value && { help: { type: "info", text: cascadeHelp.value } }),
  ...(props.strategies && { strategyName: STRATEGY_FIELD }),
}));

const value = computed(() => ({
  ...(props.batch && {
    languages: secondaryLanguages.value.map(({ code }) => code),
  }),
  ...(props.strategies && { strategyName: props.strategyName }),
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
