<script setup lang="ts">
const props = defineProps<{ value: number }>();

const SIZE = 64;
const STROKE_WIDTH = 4;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const dashOffset = computed(() => CIRCUMFERENCE * (1 - props.value / 100));
</script>

<template>
  <svg
    :width="SIZE"
    :height="SIZE"
    role="progressbar"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
    class="panel-content-translator-ring [transform:rotate(-90deg)]"
  >
    <circle
      class="panel-content-translator-ring-track"
      :cx="SIZE / 2"
      :cy="SIZE / 2"
      :r="RADIUS"
      fill="none"
      :stroke-width="STROKE_WIDTH"
    />
    <circle
      class="panel-content-translator-ring-fill"
      :cx="SIZE / 2"
      :cy="SIZE / 2"
      :r="RADIUS"
      fill="none"
      :stroke-width="STROKE_WIDTH"
      stroke-linecap="round"
      :stroke-dasharray="CIRCUMFERENCE"
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
