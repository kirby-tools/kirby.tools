<script setup lang="ts">
withDefaults(
  defineProps<{
    data?: Record<string, unknown>;
    disabled?: boolean;
    element?: string;
    group?: string;
    handle?: string | boolean;
    list?: unknown[];
    move?: (...args: unknown[]) => unknown;
    options?: Record<string, unknown>;
  }>(),
  { element: "div" },
);
</script>

<template>
  <component :is="element">
    <slot />
    <slot v-if="$slots.footer" name="footer" />
  </component>
</template>
