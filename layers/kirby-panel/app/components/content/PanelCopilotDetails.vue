<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    editable?: boolean;
    files?: boolean;
    userPrompt?: string;
    open?: boolean;
    /** Number of attached files, which the plugin holds in its own state. */
    fileCount?: number;
  }>(),
  { editable: true, files: true },
);

const hasFiles = computed(() => props.files !== false);

const summary = computed(() =>
  [props.editable && "Prompt", hasFiles.value && "Context"]
    .filter(Boolean)
    .join(", "),
);
</script>

<template>
  <details v-if="summary" :open="open">
    <summary>{{ summary }}</summary>
    <div class="mt-[var(--spacing-3)] [&>*+*]:mt-[var(--spacing-2)]">
      <PanelInput
        v-if="editable"
        type="textarea"
        :value="userPrompt"
        placeholder="What would you like to generate?"
      />

      <k-button-group v-if="hasFiles" layout="collapsed">
        <k-button
          icon="attachment"
          text="Select files"
          variant="filled"
          size="sm"
          :badge="fileCount ? { theme: 'notice', text: fileCount } : undefined"
          class="rounded-[var(--button-rounded)]!"
        />
        <k-button v-if="fileCount" text="Clear" variant="dimmed" size="sm" />
      </k-button-group>
    </div>
  </details>
</template>
