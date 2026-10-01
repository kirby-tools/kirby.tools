<script setup lang="ts">
import type { SceneCursor } from "~/composables/scene-autoplay";

defineProps<SceneCursor>();

// Kirby opens a dropdown with `showModal()`, into the top layer, above which
// only another element of the top layer is drawn. So the cursor is a popover,
// placed over its Stage, that shows itself again whenever a dropdown opens.
const element = useCurrentElement<HTMLElement>();
const stage = computed(() =>
  element.value?.closest<HTMLElement>(".panel-mock-stage"),
);
const { left, top } = useElementBounding(stage);

useMutationObserver(stage, raise, { attributeFilter: ["open"], subtree: true });
onMounted(raise);

function raise() {
  const popover = element.value;
  if (!popover?.isConnected) return;
  if (popover.matches(":popover-open")) popover.hidePopover();
  popover.showPopover();
}
</script>

<template>
  <Motion
    popover="manual"
    aria-hidden="true"
    class="pointer-events-none fixed inset-auto m-0 flex origin-top-left items-start overflow-visible border-0 bg-transparent p-0"
    :style="{
      left: `${left}px`,
      top: `${top}px`,
      x,
      y,
      opacity,
      scale,
      color: `var(--ui-${productId})`,
    }"
  >
    <UIcon
      name="i-fluent-cursor-24-filled"
      mode="svg"
      class="size-6 overflow-visible stroke-white stroke-2 drop-shadow-sm [paint-order:stroke]"
    />
    <!-- The Kunsthalle's editor, who works in the Exhibition's Panel. -->
    <span class="mt-5 -ml-2 rounded-sm bg-current px-1.5 py-0.5">
      <span class="text-inverted block text-xs/4 font-medium">Hanna</span>
    </span>
  </Motion>
</template>
