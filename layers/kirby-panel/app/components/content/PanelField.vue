<script setup lang="ts">
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
