<script setup lang="ts">
// The header buttons are a prop rather than the named slot `k-section` offers,
// because MDC binds a named slot to the outermost open component.
defineProps<{
  label?: string;
  options?: Record<string, unknown>[];
}>();
</script>

<template>
  <k-section :label="label">
    <template v-if="options" #options>
      <div class="panel-section-options">
        <k-button-group
          v-for="(group, index) in options"
          :key="index"
          v-bind="group"
        />
      </div>
    </template>

    <div v-if="$slots.default" class="panel-section-body">
      <slot />
    </div>
  </k-section>
</template>

<style>
/* Every Kirby Tools section wraps its body in a `space-y-4` stack of its own,
   so the mock owns the rhythm rather than each block repeating it. */
.panel-section-body > * + * {
  margin-top: var(--spacing-4);
}

/* A section always has a body in the Panel, so Kirby leaves the gap its header
   reserves for one unconditionally. A mock cropped to the header alone would
   sit off-center in the preview. */
.panel-preview .k-section-header:last-child {
  margin-bottom: 0;
}

.panel-section-options {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}
</style>
