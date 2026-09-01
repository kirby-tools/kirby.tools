<script setup lang="ts">
import "#kirby-panel/components/Forms/Input/TextareaInput.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Toolbar/TextareaToolbar.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Input/WriterInput.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Writer/Toolbar.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  type?: PanelFieldType;
  value?: string;
  /** Copilot's ghost text, which trails the value inside the writer. */
  suggestion?: string;
  placeholder?: string;
  buttons?: boolean | (Record<string, unknown> | string)[];
}>();

const fieldType = inject(panelFieldTypeKey);
const type = computed(() => props.type ?? fieldType?.value ?? "textarea");

/**
 * One entry per ProseMirror node: the writer stores HTML and renders a node per
 * paragraph, so plain text splits on a blank line to reach the same markup.
 */
const paragraphs = computed(() => props.value?.split("\n\n") ?? []);

const toolbarButtons = computed(() =>
  props.buttons === true ? PANEL_TEXTAREA_BUTTONS : props.buttons || undefined,
);

const textarea = useTemplateRef<HTMLTextAreaElement>("textarea");

// Sizes the textarea to its value where the browser lacks `field-sizing`, as
// Kirby's autosize does on mount.
onMounted(() => {
  if (textarea.value && !CSS.supports("field-sizing", "content")) {
    textarea.value.style.height = `${textarea.value.scrollHeight}px`;
  }
});
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
        v-if="toolbarButtons"
        :buttons="toolbarButtons"
        :data-inline="false"
        class="k-writer-toolbar"
      />
      <!-- Kirby's editor puts `k-text` on the ProseMirror node from
           `Editor.ts`, so it is nowhere in `WriterInput.vue` to copy. -->
      <div class="ProseMirror k-text">
        <p v-for="(paragraph, index) in paragraphs" :key="index">
          {{ paragraph
          }}<span
            v-if="suggestion && index === paragraphs.length - 1"
            class="k-copilot-suggestion-text"
            >{{ suggestion }}</span
          >
        </p>
        <p v-if="!paragraphs.length"><br /></p>
      </div>
    </div>

    <div v-else-if="type === 'textarea'" class="k-textarea-input">
      <div class="k-textarea-input-wrapper">
        <k-toolbar
          v-if="toolbarButtons"
          :buttons="toolbarButtons"
          class="k-textarea-toolbar"
        />
        <!-- What Kirby's autosize sets inline on mount. -->
        <textarea
          ref="textarea"
          class="k-textarea-input-native field-sizing-content overflow-hidden"
          :placeholder="placeholder"
          :value="value"
          readonly
        />
      </div>
    </div>

    <component
      :is="`k-${type}-input`"
      v-else
      :value="value"
      :placeholder="placeholder"
    />
  </k-input>
</template>

<style>
.panel-preview .k-copilot-suggestion-text {
  color: light-dark(var(--color-gray-600), var(--color-gray-500));
}
</style>
