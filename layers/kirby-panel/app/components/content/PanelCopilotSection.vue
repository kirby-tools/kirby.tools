<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    theme?: string;
    size?: string;
    editable?: boolean;
    files?: boolean;
    userPrompt?: string;
    open?: boolean;
    /** A run in progress, which the plugin keeps in its own state. */
    isGenerating?: boolean;
    /** A finished run the editor hasn't saved yet, which the plugin can undo. */
    canUndo?: boolean;
    /** Number of attached files, which the plugin holds in its own state. */
    fileCount?: number;
  }>(),
  {
    label: "Copilot",
    icon: "sparkling",
    theme: "notice-icon",
    size: "md",
    editable: true,
    files: true,
  },
);
</script>

<template>
  <k-section :label="label">
    <div class="[&>*+*]:mt-[var(--spacing-4)]">
      <k-button-group layout="collapsed">
        <k-button
          :icon="isGenerating ? 'loader' : icon"
          text="Generate"
          :theme="theme"
          variant="filled"
          :size="size"
          :disabled="isGenerating"
        />
        <k-button
          v-if="isGenerating"
          icon="cancel"
          text="Stop"
          theme="notice"
          variant="filled"
          :size="size"
        />
        <k-button
          v-if="canUndo && !isGenerating"
          icon="undo"
          text="Undo"
          variant="filled"
          :size="size"
        />
      </k-button-group>

      <PanelCopilotDetails
        :editable="editable"
        :files="files"
        :user-prompt="userPrompt"
        :open="open"
        :file-count="fileCount"
      />
    </div>
  </k-section>
</template>
