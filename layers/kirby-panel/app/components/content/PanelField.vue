<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    name?: string;
    type?: PanelFieldType;
    width?: string;
  }>(),
  { type: "textarea" },
);

const id = useId();

provide(
  panelFieldTypeKey,
  computed(() => props.type),
);
provide(panelFieldIdKey, id);
</script>

<template>
  <k-column :width="width">
    <k-field
      :input="id"
      :label="label"
      :name="name"
      :type="type"
      :class="`k-${type}-field`"
    >
      <slot />
    </k-field>
  </k-column>
</template>
