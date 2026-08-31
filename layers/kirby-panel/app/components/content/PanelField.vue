<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <k-field :label="label">
    <slot />
  </k-field>
</template>
