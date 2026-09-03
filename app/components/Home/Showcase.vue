<script setup lang="ts">
import type { ProductId } from "#shared/constants";
import { PRODUCTS } from "#shared/constants";

// #region Showcase
const SHOWCASE_PRODUCT_IDS = [
  "copilot",
  "content-translator",
  "seo-audit",
] as const satisfies readonly ProductId[];

type ShowcaseProductId = (typeof SHOWCASE_PRODUCT_IDS)[number];

const COLOR_CLASSES: Record<
  ShowcaseProductId,
  { chipClass: string; accentClass: string }
> = {
  copilot: {
    chipClass: "bg-copilot/10 text-copilot",
    accentClass: "bg-copilot",
  },
  "content-translator": {
    chipClass: "bg-content-translator/10 text-content-translator",
    accentClass: "bg-content-translator",
  },
  "seo-audit": {
    chipClass: "bg-seo-audit/10 text-seo-audit",
    accentClass: "bg-seo-audit",
  },
};

const SHOWCASE_TABS = SHOWCASE_PRODUCT_IDS.map((id) => ({
  value: id,
  label: PRODUCTS[id].name,
  description: PRODUCTS[id].description,
  icon: PRODUCTS[id].icon,
  ...COLOR_CLASSES[id],
}));
// #endregion

// #region Fixtures
const COPILOT_PROMPT = `Write the teaser for "{title}" in our house voice, max 60 words.

Use the attached press photo and the artist's page: @page://artists/anna-vogel`;

const COPILOT_PROMPT_PREVIEW = COPILOT_PROMPT.replace(
  "{title}",
  EXHIBITION_PAGE.title,
);

const SEO_REPORT: PanelSeoAuditResultEntry[] = [
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
  () => COLOR_CLASSES[activeProductId.value].accentClass,
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
        trigger: 'flex-1 cursor-pointer flex-col gap-2 px-4 py-6 after:hidden',
        label: 'block w-full whitespace-normal',
      }"
    >
      <template #leading="{ item }">
        <!-- Holds the indicator's spot until Reka mounts it on the client. -->
        <span
          aria-hidden="true"
          class="absolute -top-[calc(var(--spacing)+1px)] left-1/2 hidden h-px w-8 -translate-x-1/2 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:group-data-[state=active]:block"
          :class="item.accentClass"
        />

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

      <PanelMock
        class="my-0! rounded-sm shadow-2xl shadow-black/10 dark:shadow-black/60 [&_.panel-mock-stage]:min-h-104 max-sm:[&_.panel-mock-stage]:h-104 max-sm:[&_.panel-mock-stage]:overflow-hidden"
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
          <PanelCopilotPromptDialog
            v-if="activeProductId === 'copilot'"
            :files="1"
            :prompt="COPILOT_PROMPT"
            :preview="COPILOT_PROMPT_PREVIEW"
          />

          <PanelDialog
            v-else-if="activeProductId === 'content-translator'"
            size="medium"
            :fields="TRANSLATOR_DIALOG_FIELDS"
            :value="TRANSLATOR_DIALOG_VALUE"
            :buttons="TRANSLATOR_DIALOG_BUTTONS"
          />

          <PanelDialog v-else size="large">
            <PanelSeoAuditResult
              title="SEO & Readability Scores"
              :report="SEO_REPORT"
            />
          </PanelDialog>
        </PanelDialogPortal>
      </PanelMock>
    </div>
  </div>
</template>
