<script setup lang="ts">
defineProps<{
  theme?: string;
  text?: string;
}>();
</script>

<template>
  <k-box :theme="theme" :text="text">
    <slot />
  </k-box>
</template>
