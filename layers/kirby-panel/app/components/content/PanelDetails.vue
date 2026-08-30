<script setup lang="ts">
defineProps<{
  summary?: string;
  open?: boolean;
}>();
</script>

<template>
  <details :open="open">
    <summary>{{ summary }}</summary>
    <div class="panel-details-body">
      <slot />
    </div>
  </details>
</template>

<style>
/* Kirby styles no `details` of its own, so the disclosure itself stays at the
   browser default and only its body carries the plugin's own rhythm. */
.panel-details-body {
  margin-top: var(--spacing-3);
}

.panel-details-body > * + * {
  margin-top: var(--spacing-2);
}
</style>
