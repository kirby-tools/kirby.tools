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
      <div class="flex items-center gap-(--spacing-2)">
        <k-button-group
          v-for="(group, index) in options"
          :key="index"
          v-bind="group"
        />
      </div>
    </template>

    <!-- Every Kirby Tools section stacks its body on one rhythm of its own, so
         the mock owns it rather than each block repeating it. -->
    <div v-if="$slots.default" class="panel-section-body space-y-(--spacing-4)">
      <slot />
    </div>
  </k-section>
</template>

<style>
/* A section always has a body in the Panel, so Kirby leaves the gap its header
   reserves for one unconditionally. A mock cropped to the header alone would
   sit off-center in the preview. */
.panel-preview .k-section-header:last-child {
  margin-bottom: 0;
}
</style>
