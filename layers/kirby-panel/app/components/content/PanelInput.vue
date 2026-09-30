<script setup lang="ts">
import "#kirby-panel/components/Forms/Input/TextareaInput.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Toolbar/TextareaToolbar.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Writer/Toolbar.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  type?: PanelFieldType;
  value?: string;
  selection?: string;
  /**
   * Copilot's ghost text, which follows the last node. Empty while the provider
   * has not answered, when the plugin shows its pulsing indicator instead.
   */
  suggestion?: string;
  /**
   * A drawn caret at the end of the text, for a Mock that takes no input. The
   * input carries Kirby's focus outline with it, without taking the focus.
   */
  hasCaret?: boolean;
  placeholder?: string;
  buttons?: boolean | (Record<string, unknown> | string)[];
}>();

const emit = defineEmits<{ input: [value: string] }>();

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
const fieldId = inject(panelFieldIdKey, undefined);
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

function input(event: Event) {
  if (isTextareaSizedByScript.value) sizeTextareaToContent();
  emit("input", (event.target as HTMLTextAreaElement).value);
}
</script>

<template>
  <k-input
    :type="type"
    :class="{ '[outline:var(--input-outline-focus)]': hasCaret }"
  >
    <PanelWriter
      v-if="type === 'writer'"
      :value="value"
      :placeholder="placeholder"
    >
      <template #toolbar>
        <k-toolbar
          v-if="toolbarButtons"
          :buttons="toolbarButtons"
          :data-inline="false"
          class="k-writer-toolbar"
        />
      </template>
      <p v-for="(paragraph, index) in paragraphs" :key="index">
        <template
          v-for="(segment, segmentIndex) in paragraph"
          :key="segmentIndex"
          ><span v-if="segment.selected" class="panel-selection">{{
            segment.text
          }}</span
          ><template v-else>{{ segment.text }}</template></template
        ><template v-if="index === paragraphs.length - 1"
          ><span v-if="hasCaret" class="-mr-px border-r" /><span
            v-if="suggestion !== undefined"
            :class="
              suggestion
                ? 'k-copilot-suggestion-text'
                : 'k-copilot-suggestion-indicator'
            "
            contenteditable="false"
            >{{ suggestion }}</span
          ></template
        >
      </p>
      <p v-if="!paragraphs.length"><br /></p>
    </PanelWriter>

    <div v-else-if="type === 'textarea'" class="k-textarea-input">
      <div class="k-textarea-input-wrapper">
        <k-toolbar
          v-if="toolbarButtons"
          :buttons="toolbarButtons"
          class="k-textarea-toolbar"
        />
        <!-- What Kirby's autosize sets inline on mount. It measures an empty
             textarea at its default two rows, which `field-sizing` ignores,
             so the minimum is two lines plus `--input-padding-multiline`
             above and below. -->
        <textarea
          :id="fieldId"
          ref="textarea"
          class="k-textarea-input-native field-sizing-content min-h-[calc(2lh+0.95rem)] overflow-hidden pointer-coarse:min-h-[calc(2lh+0.75rem)]"
          :placeholder="placeholder"
          :value="value"
          @input="input"
        />
      </div>
    </div>

    <component
      :is="`k-${type}-input`"
      v-else
      :id="fieldId"
      :value="value"
      :placeholder="placeholder"
      @input="emit('input', $event)"
    />
  </k-input>
</template>

<style>
/* Painted, since a native selection ends once the dialog takes focus. */
.panel-mock .panel-selection {
  background: Highlight;
  color: HighlightText;
}

.panel-mock .k-copilot-suggestion-indicator {
  display: inline-block;
  width: 0.75em;
  height: 0.75em;
  margin-left: 0.5em;
  margin-right: 0.25em;
  border-radius: 50%;
  background-color: light-dark(var(--color-gray-400), var(--color-gray-700));
  vertical-align: -0.025em;
  animation: copilot-pulse 1.5s ease-in-out infinite;
  pointer-events: none;
  user-select: none;
}

@keyframes copilot-pulse {
  0%,
  100% {
    transform: scale(1);
    background-color: light-dark(var(--color-gray-400), var(--color-gray-700));
  }
  50% {
    transform: scale(1.2);
    background-color: light-dark(var(--color-gray-600), var(--color-gray-500));
  }
}

.panel-mock .k-copilot-suggestion-text {
  color: light-dark(var(--color-gray-600), var(--color-gray-500));
  pointer-events: none;
  user-select: none;
}
</style>
