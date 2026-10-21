<script setup lang="ts">
const props = defineProps<{
  page: ExhibitionPage;
  viewButton?: PanelViewButton;
  notification?: PanelNotificationProps;
  crop?: "hero";
  cursor?: MockCursor;
}>();

const emit = defineEmits<{
  cancel: [];
  discard: [];
  save: [];
  closeNotification: [];
}>();

const { languageCode, content, diff, hasDiff, update, save, discard } =
  props.page;
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
    @cancel="emit('cancel')"
  >
    <PanelViewHeader
      :title="content.title"
      :buttons="viewButtons"
      :has-diff="hasDiff"
      @discard="
        discard();
        emit('discard');
      "
      @save="
        save();
        emit('save');
      "
    />

    <PanelModelForm>
      <k-column width="2/3">
        <PanelFieldset>
          <k-column v-if="$slots.main">
            <slot name="main" />
          </k-column>

          <PanelBlocksField
            :key="languageCode"
            name="text"
            label="Text"
            :has-diff="'text' in diff"
            :value="content.text"
            @input="update({ text: $event })"
          />
        </PanelFieldset>
      </k-column>

      <k-column width="1/3">
        <PanelFieldset>
          <k-column v-if="$slots.aside">
            <slot name="aside" />
          </k-column>

          <PanelField
            :key="`description-${languageCode}`"
            label="Description"
            name="description"
            type="textarea"
            :has-diff="'description' in diff"
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
            :has-diff="'dates' in diff"
          >
            <PanelInput
              :value="content.dates"
              @input="update({ dates: $event })"
            />
          </PanelField>
        </PanelFieldset>
      </k-column>
    </PanelModelForm>

    <PanelNotification
      v-if="notification"
      v-bind="notification"
      @click="emit('closeNotification')"
    />

    <ExhibitionCursor v-if="cursor" v-bind="cursor" />

    <template v-if="$slots.sidebar" #sidebar>
      <slot name="sidebar" />
    </template>

    <template v-if="$slots.dialog" #dialog>
      <slot name="dialog" />
    </template>
  </PanelMock>
</template>
