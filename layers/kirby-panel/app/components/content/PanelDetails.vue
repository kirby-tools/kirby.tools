<script setup lang="ts">
defineProps<{
  summary?: string;
  open?: boolean;
}>();
</script>

<template>
  <details :open="open">
    <summary>{{ summary }}</summary>
    <div class="mt-(--spacing-3) [&>*+*]:mt-[var(--spacing-2)]">
      <slot />
    </div>
  </details>
</template>
