<script setup lang="ts">
defineProps<{
  buttons?: Record<string, unknown>[];
  layout?: string;
  variant?: string;
  theme?: string;
  size?: string;
}>();
</script>

<template>
  <k-button-group v-bind="{ buttons, layout, variant, theme, size }" />
</template>
