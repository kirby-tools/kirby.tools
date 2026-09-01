<script setup lang="ts">
defineProps<{
  /** The blueprint `width`, a fraction such as `2/3`. */
  width?: string;
}>();
</script>

<template>
  <k-column :width="width">
    <slot />
  </k-column>
</template>
