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
  align?: "start" | "end";
  selected?: number;
}>();
</script>

<template>
  <!-- max-w-80: half the dialog, as in the Panel, so a long `info` truncates. -->
  <div
    class="panel-dropdown k-dropdown top-full max-w-80"
    :data-align-x="align"
  >
    <template v-for="(item, index) in items" :key="index">
      <hr v-if="item === '-'" />
      <k-dropdown-item
        v-else
        v-bind="item"
        :class="index === selected && 'panel-dropdown-item-selected'"
      >
        <span class="inline-flex min-w-0 items-center gap-(--spacing-3)">
          <span>{{ item.text }}</span>
          <span
            v-if="item.info"
            class="truncate text-[length:var(--text-xs)] text-[color:var(--color-text-dimmed)]"
            >{{ item.info }}</span
          >
        </span>
      </k-dropdown-item>
    </template>
  </div>
</template>

<style>
/* Kirby resets `inset-inline-start` so that `left` stays authoritative, and
   pairs `end` with a `-100%` translation. */
.panel-dropdown[data-align-x="end"] {
  left: 100%;
}

.panel-dropdown-item-selected {
  --button-color-back: var(--dropdown-color-hr);
}
</style>
