<script setup lang="ts">
defineProps<{
  width?: string;
}>();
</script>

<template>
  <k-column :width="width">
    <slot />
  </k-column>
</template>
