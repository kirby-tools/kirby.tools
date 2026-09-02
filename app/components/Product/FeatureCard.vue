<script setup lang="ts">
defineProps<{
  name: string;
  title: string;
  description: string;
  to?: string;
  target?: string;
  wide?: boolean;
}>();
</script>

<template>
  <UPageCard
    variant="subtle"
    reverse
    :title="title"
    :description="description"
    :to="to"
    :target="target"
    class="product-feature-card"
    :class="wide && 'sm:col-span-2'"
    :ui="{
      root: 'bg-muted overflow-hidden',
      container: 'gap-0 p-0 sm:p-0',
      wrapper: 'border-accented border-t p-4 sm:p-6',
    }"
  >
    <template #leading>
      <p class="text-muted text-sm">{{ name }}</p>
    </template>

    <div
      class="relative overflow-hidden"
      :class="wide ? 'min-h-96' : 'min-h-72'"
    >
      <div class="absolute inset-0">
        <slot />
      </div>
    </div>
  </UPageCard>
</template>

<style>
/* The card is the figure's frame: the preview fills it and drops its own. */
.product-feature-card .panel-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  border: 0;
  border-radius: 0;
}

.product-feature-card .panel-preview .k-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

/* Clipped to the card rather than grown to its content, so a dialog aligns to
   what the card shows of the stage. */
.product-feature-card .panel-preview-stage {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
