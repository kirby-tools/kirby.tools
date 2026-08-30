<script setup lang="ts">
// Kirby's `k-textarea-input` and `k-writer-input` pull in an editor, a toolbar
// component and a `direction` directive. Import only the style blocks they
// carry and restate their markup below.
import "#kirby-panel/components/Forms/Input/TextareaInput.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Input/WriterInput.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Writer/Toolbar.vue?vue&type=style&index=0&lang.css";

withDefaults(
  defineProps<{
    type?: "textarea" | "writer";
    value?: string;
    placeholder?: string;
    /** A `"|"` between two entries draws a separator, as in a blueprint. */
    buttons?: (Record<string, unknown> | string)[];
  }>(),
  { type: "textarea" },
);
</script>

<template>
  <k-input :type="type">
    <div v-if="type === 'writer'" class="k-writer k-writer-input">
      <k-toolbar
        v-if="buttons"
        :buttons="buttons"
        :data-inline="false"
        class="k-writer-toolbar"
      />
      <!-- ProseMirror keeps an empty paragraph in an empty document, which is
           what gives the editor its one-line height. -->
      <div class="ProseMirror">
        <p v-if="value">{{ value }}</p>
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
