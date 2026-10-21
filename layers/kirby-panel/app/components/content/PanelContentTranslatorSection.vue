<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    language?: string;
    languages?: string[];
    import?: boolean;
    importFrom?: "all";
    batch?: boolean;
    /** A run in progress, which the plugin reads from its translation state. */
    isTranslating?: boolean;
  }>(),
  { label: "Content Translator", import: true, batch: true },
);

const actions = computed(() => contentTranslatorActions(props).flat());

const isDefaultLanguageInfo = computed(
  () =>
    !props.batch &&
    !(props.import && props.importFrom === "all") &&
    (props.language ?? props.languages?.[0] ?? "en") ===
      (props.languages?.[0] ?? "en"),
);
</script>

<template>
  <k-section :label="label">
    <k-box theme="none">
      <k-button-group layout="collapsed">
        <k-button
          v-for="action in actions"
          :key="action.text"
          :text="action.text"
          :icon="
            isTranslating && action.type !== 'import' ? 'loader' : action.icon
          "
          :theme="action.type === 'import' ? undefined : 'notice-icon'"
          :disabled="action.disabled || isTranslating"
          variant="filled"
        />
      </k-button-group>
    </k-box>

    <k-box
      v-if="isDefaultLanguageInfo"
      theme="none"
      text="Content can only be imported and translated for secondary languages."
      class="mt-[var(--spacing-1)]"
    />
  </k-section>
</template>
