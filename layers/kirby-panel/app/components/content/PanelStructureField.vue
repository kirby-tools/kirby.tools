<script setup lang="ts">
import "#kirby-panel/components/Forms/Field/StructureField.vue?vue&type=style&index=0&lang.css";

defineProps<{
  name?: string;
  label?: string;
  columns?: Record<string, unknown>;
  fields?: Record<string, unknown>;
  value?: Record<string, unknown>[];
}>();
</script>

<template>
  <k-column>
    <!-- No Mock sorts rows, so the sort handles stay out. -->
    <k-structure-field
      :name="name"
      :label="label"
      :columns="columns"
      :fields="fields"
      :value="value"
      :sortable="false"
      type="structure"
    />
  </k-column>
</template>
