<script setup lang="ts">
import type { PanelCopilotButtonProps } from "../../../shared/types/plugins";

const props = withDefaults(defineProps<PanelCopilotButtonProps>(), {
  label: "Copilot",
  icon: "sparkling",
  theme: "notice-icon",
});

const isHovering = ref(false);

const isAbortable = computed(() => isHovering.value && props.isGenerating);
</script>

<template>
  <!-- `k-button` passes no listeners but `click` on to its element. -->
  <div @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <k-button
      :text="label"
      :icon="isAbortable ? 'cancel' : isGenerating ? 'loader' : icon"
      :theme="isAbortable ? 'notice' : theme"
      variant="filled"
      size="sm"
      responsive
      @click="isAbortable ? abort?.() : !isGenerating && click?.()"
    />
  </div>
</template>
