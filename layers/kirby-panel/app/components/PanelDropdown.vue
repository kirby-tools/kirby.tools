<script setup lang="ts">
interface DropdownItem extends Record<string, unknown> {
  text?: string;
  /** Second, dimmed line, as the placeholder picker shows a field's value. */
  info?: string;
}

defineProps<{
  items?: (DropdownItem | "-")[];
  /** Search field above the items, as Copilot's field picker shows it. */
  search?: string;
  /** Where the dropdown hangs from its trigger, which sits before it. */
  align?: "start" | "end";
}>();
</script>

<template>
  <div class="panel-dropdown k-dropdown" :data-align-x="align">
    <div v-if="search !== undefined" class="panel-dropdown-search">
      <k-input type="text" icon="search">
        <input type="text" :placeholder="search" readonly />
      </k-input>
    </div>

    <template v-for="(item, index) in items" :key="index">
      <hr v-if="item === '-'" />
      <k-dropdown-item v-else v-bind="item">
        <span class="panel-dropdown-item">
          <span>{{ item.text }}</span>
          <span v-if="item.info">{{ item.info }}</span>
        </span>
      </k-dropdown-item>
    </template>
  </div>
</template>

<style>
.panel-dropdown {
  inset-block-start: 100%;
  /* Half the dialog, as in the Panel, so a long `info` truncates. */
  max-width: 20rem;
}

/* Kirby resets `inset-inline-start` so that `left` stays authoritative, and
   pairs `end` with a `-100%` translation. */
.panel-dropdown[data-align-x="end"] {
  left: 100%;
}

.panel-dropdown-search {
  --input-color-back: var(--color-gray-850);
  --input-color-border: transparent;

  padding: var(--spacing-1) var(--spacing-1) var(--spacing-2);
}

.panel-dropdown-search input {
  padding: var(--input-padding);
}

.panel-dropdown-item {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-3);
  min-width: 0;
}

.panel-dropdown-item > :nth-child(2) {
  color: var(--color-text-dimmed);
  font-size: var(--text-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
