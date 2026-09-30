<script setup lang="ts">
const props = defineProps<{
  page: ExhibitionPage;
  viewButton?: PanelViewButton;
  crop?: "hero" | "showcase";
}>();

// A phone keeps the height the Content Translator dialog needs for its buttons.
const CROP_CLASSES: Record<NonNullable<typeof props.crop>, string> = {
  hero: "[&_.panel-mock-stage]:h-120",
  showcase: "[&_.panel-mock-stage]:h-120 sm:[&_.panel-mock-stage]:h-112",
};

const { languageCode, content, hasDiff, update } = props.page;
const isInert = inject(panelMockInertKey, false);

const viewButtons = computed<PanelViewButton[]>(() => {
  // The languages button earns its place only where the reader can click it.
  const kirbyButtons = isInert
    ? kirbyViewButtons()
    : kirbyViewButtons(languageCode.value, (code) => {
        languageCode.value = code;
      });

  return props.viewButton ? [props.viewButton, ...kirbyButtons] : kirbyButtons;
});
</script>

<template>
  <PanelMock
    :class="crop && [CROP_CLASSES[crop], '[&_.panel-mock-stage]:overflow-clip']"
  >
    <PanelViewHeader
      :title="content.title"
      :buttons="viewButtons"
      :has-diff="hasDiff"
    />

    <PanelColumns>
      <PanelColumn width="2/3">
        <slot name="main" />

        <PanelSection :key="languageCode">
          <PanelFieldset>
            <PanelBlocksField
              name="text"
              label="Text"
              :value="content.text"
              @input="update({ text: $event })"
            />
          </PanelFieldset>
        </PanelSection>
      </PanelColumn>

      <PanelColumn width="1/3">
        <slot name="aside" />

        <PanelSection :key="languageCode">
          <PanelFieldset>
            <PanelField label="Description" name="description">
              <PanelInput
                :value="content.description"
                :buttons="EXHIBITION_DESCRIPTION_BUTTONS"
                @input="update({ description: $event })"
              />
            </PanelField>

            <PanelField label="Dates" name="dates" type="text">
              <PanelInput
                :value="content.dates"
                @input="update({ dates: $event })"
              />
            </PanelField>
          </PanelFieldset>
        </PanelSection>
      </PanelColumn>
    </PanelColumns>

    <slot name="notification" />

    <template v-if="$slots.sidebar" #sidebar>
      <slot name="sidebar" />
    </template>

    <template v-if="$slots.dialog" #dialog>
      <slot name="dialog" />
    </template>
  </PanelMock>
</template>
