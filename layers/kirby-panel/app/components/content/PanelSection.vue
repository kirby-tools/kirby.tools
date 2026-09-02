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
        <!-- The size and variant that Kirby's own `#options` fallback passes,
             ahead of `v-bind` so a figure can override them. -->
        <k-button-group
          v-for="(group, index) in options"
          :key="index"
          size="xs"
          variant="filled"
          v-bind="group"
          class="k-section-buttons"
        />
      </div>
    </template>

    <!-- Kirby styles a section's header and leaves the body to whoever fills
         it. Copilot and SEO Audit space their body's children by `--spacing-4`,
         and the mock gives every section that same rhythm. -->
    <div
      v-if="$slots.default"
      class="panel-section-body [&>*+*]:mt-[var(--spacing-4)]"
    >
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
