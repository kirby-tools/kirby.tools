<script setup lang="ts">
import type { ExhibitionProductId } from "#shared/exhibition";

const props = defineProps<{
  productId: ExhibitionProductId;
}>();

const hasDialog = computed(() =>
  SCENE_DIALOG_PRODUCT_IDS.includes(props.productId),
);

const viewButtons = computed<PanelViewButton[]>(() => {
  const pluginButton = PLUGIN_VIEW_BUTTONS[props.productId];
  return pluginButton
    ? [pluginButton, ...KIRBY_VIEW_BUTTONS]
    : KIRBY_VIEW_BUTTONS;
});
</script>

<template>
  <PanelMock>
    <PanelViewHeader :title="EXHIBITION_PAGE.title" :buttons="viewButtons" />

    <PanelColumns>
      <PanelColumn width="2/3">
        <PanelSection
          v-if="productId === 'serp-preview'"
          label="SERP Preview"
        >
          <PanelSerpPreviewSnippet
            :favicon-url="EXHIBITION_SITE.faviconUrl"
            :site-title="EXHIBITION_SITE.title"
            :site-url="EXHIBITION_SITE.url"
            :title="`${EXHIBITION_PAGE.title} – ${EXHIBITION_SITE.title}`"
            :description="EXHIBITION_PAGE.description"
          />
        </PanelSection>

        <PanelSection>
          <PanelFieldset>
            <PanelField label="Text" name="text" type="writer">
              <PanelInput :value="EXHIBITION_PAGE.text" />
            </PanelField>
          </PanelFieldset>
        </PanelSection>
      </PanelColumn>

      <!-- A phone crops the stage to the dialog, so a second column would
           only lengthen what the crop hides. -->
      <PanelColumn width="1/3" class="max-sm:hidden">
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

    <template v-if="hasDialog" #dialog>
      <PanelCopilotPromptDialog
        v-if="productId === 'copilot'"
        :files="1"
        :fields="COPILOT_FIELDS_DROPDOWN.value.length"
        :prompt="COPILOT_PROMPT"
        :preview="COPILOT_PROMPT_PREVIEW"
        :dropdown="COPILOT_FIELDS_DROPDOWN"
      />

      <PanelDialog
        v-else-if="productId === 'content-translator'"
        size="medium"
        :fields="TRANSLATOR_DIALOG_FIELDS"
        :value="TRANSLATOR_DIALOG_VALUE"
        :buttons="TRANSLATOR_DIALOG_BUTTONS"
      />

      <PanelDialog v-else-if="productId === 'seo-audit'" size="large">
        <PanelSeoAuditResult
          title="SEO & Readability Scores"
          :report="SEO_REPORT"
        />
      </PanelDialog>
    </template>
  </PanelMock>
</template>
