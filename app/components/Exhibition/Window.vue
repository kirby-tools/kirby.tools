<script setup lang="ts">
// A hidden tab keeps its state, and the Window keeps one height whichever tab
// shows.

export interface WindowTab {
  value: string;
  label: string;
  /** What the tab shows, which also picks its icon and background. */
  kind: "panel" | "claude";
  host: string;
  /** Marks a tab whose page changed while it was in the background. */
  hasActivity?: boolean;
}

const props = defineProps<{
  tabs: WindowTab[];
  bodyClass?: string;
}>();

const emit = defineEmits<{ replay: [] }>();
const activeTab = defineModel<string>({ required: true });
provide(panelMockFramedKey, true);

const TAB_KINDS: Record<
  WindowTab["kind"],
  {
    icon: string;
    iconClass?: string;
    /**
     * What the tab's page paints first, so the active tab and its page read as
     * one surface. Kirby scopes `--panel-color-back` to the Mock, so the Panel
     * tab copies Kirby's `--color-gray-200` and dark `--color-gray-900`; Claude's
     * tab takes `--client-back` from Chat.vue's
     * `.exhibition-window-tab[data-kind="claude"]`.
     */
    backClass: string;
  }
> = {
  panel: {
    icon: "i-simple-icons-kirby",
    backClass: "[--tab-back:hsl(0_0%_94%)] dark:[--tab-back:hsl(0_0%_12%)]",
  },
  claude: {
    icon: "i-simple-icons-claude",
    iconClass: "text-(--client-brand)",
    backClass: "[--tab-back:var(--client-back)]",
  },
};

// The flare where the active tab meets its page, as in a browser.
const FLARE_CLASSES = [
  "before:pointer-events-none before:absolute before:bottom-0 before:-left-2 before:size-2 before:bg-[radial-gradient(circle_at_0_0,transparent_8px,var(--tab-back)_8.5px)]",
  "after:pointer-events-none after:absolute after:bottom-0 after:-right-2 after:size-2 after:bg-[radial-gradient(circle_at_100%_0,transparent_8px,var(--tab-back)_8.5px)]",
];

const id = useId();

// A page that stops showing while it holds the focus hands it to the active
// tab before the platform drops it to the document. Runs ahead of the DOM
// update, while the page still holds the focus.
watch(activeTab, async (_, oldValue) => {
  const page = document.getElementById(`${id}-panel-${oldValue}`);
  if (!page?.contains(document.activeElement)) return;
  await nextTick();
  document.getElementById(`${id}-tab-${activeTab.value}`)?.focus();
});

const activeHost = computed(
  () => props.tabs.find((tab) => tab.value === activeTab.value)?.host,
);

// Moves to and selects a tab from the focused one, as the WAI-ARIA tabs
// pattern does; modified keys stay the browser's.
function selectTabByKey(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const buttons = [...(event.currentTarget as HTMLElement).children];
  const index = buttons.indexOf(event.target as Element);
  const last = props.tabs.length - 1;
  const next = {
    ArrowLeft: index > 0 ? index - 1 : last,
    ArrowRight: index < last ? index + 1 : 0,
    Home: 0,
    End: last,
  }[event.key];
  if (next === undefined) return;
  event.preventDefault();
  activeTab.value = props.tabs[next]!.value;
  (buttons[next] as HTMLElement | undefined)?.focus();
}
</script>

<template>
  <figure
    class="border-default bg-default min-w-0 overflow-clip rounded-[12px] border"
  >
    <!-- The tabs stand on the page's edge; the address and Replay center in
         the strip, Replay as far from the corner as from the top. -->
    <div class="flex h-11 items-center gap-2 ps-2 pe-1.5">
      <div
        role="tablist"
        aria-label="Tabs"
        class="flex min-w-0 items-end gap-2 self-end"
        @keydown="selectTabByKey"
      >
        <button
          v-for="tab in tabs"
          :id="`${id}-tab-${tab.value}`"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-controls="`${id}-panel-${tab.value}`"
          :aria-selected="activeTab === tab.value"
          :tabindex="activeTab === tab.value ? 0 : -1"
          :data-kind="tab.kind"
          class="exhibition-window-tab outline-primary relative flex h-9 max-w-60 min-w-0 items-center gap-1.5 rounded-t-[8px] px-3 text-sm focus-visible:outline-2 focus-visible:-outline-offset-2"
          :class="[
            TAB_KINDS[tab.kind].backClass,
            activeTab === tab.value
              ? ['text-highlighted bg-(--tab-back)', FLARE_CLASSES]
              : 'text-muted hover:text-highlighted hover:bg-elevated/50',
          ]"
          @click="activeTab = tab.value"
        >
          <UIcon
            :name="TAB_KINDS[tab.kind].icon"
            class="size-4 shrink-0"
            :class="TAB_KINDS[tab.kind].iconClass"
          />
          <span class="truncate">{{ tab.label }}</span>
          <span
            v-if="tab.hasActivity && activeTab !== tab.value"
            class="bg-primary size-1.5 shrink-0 rounded-full"
          />
        </button>
      </div>

      <span
        class="text-dimmed hidden min-w-0 flex-1 truncate text-end text-sm sm:block"
      >
        {{ activeHost }}
      </span>
      <UButton
        icon="i-ri-reset-left-line"
        color="neutral"
        variant="ghost"
        label="Replay"
        aria-label="Replay"
        :ui="{ leadingIcon: 'size-4', label: 'max-sm:hidden' }"
        class="ms-auto shrink-0 rounded-[6px] max-sm:p-2"
        @click="emit('replay')"
      />
    </div>

    <div class="relative" :class="bodyClass">
      <div
        v-for="tab in tabs"
        v-show="activeTab === tab.value"
        :id="`${id}-panel-${tab.value}`"
        :key="tab.value"
        role="tabpanel"
        :aria-labelledby="`${id}-tab-${tab.value}`"
        class="absolute inset-0"
      >
        <slot :name="tab.value" />
      </div>
    </div>
  </figure>
</template>
