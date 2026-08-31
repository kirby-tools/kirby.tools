<script setup lang="ts">
import "#kirby-panel/components/Forms/Field/StructureField.vue?vue&type=style&index=0&lang.css";

defineProps<{
  name?: string;
  label?: string;
  columns?: Record<string, unknown>;
  fields?: Record<string, unknown>;
  rows?: Record<string, unknown>[];
}>();

const ROW_OPTIONS = [
  { icon: "edit", text: "Edit", click: "edit" },
  { icon: "copy", text: "Duplicate", click: "duplicate" },
  "-",
  { icon: "trash", text: "Delete", click: "remove" },
];
</script>

<template>
  <k-field
    :label="label"
    :input="false"
    :name="name"
    type="structure"
    class="k-structure-field"
  >
    <template #options>
      <k-button-group layout="collapsed">
        <k-button
          text="Add"
          icon="add"
          variant="filled"
          size="xs"
          :responsive="true"
        />
        <k-button icon="dots" variant="filled" size="xs" />
      </k-button-group>
    </template>

    <k-table
      :columns="columns"
      :fields="fields"
      :rows="rows"
      :options="ROW_OPTIONS"
      class="k-structure-field-table"
    />

    <footer>
      <k-button title="Add" icon="add" variant="filled" size="xs" />
    </footer>
  </k-field>
</template>
