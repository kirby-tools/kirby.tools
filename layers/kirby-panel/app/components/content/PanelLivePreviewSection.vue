<script setup lang="ts">
import { translate } from "#panel-mock/translate";

const props = withDefaults(
  defineProps<{
    label?: string;
    aspectRatio?: string;
    /**
     * Device preview selected at first, which the plugin holds in its own
     * state.
     */
    devicePreview?: Device;
  }>(),
  { label: "Live Preview" },
);

const DEVICE_VIEWPORT_PRESETS = {
  mobile: { width: 390, icon: "mobile", title: "Mobile" },
  tablet: { width: 768, icon: "tablet", title: "Tablet" },
  desktop: { width: 1440, icon: "display", title: "Desktop" },
};

type Device = keyof typeof DEVICE_VIEWPORT_PRESETS;

const devicePreview = ref(props.devicePreview);
const container = useTemplateRef("container");
const { width: containerWidth, height: containerHeight } =
  useElementSize(container);

const deviceWidth = computed(
  () =>
    devicePreview.value && DEVICE_VIEWPORT_PRESETS[devicePreview.value].width,
);

const isInsetDevicePreview = computed(
  () => !!deviceWidth.value && deviceWidth.value < containerWidth.value,
);

const previewStyles = computed(() => {
  if (!deviceWidth.value) return;
  const scale = containerWidth.value / deviceWidth.value;

  return {
    width: `${deviceWidth.value}px`,
    height: scale < 1 ? `${containerHeight.value / scale}px` : "100%",
    transform: scale < 1 ? `scale(${scale})` : "none",
    transformOrigin: "top center",
    position: "absolute" as const,
    top: 0,
    left: "50%",
    marginLeft: `${-deviceWidth.value / 2}px`,
  };
});

function setDevicePreview(device: Device) {
  devicePreview.value = device === devicePreview.value ? undefined : device;
}
</script>

<template>
  <k-section :label="label" class="panel-live-preview-section">
    <template #options>
      <div class="flex items-center gap-[var(--spacing-2)]">
        <k-button-group layout="collapsed">
          <k-button
            v-for="(preset, device) in DEVICE_VIEWPORT_PRESETS"
            :key="device"
            variant="filled"
            :theme="devicePreview === device ? 'blue' : undefined"
            size="xs"
            :title="preset.title"
            :icon="preset.icon"
            class="px-[calc(var(--input-padding)*2)]"
            @click="setDevicePreview(device)"
          />
        </k-button-group>

        <k-button
          variant="filled"
          size="xs"
          icon="open"
          :title="translate('open')"
        />
        <k-button variant="filled" size="xs" icon="live-preview-restart" />
      </div>
    </template>

    <div
      v-if="$slots.default"
      ref="container"
      class="grid rounded-[var(--input-rounded)]"
      :class="[
        !isInsetDevicePreview && '[box-shadow:var(--shadow-md)]',
        devicePreview && 'relative overflow-visible',
      ]"
      :style="{ aspectRatio }"
      data-theme="passive"
    >
      <div
        class="overflow-y-auto rounded-[var(--input-rounded)] bg-[var(--input-color-back)]"
        :class="isInsetDevicePreview && '[box-shadow:var(--shadow-md)]'"
        :style="previewStyles"
      >
        <slot />
      </div>
    </div>
  </k-section>
</template>
