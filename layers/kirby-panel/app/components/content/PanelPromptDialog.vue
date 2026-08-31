<script setup lang="ts">
const props = defineProps<{
  prompt?: string;
  preview?: string;
  previewOpen?: boolean;
  /** Number of attached files, which the file picker carries as a badge. */
  files?: number;
  /** `true` for the field picker, a number to badge it with a selection count. */
  fields?: number | boolean;
  /** The insert select, which Copilot shows when a toolbar passes a selection. */
  replace?: boolean;
  /**
   * The one dropdown the mock shows open, under the toolbar button named by
   * `under`. A prop rather than a slot, because MDC resolves a named slot only
   * on a top-level component.
   */
  dropdown?: Record<string, unknown> & {
    under: "placeholders" | "templates" | "history" | "fields";
  };
}>();

const TOOLS = [
  { under: "placeholders", icon: "copilot-text-snippet" },
  { under: "templates", icon: "bookmark" },
  { under: "history", icon: "clock" },
] as const;

const TOKEN = /(\{[\w.]+\})|(@page:\/\/\S+)/g;

const tokens = computed(() => {
  const parts: { text: string; type?: string }[] = [];
  let index = 0;

  for (const match of (props.prompt ?? "").matchAll(TOKEN)) {
    if (match.index > index) {
      parts.push({ text: props.prompt!.slice(index, match.index) });
    }
    parts.push({ text: match[0], type: match[1] ? "placeholder" : "page-ref" });
    index = match.index + match[0].length;
  }

  parts.push({ text: (props.prompt ?? "").slice(index) });
  return parts;
});

const dropdownProps = computed(() => {
  const { under, ...rest } = props.dropdown ?? {};
  return rest;
});

// Room for the dropdown, which floats over the view below the dialog in the
// Panel and would be clipped by a figure cropped to the dialog.
const dropdownSpace = computed(() => {
  if (!props.dropdown) return undefined;

  const items = (props.dropdown.items ?? []) as unknown[];
  const rows = items.reduce<number>(
    (total, item) => total + (item === "-" ? 0.5 : 1),
    props.dropdown.search === undefined ? 0 : 1.75,
  );

  return { marginBottom: `calc(${rows} * var(--height) + var(--spacing-4))` };
});
</script>

<template>
  <PanelDialog size="large" class="panel-prompt-dialog" :style="dropdownSpace">
    <div class="relative rounded-[var(--rounded)]">
      <!-- Copilot's prompt editor, whose ProseMirror carries the padding. -->
      <p
        class="min-h-[calc(1.5em*3+1rem)] p-2 leading-[1.5] whitespace-pre-wrap"
      >
        <span
          v-for="(token, index) in tokens"
          :key="index"
          :class="token.type && `k-copilot-token-${token.type}`"
          >{{ token.text }}</span
        >
      </p>

      <details
        v-if="preview !== undefined"
        :open="previewOpen"
        class="group mx-2 mb-2 rounded-[var(--rounded)] bg-[var(--panel-color-back)]"
      >
        <summary
          class="flex list-none items-center gap-0.5 rounded-[var(--rounded)] p-1.5 [&::-webkit-details-marker]:hidden"
        >
          <k-icon
            type="angle-dropdown"
            class="size-[var(--icon-size)] -rotate-90 transition-transform group-open:rotate-0"
          />
          <span>Preview</span>
        </summary>
        <div class="px-1.5 py-2">
          <p class="leading-[1.375] whitespace-pre-wrap">{{ preview }}</p>
        </div>
      </details>

      <div class="flex items-center justify-between px-2 pb-2">
        <div class="flex flex-wrap items-center gap-1">
          <k-button
            icon="attachment"
            :badge="files ? { theme: 'notice', text: files } : undefined"
          />
          <k-button v-if="files" text="Clear" variant="dimmed" size="sm" />

          <span v-for="tool in TOOLS" :key="tool.under" class="relative flex">
            <k-button :icon="tool.icon" dropdown />
            <PanelDropdown
              v-if="dropdown?.under === tool.under"
              v-bind="dropdownProps"
            />
          </span>
        </div>

        <div class="flex gap-2">
          <!-- Copilot renders this as a select, which Kirby underlines. -->
          <k-button
            v-if="replace"
            text="Replace"
            variant="dimmed"
            class="underline [text-underline-offset:var(--link-underline-offset)]"
          />
          <span v-if="fields" class="relative flex">
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
              align="end"
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
.panel-preview .panel-prompt-dialog {
  --dialog-color-back: var(--input-color-back);
  --dialog-padding: 0;
  --dialog-rounded: var(--rounded);

  overflow: visible;
}

[class*="k-copilot-token-"] {
  border-radius: var(--rounded-xs);
  padding-inline: var(--spacing-1);
}

.k-copilot-token-placeholder {
  color: light-dark(var(--color-purple-800), var(--color-purple-900));
  background: var(--color-purple-300);
}

.k-copilot-token-page-ref {
  color: light-dark(var(--color-blue-800), var(--color-blue-900));
  background: var(--color-blue-300);
}
</style>
