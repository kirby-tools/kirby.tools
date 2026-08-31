<script setup lang="ts">
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
  <!-- Kirby's `k-dropdown` is a `<dialog>` its script mounts and positions with
       inline `top` and `left`. A mock runs no script, so the class goes on a
       plain element and the style block below places it. -->
  <div class="panel-dropdown k-dropdown top-full" :data-align-x="align">
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
/* Kirby's script measures `left` and leaves the `end` alignment itself to a
   `-100%` translation. The mock has no script, so `left` comes off the trigger
   the dropdown follows in flow. */
.panel-dropdown[data-align-x="end"] {
  left: 100%;
}

.panel-dropdown-item-selected {
  --button-color-back: var(--dropdown-color-hr);
}
</style>
