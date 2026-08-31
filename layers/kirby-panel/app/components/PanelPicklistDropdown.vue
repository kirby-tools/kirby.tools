<script setup lang="ts">
import "#kirby-panel/components/Dropdowns/PicklistDropdown.vue?vue&type=style&index=0&lang.css";

defineProps<{
  options?: { value: string; text: string }[];
  value?: string[];
  align?: "start" | "end";
}>();
</script>

<template>
  <!-- max-w-80: half the dialog, as in the Panel. -->
  <div
    class="panel-dropdown k-dropdown k-picklist-dropdown top-full max-w-80"
    :data-align-x="align"
  >
    <k-picklist-input :options="options" :value="value" />
  </div>
</template>
