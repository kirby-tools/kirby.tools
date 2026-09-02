<script setup lang="ts">
import "#kirby-panel/components/Forms/Input/TextareaInput.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Toolbar/TextareaToolbar.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Input/WriterInput.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Writer/Toolbar.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  type?: PanelFieldType;
  value?: string;
  selection?: string;
  /** Copilot's ghost text, which follows the last node. */
  suggestion?: string;
  placeholder?: string;
  buttons?: boolean | (Record<string, unknown> | string)[];
}>();

const TEXTAREA_BUTTONS: (Record<string, unknown> | string)[] = [
  { icon: "title", title: "Headings" },
  "|",
  { icon: "bold", title: "Bold" },
  { icon: "italic", title: "Italic" },
  { icon: "code", title: "Code" },
  "|",
  { icon: "url", title: "Link" },
  { icon: "email", title: "Email" },
  { icon: "attachment", title: "File" },
  "|",
  { icon: "list-bullet", title: "Bullet list" },
  { icon: "list-numbers", title: "Ordered list" },
];

const fieldType = inject(panelFieldTypeKey);
const type = computed(() => props.type ?? fieldType?.value ?? "textarea");

/**
 * One entry per ProseMirror node: the writer stores HTML and renders a node per
 * paragraph, so plain text splits on a blank line to reach the same markup.
 * Each paragraph splits again around the selection, since only a node of its
 * own can be painted.
 */
const paragraphs = computed(() =>
  (props.value?.split("\n\n") ?? []).map((paragraph) => {
    const start = props.selection ? paragraph.indexOf(props.selection) : -1;
    if (start === -1) return [{ text: paragraph }];
    const end = start + props.selection!.length;
    return [
      { text: paragraph.slice(0, start) },
      { text: paragraph.slice(start, end), selected: true },
      { text: paragraph.slice(end) },
    ];
  }),
);

const toolbarButtons = computed(() =>
  props.buttons === true ? TEXTAREA_BUTTONS : props.buttons || undefined,
);

const isWriterEmpty = ref(!props.value);

const textarea = useTemplateRef<HTMLTextAreaElement>("textarea");
const isTextareaSizedByScript = ref(false);

// Sizes the textarea to its content where the browser lacks `field-sizing`, as
// Kirby's autosize does on mount and on every input.
const sizeTextareaToContent = () => {
  if (!textarea.value) return;
  textarea.value.style.height = "auto";
  textarea.value.style.height = `${textarea.value.scrollHeight}px`;
};

onMounted(() => {
  isTextareaSizedByScript.value = !CSS.supports("field-sizing", "content");
  if (isTextareaSizedByScript.value) sizeTextareaToContent();
});
</script>

<template>
  <k-input :type="type">
    <div
      v-if="type === 'writer'"
      class="k-writer k-writer-input"
      :data-placeholder="placeholder"
      :data-empty="isWriterEmpty"
    >
      <k-toolbar
        v-if="toolbarButtons"
        :buttons="toolbarButtons"
        :data-inline="false"
        class="k-writer-toolbar"
      />
      <!-- Kirby's editor puts `k-text` on the ProseMirror node from
           `Editor.ts`, so it is nowhere in `WriterInput.vue` to copy. -->
      <div
        class="ProseMirror k-text"
        contenteditable="true"
        @input="isWriterEmpty = !($event.target as HTMLElement).textContent"
      >
        <p v-for="(paragraph, index) in paragraphs" :key="index">
          <template
            v-for="(segment, segmentIndex) in paragraph"
            :key="segmentIndex"
            ><span v-if="segment.selected" class="panel-selection">{{
              segment.text
            }}</span
            ><template v-else>{{ segment.text }}</template></template
          ><span
            v-if="suggestion && index === paragraphs.length - 1"
            class="k-copilot-suggestion-text"
            contenteditable="false"
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
          @input="isTextareaSizedByScript && sizeTextareaToContent()"
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
/* Painted, since a native selection ends once the dialog takes focus. */
.panel-preview .panel-selection {
  background: Highlight;
  color: HighlightText;
}

.panel-preview .k-copilot-suggestion-text {
  color: light-dark(var(--color-gray-600), var(--color-gray-500));
  pointer-events: none;
  user-select: none;
}
</style>
