<script setup lang="ts">
const props = defineProps<{
  label?: string;
  /** The blueprint key, which Kirby turns into `k-field-name-<name>`. */
  name?: string;
  type?: PanelFieldType;
}>();

provide(
  panelFieldTypeKey,
  computed(() => props.type),
);
</script>

<template>
  <k-field :label="label" :name="name" :type="type">
    <slot />
  </k-field>
</template>
