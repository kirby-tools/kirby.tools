<script setup lang="ts">
const props = defineProps<{
  prompt?: string;
  preview?: string;
  previewOpen?: boolean;
  files?: number;
  /** `true` for the field picker, a number to badge it with a selection count. */
  fields?: number | boolean;
  /**
   * Text a toolbar passed along, which Copilot answers with the insert select in
   * place of the field picker.
   */
  selection?: boolean;
  /**
   * The one dropdown the mock shows open, under the toolbar button named by
   * `under`. A prop rather than a slot, because MDC binds a named slot to the
   * outermost open component.
   */
  dropdown?: Record<string, unknown> & {
    under: "placeholders" | "templates" | "history" | "fields" | "skills";
  };
}>();

const TOOLS = [
  { under: "placeholders", icon: "copilot-text-snippet" },
  { under: "templates", icon: "bookmark" },
  { under: "history", icon: "clock" },
] as const;

const INSERT_OPTIONS = [
  { value: "replace", text: "Replace" },
  { value: "append", text: "Append" },
];

// The bare trigger comes last, so a complete reference wins the alternation.
const TOKEN = /(\{[\w.]+\})|(@page:\/\/\S+)|(@skill:\/\/[\w-]+)|(@skill:\/\/)/g;

const tokens = computed(() => {
  const parts: { text: string; type?: string }[] = [];
  let index = 0;

  for (const match of (props.prompt ?? "").matchAll(TOKEN)) {
    if (match.index > index) {
      parts.push({ text: props.prompt!.slice(index, match.index) });
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

  parts.push({ text: (props.prompt ?? "").slice(index) });
  return parts;
});

// The plugin hides the history button until a prompt is stored, so it belongs
// only to a figure that opens its dropdown.
const tools = computed(() =>
  TOOLS.filter(
    (tool) => tool.under !== "history" || props.dropdown?.under === "history",
  ),
);

const dropdownProps = computed(() => {
  const { under, ...rest } = props.dropdown ?? {};
  return rest;
});

// Room for the dropdown, which floats over the view below the dialog in the
// Panel and would be clipped by a figure cropped to the dialog.
const dropdownSpace = computed(() => {
  const dropdown = props.dropdown;
  if (!dropdown) return undefined;

  const items = (dropdown.options ?? []) as unknown[];
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
</script>

<template>
  <PanelDialog
    size="large"
    class="panel-copilot-prompt-dialog"
    :style="dropdownSpace"
  >
    <div class="relative rounded-[var(--rounded)]">
      <div
        class="min-h-[calc(1.5em*3+1rem)] p-(--spacing-2) leading-[1.5] break-words whitespace-pre-wrap"
      >
        <template v-for="(token, index) in tokens" :key="index">
          <!-- Above the toolbar row, which the typeahead hangs over. -->
          <span v-if="token.type === 'skill-trigger'" class="relative z-[1]"
            >{{ token.text
            }}<PanelDropdown
              v-if="dropdown?.under === 'skills'"
              v-bind="dropdownProps"
              class="mt-(--spacing-1) max-h-[16rem] max-w-[24rem] min-w-[14rem] overflow-y-auto" /></span
          ><span
            v-else
            :class="token.type && `k-copilot-token-${token.type}`"
            >{{ token.text }}</span
          >
        </template>
      </div>

      <details
        v-if="preview"
        :open="previewOpen"
        class="group mx-(--spacing-2) mb-(--spacing-2) rounded-[var(--rounded)] bg-[var(--panel-color-back)]"
      >
        <summary
          class="flex cursor-pointer list-none items-center gap-0.5 rounded-[var(--rounded)] p-1.5 [&::-webkit-details-marker]:hidden"
        >
          <k-icon
            type="angle-dropdown"
            class="size-[var(--icon-size)] -rotate-90 transition-transform group-open:rotate-0"
          />
          <span>Preview</span>
        </summary>
        <div class="px-1.5 py-(--spacing-2)">
          <p class="leading-[1.375] whitespace-pre-wrap">{{ preview }}</p>
        </div>
      </details>

      <div
        class="flex items-center justify-between px-(--spacing-2) pb-(--spacing-2)"
      >
        <div class="flex flex-wrap items-center gap-(--spacing-1)">
          <k-button
            icon="attachment"
            :badge="files ? { theme: 'notice', text: files } : undefined"
          />
          <k-button v-if="files" text="Clear" variant="dimmed" size="sm" />

          <span
            v-for="tool in tools"
            :key="tool.under"
            class="panel-copilot-prompt-tool relative flex"
          >
            <k-button :icon="tool.icon" dropdown />
            <PanelDropdown
              v-if="dropdown?.under === tool.under"
              v-bind="dropdownProps"
              class="max-h-[var(--panel-dropdown-cap)] max-w-[30rem] min-w-[8rem] overflow-y-auto"
            />
          </span>
        </div>

        <div class="flex gap-(--spacing-2)">
          <k-select-input
            v-if="selection"
            :options="INSERT_OPTIONS"
            value="replace"
            class="underline underline-offset-[var(--link-underline-offset)]"
          />
          <span v-else-if="fields" class="relative flex">
            <k-button
              text="Fields"
              variant="filled"
              dropdown
              :badge="
                typeof fields === 'number'
                  ? { theme: 'info', text: fields }
                  : undefined
              "
            />
            <PanelPicklistDropdown
              v-if="dropdown?.under === 'fields'"
              v-bind="dropdownProps"
              align-x="end"
            />
          </span>
          <k-button
            text="Generate"
            icon="sparkling"
            theme="notice-icon"
            variant="filled"
          />
        </div>
      </div>
    </div>
  </PanelDialog>
</template>

<style>
.panel-mock .panel-copilot-prompt-dialog {
  --dialog-color-back: var(--input-color-back);
  --dialog-padding: 0;
  --dialog-rounded: var(--rounded);

  overflow: visible;
}

/* Copilot drops the three tool buttons below Kirby's `sm` rather than let the
   toolbar wrap. The one whose dropdown a figure opens stays. */
@container panel-stage (max-width: 40rem) {
  .panel-copilot-prompt-dialog
    .panel-copilot-prompt-tool:not(:has(.panel-dropdown)) {
    display: none;
  }
}

.panel-copilot-prompt-dialog [class*="k-copilot-token-"] {
  border-radius: var(--rounded-xs);
  padding-inline: var(--spacing-1);
}

.panel-copilot-prompt-dialog .k-copilot-token-placeholder {
  color: light-dark(var(--color-purple-800), var(--color-purple-900));
  background: var(--color-purple-300);
}

.panel-copilot-prompt-dialog .k-copilot-token-page-ref {
  color: light-dark(var(--color-blue-800), var(--color-blue-900));
  background: var(--color-blue-300);
}

.panel-copilot-prompt-dialog .k-copilot-token-skill-ref {
  color: light-dark(var(--color-green-800), var(--color-green-900));
  background: var(--color-green-300);
}
</style>
