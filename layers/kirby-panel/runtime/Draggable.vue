<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{ element?: string }>(), { element: "div" });
</script>

<template>
  <component :is="element">
    <slot />
  </component>
</template>
