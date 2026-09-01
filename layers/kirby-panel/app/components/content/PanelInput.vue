<script setup lang="ts">
// `k-writer-input` mounts a ProseMirror editor a mock has no content for, and
// `k-textarea-input` pulls in `k-textarea-toolbar`, which reads `window.panel`.
// Neither is registered in `components.ts`, so both are mocked here from
// Kirby's own markup and styles.
import "#kirby-panel/components/Forms/Input/TextareaInput.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Input/WriterInput.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Writer/Toolbar.vue?vue&type=style&index=0&lang.css";

withDefaults(
  defineProps<{
    type?: "textarea" | "writer";
    value?: string;
    /** Copilot's ghost text, which trails the value inside the writer. */
    suggestion?: string;
    placeholder?: string;
    buttons?: (Record<string, unknown> | string)[];
  }>(),
  { type: "textarea" },
);
</script>

<template>
  <k-input :type="type">
    <div
      v-if="type === 'writer'"
      class="k-writer k-writer-input"
      :data-placeholder="placeholder"
      :data-empty="!value"
    >
      <k-toolbar
        v-if="buttons"
        :buttons="buttons"
        :data-inline="false"
        class="k-writer-toolbar"
      />
      <!-- Kirby's editor puts `k-text` on the ProseMirror node from
           `Editor.ts`, so it is nowhere in `WriterInput.vue` to copy. -->
      <div class="ProseMirror k-text">
        <p v-if="value">
          {{ value
          }}<span v-if="suggestion" class="k-copilot-suggestion-text">{{
            suggestion
          }}</span>
        </p>
        <p v-else><br /></p>
      </div>
    </div>

    <div v-else class="k-textarea-input">
      <div class="k-textarea-input-wrapper">
        <k-toolbar
          v-if="buttons"
          :buttons="buttons"
          class="k-textarea-toolbar"
        />
        <textarea
          class="k-textarea-input-native"
          :placeholder="placeholder"
          :value="value"
          readonly
        />
      </div>
    </div>
  </k-input>
</template>

<style>
.panel-preview .k-copilot-suggestion-text {
  color: light-dark(var(--color-gray-600), var(--color-gray-500));
}
</style>
