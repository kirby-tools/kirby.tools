<script setup lang="ts">
import type { ProductColorSlot, ProductId } from "#shared/constants";
import { PRODUCTS } from "#shared/constants";

// #region Showcase
const SHOWCASE_PRODUCT_IDS = [
  "copilot",
  "content-translator",
  "seo-audit",
] as const satisfies readonly ProductId[];

type ShowcaseProductId = (typeof SHOWCASE_PRODUCT_IDS)[number];

const COLOR_CLASSES: Record<
  ProductColorSlot | "primary",
  { chipClass: string; accentClass: string }
> = {
  copilot: {
    chipClass: "bg-copilot/10 text-copilot",
    accentClass: "bg-copilot",
  },
  seo: { chipClass: "bg-seo/10 text-seo", accentClass: "bg-seo" },
  primary: {
    chipClass: "bg-primary/10 text-primary",
    accentClass: "bg-primary",
  },
};

const colorClassesOf = (id: ShowcaseProductId) =>
  COLOR_CLASSES[PRODUCTS[id].colorSlot ?? "primary"];

const SHOWCASE_TABS = SHOWCASE_PRODUCT_IDS.map((id) => ({
  value: id,
  label: PRODUCTS[id].name,
  description: PRODUCTS[id].description,
  icon: PRODUCTS[id].icon,
  ...colorClassesOf(id),
}));

// Each plugin's view button, as its blueprint documentation defines it.
const PLUGIN_VIEW_BUTTONS: Record<ShowcaseProductId, PanelViewButtonProps> = {
  copilot: {
    text: "Copilot",
    icon: "sparkling",
    theme: "notice-icon",
    responsive: true,
  },
  "content-translator": {
    text: "Translator",
    icon: "content-translator-global",
    theme: "notice-icon",
    responsive: true,
  },
  "seo-audit": {
    text: "SEO Audit",
    icon: "seo-audit-analyze",
    theme: "positive",
    responsive: true,
  },
};

// The buttons Kirby puts on every page view, which the plugin's button joins.
const KIRBY_VIEW_BUTTONS: PanelViewButton[] = [
  { icon: "window" },
  { icon: "cog", dropdown: true },
  { text: "Unlisted", icon: "status-unlisted", theme: "info-icon" },
];
// #endregion

// #region Fixtures
const EXHIBITION_PAGE = {
  title: "Anna Vogel: Rooms of Silence",
  text: [
    "Anna Vogel photographs rooms after everyone has left them: a school gym on the first morning of the holidays, a ferry terminal at four in the morning, the back office of a shop that closed last spring.",
    "The twenty-eight prints in this exhibition were made over six winters in northern Germany and on the Faroe Islands. Vogel works with a large-format camera and available light, which means exposures long enough for the dust to settle inside the frame.",
    "Rooms of Silence is her first solo exhibition in Kassel. A conversation with the artist takes place on 14 November at 7 pm, admission free.",
  ].join("\n\n"),
  description:
    "Twenty-eight large-format photographs of rooms just after the people have gone. Kassel, 12 September to 30 November.",
  dates: "12 September – 30 November",
};

const COPILOT_PROMPT = `Write the teaser for "{title}" in our house voice, max 60 words.

Use the attached press photo and the artist's page: @page://artists/anna-vogel`;

const COPILOT_PROMPT_PREVIEW = COPILOT_PROMPT.replace(
  "{title}",
  EXHIBITION_PAGE.title,
);

const TRANSLATOR_FIELDS = {
  languages: {
    type: "checkboxes",
    label: "Translate to",
    options: [
      { value: "de", text: "Deutsch" },
      { value: "es", text: "Español" },
      { value: "fr", text: "Français" },
    ],
  },
  provider: {
    type: "toggles",
    label: "Translate with",
    labels: true,
    grow: true,
    options: [
      { value: "deepl", text: "DeepL", icon: "translate" },
      { value: "ai", text: "GPT (OpenAI)", icon: "content-translator-openai" },
    ],
  },
};

const TRANSLATOR_VALUE = { languages: ["de", "es", "fr"], provider: "ai" };

const TRANSLATOR_BUTTONS = [
  { icon: "cancel", text: "Cancel" },
  { icon: "translate", text: "Translate", theme: "positive" },
];

const SEO_REPORT: PanelAuditResultEntry[] = [
  {
    rating: "good",
    text: '<a href="https://yoa.st/34h">SEO title width</a>: Good job.',
  },
  {
    rating: "good",
    text: '<a href="https://yoa.st/35d">Paragraph length</a>: There are no paragraphs that are too long. Great job.',
  },
  {
    rating: "ok",
    text: '<a href="https://yoa.st/34d">Meta description length</a>: The meta description is too short (under 120 characters). Up to 156 characters are available. <a href="https://yoa.st/34e">Use the space</a>.',
  },
  {
    rating: "bad",
    text: '<a href="https://yoa.st/34f">Outbound links</a>: No outbound links appear in this page. <a href="https://yoa.st/34g">Add some</a>!',
  },
];
// #endregion

const activeProductId = ref<ShowcaseProductId>("copilot");

const accentClass = computed(
  () => colorClassesOf(activeProductId.value).accentClass,
);

const viewButtons = computed(() => [
  PLUGIN_VIEW_BUTTONS[activeProductId.value],
  ...KIRBY_VIEW_BUTTONS,
]);
</script>

<template>
  <div>
    <UTabs
      v-model="activeProductId"
      :items="SHOWCASE_TABS"
      :content="false"
      variant="link"
      :ui="{
        list: 'gap-2 mb-0 -mt-px border-t border-b-0',
        indicator: `bottom-auto -top-px h-px w-8 translate-x-[calc(var(--reka-tabs-indicator-position)+var(--reka-tabs-indicator-size)/2-calc(var(--spacing)*4))] ${accentClass}`,
        trigger: 'flex-1 cursor-pointer flex-col gap-2 px-4 py-6',
        label: 'block w-full whitespace-normal',
      }"
    >
      <template #leading="{ item }">
        <!-- What the indicator's `w-8` is measured against. -->
        <span
          class="flex size-8 items-center justify-center rounded-md transition-colors"
          :class="
            activeProductId === item.value
              ? item.chipClass
              : 'bg-elevated text-dimmed'
          "
        >
          <UIcon :name="item.icon" class="size-5 shrink-0" />
        </span>
      </template>

      <template #default="{ item }">
        <span class="text-highlighted block text-sm font-semibold text-pretty">
          {{ item.label }}
        </span>
        <span class="text-muted mt-1 hidden text-sm text-pretty sm:block">
          {{ item.description }}
        </span>
      </template>
    </UTabs>

    <div class="relative">
      <div
        aria-hidden="true"
        class="absolute -inset-4 -z-10 hidden rounded-sm opacity-25 blur-3xl transition-colors duration-500 dark:block"
        :class="accentClass"
      />

      <PanelPreview
        class="my-0! rounded-sm shadow-2xl shadow-black/10 dark:shadow-black/60 [&_.panel-preview-stage]:min-h-104"
      >
        <div>
          <PanelViewHeader
            :title="EXHIBITION_PAGE.title"
            :buttons="viewButtons"
          />

          <PanelColumns>
            <PanelColumn width="2/3">
              <PanelSection>
                <PanelFieldset>
                  <PanelField label="Text" name="text" type="writer">
                    <PanelInput :value="EXHIBITION_PAGE.text" />
                  </PanelField>
                </PanelFieldset>
              </PanelSection>
            </PanelColumn>

            <PanelColumn width="1/3">
              <PanelSection>
                <PanelFieldset>
                  <PanelField label="Description" name="description">
                    <PanelInput :value="EXHIBITION_PAGE.description" buttons />
                  </PanelField>

                  <PanelField label="Dates" name="dates" type="text">
                    <PanelInput :value="EXHIBITION_PAGE.dates" />
                  </PanelField>
                </PanelFieldset>
              </PanelSection>
            </PanelColumn>
          </PanelColumns>
        </div>

        <PanelDialogPortal>
          <PanelPromptDialog
            v-if="activeProductId === 'copilot'"
            :files="1"
            :prompt="COPILOT_PROMPT"
            :preview="COPILOT_PROMPT_PREVIEW"
          />

          <PanelDialog
            v-else-if="activeProductId === 'content-translator'"
            size="medium"
            :fields="TRANSLATOR_FIELDS"
            :value="TRANSLATOR_VALUE"
            :buttons="TRANSLATOR_BUTTONS"
          />

          <PanelDialog v-else size="large">
            <PanelAuditResult
              title="SEO & Readability Scores"
              :report="SEO_REPORT"
            />
          </PanelDialog>
        </PanelDialogPortal>
      </PanelPreview>
    </div>
  </div>
</template>
