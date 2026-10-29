<script setup lang="ts">
import type { PanelPicklistOption } from "../app/types/kirby";
import { inject, ref } from "vue";
import PanelPicklistDropdown from "../app/components/PanelPicklistDropdown.vue";
import { panelPicklistDropdownOpenKey } from "../app/utils/injection-keys";

defineOptions({ inheritAttrs: false });

// Kirby's own opens as a modal `<dialog>` its script positions at the opener;
// this one renders below the opener in flow, as `PanelPicklistDropdown` does.
defineProps<{ options?: PanelPicklistOption[]; value?: string[] }>();

const emit = defineEmits<{ input: [value: string[]] }>();

const isOpen = ref(inject(panelPicklistDropdownOpenKey, false));

defineExpose({
  open: () => (isOpen.value = true),
  close: () => (isOpen.value = false),
  toggle: () => (isOpen.value = !isOpen.value),
});
</script>

<template>
  <PanelPicklistDropdown
    v-if="isOpen"
    :options="options"
    :value="value"
    @input="emit('input', $event)"
  />
</template>
