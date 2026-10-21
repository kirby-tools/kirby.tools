<script setup lang="ts">
const props = defineProps<{
  page: ExhibitionPage;
  viewButton?: PanelViewButton;
  crop?: "hero";
  cursor?: MockCursor;
}>();

const emit = defineEmits<{ discard: []; save: [] }>();

const { languageCode, content, hasDiff, update } = props.page;
const isInert = inject(panelMockInertKey, false);
// A host that frames the Scene sets its height, which crops the Stage too.
const isFramed = inject(panelMockFramedKey, false);

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
    :class="[
      crop === 'hero' && '[&_.panel-mock-stage]:h-120',
      (crop || isFramed) && '[&_.panel-mock-stage]:overflow-clip',
    ]"
  >
    <PanelViewHeader
      :title="content.title"
      :buttons="viewButtons"
      :has-diff="hasDiff"
      @discard="emit('discard')"
      @save="emit('save')"
    />

    <PanelModelForm>
      <PanelColumn width="2/3">
        <PanelFieldset>
          <PanelColumn v-if="$slots.main">
            <slot name="main" />
          </PanelColumn>

          <PanelBlocksField
            :key="languageCode"
            name="text"
            label="Text"
            :value="content.text"
            @input="update({ text: $event })"
          />
        </PanelFieldset>
      </PanelColumn>

      <PanelColumn width="1/3">
        <PanelFieldset>
          <PanelColumn v-if="$slots.aside">
            <slot name="aside" />
          </PanelColumn>

          <PanelField
            :key="`description-${languageCode}`"
            label="Description"
            name="description"
          >
            <PanelInput
              :value="content.description"
              :buttons="EXHIBITION_DESCRIPTION_BUTTONS"
              @input="update({ description: $event })"
            />
          </PanelField>

          <PanelField
            :key="`dates-${languageCode}`"
            label="Dates"
            name="dates"
            type="text"
          >
            <PanelInput
              :value="content.dates"
              @input="update({ dates: $event })"
            />
          </PanelField>
        </PanelFieldset>
      </PanelColumn>
    </PanelModelForm>

    <slot name="notification" />

    <ExhibitionCursor v-if="cursor" v-bind="cursor" />

    <template v-if="$slots.sidebar" #sidebar>
      <slot name="sidebar" />
    </template>

    <template v-if="$slots.dialog" #dialog>
      <slot name="dialog" />
    </template>
  </PanelMock>
</template>
