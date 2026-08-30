<script setup lang="ts">
// Kirby's `k-field` builds its class list from a `name` and a `type` a mock has
// no reason to carry. Import only the style block it holds and restate its
// markup below.
import "#kirby-panel/components/Forms/Field.vue?vue&type=style&index=0&lang.css";

defineProps<{
  label?: string;
}>();
</script>

<template>
  <div class="k-field">
    <header v-if="label" class="k-field-header">
      <!-- Left out, `input` casts to `false`, which turns the label into a
           heading. Kirby's own field passes it as `null`. -->
      <k-label :input="null" type="field" :title="label">{{ label }}</k-label>
    </header>

    <slot />
  </div>
</template>
