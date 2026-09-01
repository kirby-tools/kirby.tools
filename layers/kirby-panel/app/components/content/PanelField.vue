<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    /** The blueprint key, which Kirby turns into `k-field-name-<name>`. */
    name?: string;
    type?: PanelFieldType;
    /** The blueprint `width`, a fraction of the fieldset grid such as `1/2`. */
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
