<script setup lang="ts">
import type { InsertOption } from "#kirby-plugin/copilot";
import {
  createInsertOptions,
  createPromptDialogLabels,
  PromptDialogBody,
} from "#kirby-plugin/copilot";
import { translate } from "#panel-mock/translate";
import "#kirby-panel/components/Misc/Notification.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Notification.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  userPrompt?: string;
  /** The resolved prompt, which the plugin fills in from the page. */
  preview?: string;
  previewOpen?: boolean;
  /** Number of attached files, which the plugin holds in its own state. */
  fileCount?: number;
  fields?: PanelFieldProps[];
  selection?: string;
  /**
   * The one dropdown the Mock shows open, under the toolbar button named by
   * `under`. A prop rather than a slot, because MDC binds a named slot to the
   * outermost open component.
   */
  dropdown?: PanelCopilotPromptDropdown;
}>();

const emit = defineEmits<{
  submit: [value: { selectedFieldNames: string[] }];
}>();

const LABELS = createPromptDialogLabels(translate);
const INSERT_OPTIONS = createInsertOptions(translate);

// The plugin's toolbar buttons in their order, each with the icon it shows.
const TOOLS = [
  { under: "placeholders", icon: "copilot-text-snippet" },
  { under: "templates", icon: "bookmark" },
  { under: "history", icon: "clock" },
] as const;

// The bare trigger comes last, so a complete reference wins the alternation.
const TOKEN = /(\{[\w.]+\})|(@page:\/\/\S+)|(@skill:\/\/[\w-]+)|(@skill:\/\/)/g;

provide(panelPicklistDropdownOpenKey, props.dropdown?.under === "fields");

const selectedFieldNames = ref(
  props.dropdown?.under === "fields" ? [...(props.dropdown.value ?? [])] : [],
);
const insertOption = ref<InsertOption["value"]>("replace");
const {
  notification,
  open: openNotification,
  close: closeNotification,
} = usePanelNotification();

const tokens = computed(() => {
  const parts: { text: string; type?: string }[] = [];
  let index = 0;

  for (const match of (props.userPrompt ?? "").matchAll(TOKEN)) {
    if (match.index > index) {
      parts.push({ text: props.userPrompt!.slice(index, match.index) });
    }
    parts.push({
      text: match[0],
      type: match[1]
        ? "placeholder"
        : match[2]
          ? "page-ref"
          : match[3]
            ? "skill-ref"
            : "skill-trigger",
    });
    index = match.index + match[0].length;
  }

  parts.push({ text: (props.userPrompt ?? "").slice(index) });
  return parts;
});

const placeholder = computed(() =>
  props.selection
    ? `${translate("johannschopplich.copilot.prompt.placeholder")} (${translate("johannschopplich.copilot.prompt.selectionContext")})`
    : translate("johannschopplich.copilot.prompt.placeholder"),
);

// The plugin previews a prompt only once it holds a placeholder to resolve.
const hasPlaceholders = computed(() =>
  tokens.value.some((token) => token.type === "placeholder"),
);

// The plugin shows the history button once a prompt is stored.
const recentPrompts = computed(() =>
  props.dropdown?.under === "history"
    ? (props.dropdown.options ?? []).flatMap((option) =>
        option !== "-" && option.text ? [option.text] : [],
      )
    : [],
);

// Kirby's dropdown keeps its open state internal and places itself by
// measuring its opener, so a Mock that shows a toolbar dropdown open repeats
// the buttons up to its opener as invisible placeholders and hangs the items
// below them.
const toolsThroughOpener = computed(() => {
  const under = props.dropdown?.under;
  const openIndex = TOOLS.findIndex((tool) => tool.under === under);
  return openIndex === -1 ? [] : TOOLS.slice(0, openIndex + 1);
});

const dropdownProps = computed(() => {
  if (!props.dropdown || props.dropdown.under === "fields") return;
  const { under, ...rest } = props.dropdown;
  return rest;
});

// Room for the dropdown, which floats over the view below the dialog in the
// Panel and would be clipped by a Mock that stages the dialog alone. The field
// picker opens and closes, so its room is kept while it is closed.
const dropdownSpace = computed(() => {
  const dropdown: PanelCopilotPromptDropdown | undefined =
    props.dropdown ?? (props.fields?.length ? { under: "fields" } : undefined);
  if (!dropdown) return undefined;

  const items: unknown[] =
    (dropdown.under === "fields" ? props.fields : dropdown.options) ?? [];
  const separators = items.filter((item) => item === "-").length;
  // The field picker is a picklist, which brings a search field of its own.
  const rows =
    items.length - separators + (dropdown.under === "fields" ? 1.75 : 0);

  // Kirby's separator is a 1px rule with 0.5rem of margin on each side.
  const height = `${rows} * var(--height-sm) + ${separators} * (1rem + 1px) + 2 * var(--dropdown-padding)`;

  if (dropdown.under !== "skills") {
    return {
      marginBottom: `calc(min(${height}, var(--panel-dropdown-cap)) + var(--spacing-4))`,
    };
  }

  // The typeahead hangs from the editor rather than the toolbar, so the prompt
  // text below it and the toolbar row already cover its first two rows. It caps
  // its own list the way `SkillSuggestDropdown` does.
  return {
    marginBottom: `calc(min(${height}, 16rem) - 2 * var(--height-sm) + var(--spacing-4))`,
  };
});

function submit() {
  if (props.fields?.length && selectedFieldNames.value.length === 0) {
    openNotification({
      text: translate("johannschopplich.copilot.selectFields"),
      theme: "info",
    });
    return;
  }

  emit("submit", { selectedFieldNames: selectedFieldNames.value });
}
</script>

<template>
  <PanelDialog
    size="large"
    :cancel-button="false"
    :submit-button="false"
    class="k-copilot-prompt-dialog"
    :style="dropdownSpace"
    :data-open-tool="toolsThroughOpener.length ? dropdown?.under : undefined"
  >
    <template #header>
      <div
        v-if="notification"
        :data-theme="notification.theme"
        class="k-notification k-dialog-notification"
      >
        <p>{{ notification.text }}</p>
        <k-button icon="cancel" @click="closeNotification()" />
      </div>
    </template>

    <!-- Inert while the Mock holds a dropdown open, which would otherwise sit
         under the plugin's own that a click opens as a modal. -->
    <PromptDialogBody
      v-model:selected-field-names="selectedFieldNames"
      v-model:insert-option="insertOption"
      :labels="LABELS"
      :prompt="userPrompt"
      :preview="hasPlaceholders ? preview : undefined"
      :preview-open="previewOpen"
      :file-count="fileCount"
      :fields="fields"
      :selection="selection"
      :insert-options="INSERT_OPTIONS"
      :recent-prompts="recentPrompts"
      :inert="dropdownProps !== undefined"
      @submit="submit"
    >
      <!-- Stands in for the plugin's prompt editor, which needs ProseMirror and a live view. -->
      <div class="k-copilot-prompt-editor">
        <div data-autofocus tabindex="-1" class="ProseMirror">
          <span
            v-if="!userPrompt"
            class="text-[color:var(--color-text-dimmed)]"
            >{{ placeholder }}</span
          >
          <template v-for="(token, index) in tokens" :key="index">
            <!-- Above the toolbar row, which the typeahead hangs over. -->
            <span v-if="token.type === 'skill-trigger'" class="relative z-[1]"
              >{{ token.text
              }}<PanelDropdown
                v-if="dropdown?.under === 'skills'"
                v-bind="dropdownProps"
                class="mt-[var(--spacing-1)] max-h-[16rem] max-w-[24rem] min-w-[14rem] overflow-y-auto" /></span
            ><span
              v-else
              :class="token.type && `k-copilot-token-${token.type}`"
              >{{ token.text }}</span
            >
          </template>
        </div>
      </div>

      <div
        v-if="toolsThroughOpener.length"
        class="pointer-events-none absolute inset-x-0 bottom-(--spacing-2) flex items-center gap-(--spacing-1) px-(--spacing-2)"
      >
        <k-button
          icon="attachment"
          :badge="fileCount ? { theme: 'notice', text: fileCount } : undefined"
          class="invisible"
        />
        <k-button
          v-if="fileCount"
          text="Clear"
          variant="dimmed"
          size="sm"
          class="invisible"
        />
        <span
          v-for="tool in toolsThroughOpener"
          :key="tool.under"
          class="relative flex"
          :class="
            tool.under !== dropdown?.under && '@max-[40rem]/panel-stage:hidden'
          "
        >
          <k-button :icon="tool.icon" dropdown class="invisible" />
          <PanelDropdown
            v-if="tool.under === dropdown?.under"
            v-bind="dropdownProps"
            class="pointer-events-auto max-h-[var(--panel-dropdown-cap)] max-w-[30rem] min-w-[8rem] overflow-y-auto"
          />
        </span>
      </div>
    </PromptDialogBody>
  </PanelDialog>
</template>

<style>
/* The plugin drops its tool buttons below Kirby's `sm` viewport, for which a
   Mock's stage stands in. The one whose dropdown a Mock opens stays. */
@container panel-stage (width < 40rem) {
  .panel-mock
    .k-copilot-prompt-dialog:not([data-open-tool="placeholders"])
    .k-button:has([data-type="copilot-text-snippet"]),
  .panel-mock
    .k-copilot-prompt-dialog:not([data-open-tool="templates"])
    .k-button:has([data-type="bookmark"]),
  .panel-mock
    .k-copilot-prompt-dialog:not([data-open-tool="history"])
    .k-button:has([data-type="clock"]) {
    display: none;
  }

  .panel-mock
    .k-copilot-prompt-dialog[data-open-tool="placeholders"]
    .k-button:has([data-type="copilot-text-snippet"]),
  .panel-mock
    .k-copilot-prompt-dialog[data-open-tool="templates"]
    .k-button:has([data-type="bookmark"]),
  .panel-mock
    .k-copilot-prompt-dialog[data-open-tool="history"]
    .k-button:has([data-type="clock"]) {
    display: inline-flex;
  }
}

/* Kirby 6 places the field picker at the start of its opener, the first of the
   dialog's action buttons. */
.panel-mock .k-copilot-prompt-dialog :has(> .k-picklist-dropdown) {
  position: relative;
}
</style>
