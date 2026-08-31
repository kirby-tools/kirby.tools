<script setup lang="ts">
// Kirby's `k-dropdown` is a `<dialog>` its script mounts and positions with
// inline `top` and `left`. A mock runs no script, so the class goes on a plain
// element and the style block below places it.
interface DropdownItem extends Record<string, unknown> {
  text?: string;
  info?: string;
}

defineProps<{
  items?: (DropdownItem | "-")[];
  /** Where the dropdown hangs from its trigger, which sits before it. */
  align?: "start" | "end";
}>();
</script>

<template>
  <div class="panel-dropdown k-dropdown" :data-align-x="align">
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
