<script setup lang="ts">
import "#kirby-panel/components/Forms/Input/WriterInput.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  value?: string;
  placeholder?: string;
  /** Kirby's writer for a single line, which has no paragraph node. */
  inline?: boolean;
}>();

const emit = defineEmits<{ input: [text: string] }>();

// The editor keeps what the reader types instead of rendering it, so its
// emptiness is tracked here until a new value renders.
const isEmpty = ref(!props.value);
watch(
  () => props.value,
  (value) => {
    isEmpty.value = !value;
  },
);

function input(event: Event) {
  const editor = event.target as HTMLElement;
  isEmpty.value = !editor.textContent;
  emit("input", editor.innerText);
}
</script>

<template>
  <!-- Kirby's writer binds no `id`, so its field's label points at nothing, as
       it does in the Panel. -->
  <div
    class="k-writer k-writer-input"
    :data-placeholder="placeholder"
    :data-empty="isEmpty"
  >
    <slot name="toolbar" />
    <!-- Kirby's editor puts `k-text` on the ProseMirror node from
         `Editor.ts`, so it is nowhere in `WriterInput.vue` to copy. -->
    <div class="ProseMirror k-text" contenteditable="true" @input="input">
      <slot>
        <template v-if="inline">{{ value }}</template>
        <p v-else>{{ value }}</p>
      </slot>
    </div>
  </div>
</template>
