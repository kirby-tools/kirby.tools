<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number;
    size?: number;
    strokeWidth?: number;
  }>(),
  { size: 64, strokeWidth: 4 },
);

const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(
  () => circumference.value * (1 - props.value / 100),
);
const center = computed(() => props.size / 2);
</script>

<template>
  <svg
    :width="size"
    :height="size"
    role="progressbar"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
    class="panel-content-translator-ring -rotate-90"
  >
    <circle
      class="panel-content-translator-ring-track"
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke-width="strokeWidth"
    />
    <circle
      class="panel-content-translator-ring-fill"
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
    />
  </svg>
</template>

<style>
.panel-mock .panel-content-translator-ring-track {
  stroke: light-dark(var(--color-gray-300), var(--color-gray-700));
}

.panel-mock .panel-content-translator-ring-fill {
  stroke: var(--theme-color-icon);
}
</style>
