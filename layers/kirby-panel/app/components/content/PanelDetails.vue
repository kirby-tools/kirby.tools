<script setup lang="ts">
defineProps<{
  summary?: string;
  open?: boolean;
}>();
</script>

<template>
  <details :open="open">
    <summary>{{ summary }}</summary>
    <!-- Kirby styles no `details` of its own, so the disclosure stays at the
         browser default and only its body carries the plugin's rhythm. -->
    <div class="mt-(--spacing-3) space-y-(--spacing-2)">
      <slot />
    </div>
  </details>
</template>
