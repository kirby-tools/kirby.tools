<script setup lang="ts">
import "#kirby-panel/components/Dropdowns/PicklistDropdown.vue?vue&type=style&index=0&lang.css";

defineProps<{
  options?: PanelPicklistOption[];
  value?: string[];
  alignX?: "start" | "end";
}>();

const emit = defineEmits<{ input: [value: string[]] }>();
</script>

<template>
  <div
    class="panel-dropdown k-dropdown k-picklist-dropdown top-full"
    :data-align-x="alignX"
  >
    <k-picklist-input
      :options="options"
      :value="value"
      @input="emit('input', $event)"
    />
  </div>
</template>
