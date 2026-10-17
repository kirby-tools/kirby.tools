<script setup lang="ts">
// A reply as far as it has streamed.
import type { ChatSegment } from "~/composables/exhibition-chat";

const props = defineProps<{
  segments: ChatSegment[];
  shownLength: number;
  /** Whether a link hands its click to the host; without it, a link shows but takes no click. */
  canFollowLinks?: boolean;
}>();

const emit = defineEmits<{ link: [href: string] }>();

const LINK_CLASS = "underline decoration-current/40 underline-offset-3";

// Paragraphs, so a blank line in the reply starts a new `<p>`.
const paragraphs = computed(() => {
  const result: ChatSegment[][] = [[]];
  for (const segment of sliceChatSegments(props.segments, props.shownLength)) {
    if (segment.type === "break") result.push([]);
    else result.at(-1)!.push(segment);
  }
  return result.filter((paragraph) => paragraph.length);
});
</script>

<template>
  <div class="text-pretty [&>p+p]:mt-4">
    <p v-for="(paragraph, index) in paragraphs" :key="index">
      <template
        v-for="(segment, segmentIndex) in paragraph"
        :key="segmentIndex"
      >
        <strong v-if="segment.type === 'bold'" class="font-semibold">
          {{ segment.text }}
        </strong>
        <code
          v-else-if="segment.type === 'code'"
          class="rounded-[6px] border border-(--client-border) bg-(--client-code-back) px-1 py-px font-mono text-[0.875em] text-(--client-code)"
          >{{ segment.text }}</code
        >
        <!-- Without an `href`: the URL is on the Exhibition's site, which isn't
             ours, so a middle click or "Open link" mustn't reach it. -->
        <a
          v-else-if="segment.type === 'link' && canFollowLinks"
          role="link"
          tabindex="0"
          class="cursor-pointer"
          :class="LINK_CLASS"
          @click="emit('link', segment.href!)"
          @keydown.enter="emit('link', segment.href!)"
          >{{ segment.text }}</a
        >
        <span v-else-if="segment.type === 'link'" :class="LINK_CLASS">{{
          segment.text
        }}</span>
        <template v-else>{{ segment.text }}</template>
      </template>
    </p>
  </div>
</template>
