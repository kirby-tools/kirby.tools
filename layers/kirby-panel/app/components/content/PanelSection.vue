<script setup lang="ts">
defineProps<{ label?: string }>();
</script>

<template>
  <k-section :label="label">
    <slot />
  </k-section>
</template>
