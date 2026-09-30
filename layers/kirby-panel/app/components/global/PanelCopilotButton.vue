<script setup lang="ts">
const props = defineProps<{
  label: string;
  icon: string;
  theme: string;
  /** A run in progress, which the plugin keeps in its own state. */
  isGenerating?: boolean;
  /** Opens the prompt dialog, which the plugin opens itself. */
  click: () => void;
  /** Stops the answer in progress, which the plugin aborts itself. */
  abort: () => void;
}>();

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
      @click="isAbortable ? abort() : !isGenerating && click()"
    />
  </div>
</template>
