<script setup lang="ts">
import type { PanelContentTranslatorOptions } from "../../types/plugins";

const props = withDefaults(
  defineProps<
    PanelContentTranslatorOptions & {
      label?: string;
      /** A run in progress, which the plugin reads from its translation state. */
      isTranslating?: boolean;
    }
  >(),
  { label: "Content Translator", import: true, batch: true },
);

const actions = computed(() => contentTranslatorActions(props).flat());
const hasDefaultLanguageInfo = computed(() =>
  hasContentTranslatorDefaultLanguageInfo(props),
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
      v-if="hasDefaultLanguageInfo"
      theme="none"
      text="Content can only be imported and translated for secondary languages."
      class="mt-[var(--spacing-1)]"
    />
  </k-section>
</template>
