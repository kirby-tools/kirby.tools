<script setup lang="ts">
const props = defineProps<{
  label?: string;
  name?: string;
  type: PanelFieldType;
  width?: string;
  hasDiff?: boolean;
}>();

const id = useId();
const value = shallowRef<string>();

provide(panelFieldKey, {
  id,
  type: toRef(props, "type"),
  value,
});

// Kirby's writer counts the text without its markup, which here is the blank
// line between paragraphs.
const counter = computed(
  () =>
    !!value.value && {
      count: (props.type === "writer"
        ? value.value.replaceAll("\n\n", "")
        : value.value
      ).length,
    },
);
</script>

<template>
  <k-column :width="width">
    <k-field
      :input="id"
      :label="label"
      :name="name"
      :has-diff="hasDiff"
      :counter="counter"
      :class="`k-${type}-field`"
    >
      <slot />
    </k-field>
  </k-column>
</template>
