<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    /** The blueprint key, which Kirby turns into `k-field-name-<name>`. */
    name?: string;
    type?: PanelFieldType;
    width?: string;
  }>(),
  { type: "textarea" },
);

provide(
  panelFieldTypeKey,
  computed(() => props.type),
);
</script>

<template>
  <k-column :width="width">
    <k-field
      :label="label"
      :name="name"
      :type="type"
      :class="`k-${type}-field`"
    >
      <slot />
    </k-field>
  </k-column>
</template>
