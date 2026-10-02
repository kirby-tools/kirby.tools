<script setup lang="ts">
defineProps<{
  label: string;
  theme: string;
  /** A run in progress, which the plugin reads from its translation state. */
  isTranslating?: boolean;
  /**
   * The items the plugin builds from its blueprint options and the Panel's
   * current language, neither of which a Mock has.
   */
  options: PanelDropdownOption[];
}>();

const dropdown = useTemplateRef<{ toggle: () => void }>("dropdown");
</script>

<template>
  <div>
    <k-button
      :text="label"
      :icon="isTranslating ? 'loader' : 'content-translator-global'"
      :theme="theme"
      size="sm"
      variant="filled"
      responsive
      dropdown
      @click="dropdown?.toggle()"
    />
    <k-dropdown ref="dropdown" :options="options" />
  </div>
</template>
