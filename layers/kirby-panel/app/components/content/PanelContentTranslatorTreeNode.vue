<script setup lang="ts">
const props = defineProps<{
  item: PanelContentTranslatorTreeEntry;
  level: number;
}>();

const isOpen = ref(props.item.isOpen ?? false);

const hasChildren = computed(() => (props.item.children?.length ?? 0) > 0);

const incompleteDescendantCount = computed(() =>
  countIncompletePages(props.item.children ?? []),
);

const counterLabel = computed(() => {
  const count = incompleteDescendantCount.value;
  return `${count} incomplete ${count === 1 ? "page" : "pages"}`;
});

function countIncompletePages(
  entries: PanelContentTranslatorTreeEntry[],
): number {
  return entries.reduce(
    (sum, entry) =>
      sum +
      (entry.missingLanguages?.length ? 1 : 0) +
      countIncompletePages(entry.children ?? []),
    0,
  );
}
</script>

<template>
  <li :aria-expanded="isOpen">
    <!-- The plugin drops Kirby's branch background and hover, and separates nested rows with a rule. -->
    <p
      class="k-tree-branch mb-0 bg-transparent pe-[2px] hover:bg-transparent"
      :class="
        level > 0 &&
        'border-x-0 border-t border-b-0 border-solid border-[color:var(--color-border-dimmed)]'
      "
      :style="{ '--tree-level': level }"
    >
      <button
        class="k-tree-toggle"
        :disabled="!hasChildren"
        type="button"
        @click="isOpen = !isOpen"
      >
        <k-icon :type="isOpen ? 'angle-down' : 'angle-right'" />
      </button>

      <button class="k-tree-folder" type="button">
        <k-icon-frame :icon="item.icon ?? 'page'" />
        <span class="k-tree-folder-label">{{ item.label }}</span>
        <span
          v-if="incompleteDescendantCount > 0 && !isOpen"
          class="k-button-badge static transform-none shadow-none"
          data-theme="passive"
          :title="counterLabel"
          :aria-label="counterLabel"
        >
          {{ incompleteDescendantCount }}
        </span>
      </button>

      <span
        v-if="item.missingLanguages?.length"
        class="flex shrink-0 items-center gap-[2px]"
      >
        <k-tag
          v-for="code in item.missingLanguages"
          :key="code"
          :text="code.toUpperCase()"
          theme="light"
        />
      </span>
    </p>

    <ul v-if="isOpen && item.children" class="k-tree">
      <PanelContentTranslatorTreeNode
        v-for="child in item.children"
        :key="child.label"
        :item="child"
        :level="level + 1"
      />
    </ul>
  </li>
</template>
