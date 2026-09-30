<script setup lang="ts">
import "#kirby-panel/components/View/Buttons/LanguagesDropdown.vue?vue&type=style&index=0&lang.css";

defineProps<{
  text: string;
  options: (PanelLanguagesDropdownOption | "-")[];
}>();

const dropdown = useTemplateRef<{ toggle: () => void }>("dropdown");
</script>

<template>
  <div class="k-view-button k-languages-dropdown">
    <k-button
      :text="text"
      icon="translate"
      responsive="text"
      size="sm"
      variant="filled"
      dropdown
      @click="dropdown?.toggle()"
    />
    <k-dropdown ref="dropdown" :options="options" align-x="end">
      <template #item="{ item: language, index }">
        <k-button
          :key="`item-${index}`"
          v-bind="language"
          class="k-dropdown-item k-languages-dropdown-item"
        >
          {{ language.text }}

          <span class="k-languages-dropdown-item-info">
            <span class="k-languages-dropdown-item-code">
              {{ language.code.toUpperCase() }}
            </span>
          </span>
        </k-button>
      </template>
    </k-dropdown>
  </div>
</template>
