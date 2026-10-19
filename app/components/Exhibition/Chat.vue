<script setup lang="ts">
// Tools run as if the user had chosen Always allow, so no approval card shows.
// Spacing takes Tailwind's steps rather than claude.ai's pixels.
import type { ChatEntry } from "~/composables/exhibition-chat";

const props = defineProps<{
  entries: ChatEntry[];
  composer: string;
  isPlaying?: boolean;
  canFollowLinks?: boolean;
}>();

const emit = defineEmits<{ link: [href: string] }>();

const thread = useTemplateRef<HTMLElement>("thread");

// The working indicator shows while the agent has the turn and hasn't begun
// its reply.
const isWorking = computed(
  () =>
    props.isPlaying && !props.composer && props.entries.at(-1)?.kind !== "text",
);

// Rows of the agent's work sit close together; a message starts a new block.
function spacingClass(index: number) {
  if (index === 0) return "";
  const isRow = (kind?: ChatEntry["kind"]) =>
    kind === "think" || kind === "tool";
  return isRow(props.entries[index]?.kind) &&
    isRow(props.entries[index - 1]?.kind)
    ? "mt-2"
    : "mt-4";
}

// Follows the reply as it grows, as claude.ai does, until the reader scrolls
// back; scrolling to the end again, or a Replay, resumes it. A thread that
// grows or shows again while following catches up.
let isFollowing = true;

function scrollToEnd() {
  if (!isFollowing || !thread.value) return;
  thread.value.scrollTo({ top: thread.value.scrollHeight });
}

useEventListener(
  thread,
  "scroll",
  () => {
    const { scrollHeight, scrollTop, clientHeight } = thread.value!;
    isFollowing = scrollHeight - scrollTop - clientHeight < 2;
  },
  { passive: true },
);
watch(
  () => props.entries,
  (entries) => {
    if (!entries.length) isFollowing = true;
    nextTick(scrollToEnd);
  },
  { deep: true },
);
useResizeObserver(thread, scrollToEnd);
</script>

<template>
  <div
    class="exhibition-chat flex h-full flex-col bg-(--client-back) font-(family-name:--client-font) text-(--client-text)"
  >
    <div
      ref="thread"
      class="min-h-0 flex-1 scrollbar-thin scrollbar-gutter-stable overflow-y-auto px-4 py-6 sm:px-6"
    >
      <div class="mx-auto max-w-2xl">
        <template v-for="(entry, index) in entries" :key="entry.id">
          <div
            v-if="entry.kind === 'user'"
            class="ms-auto w-fit max-w-[85%] rounded-[12px] bg-(--client-user) px-4 py-2.5 text-sm/6 text-pretty"
            :class="spacingClass(index)"
          >
            {{ entry.text }}
          </div>

          <p
            v-else-if="entry.kind === 'think'"
            class="text-sm text-(--client-dim)"
            :class="spacingClass(index)"
          >
            <UChatShimmer v-if="!entry.isDone" text="Thinking…" />
            <template v-else>Thought for {{ entry.seconds }}s</template>
          </p>

          <template v-else-if="entry.kind === 'tool'">
            <p
              v-if="entry.tool.narration"
              class="text-sm text-(--client-dim)"
              :class="spacingClass(index)"
            >
              {{ entry.tool.narration }}
            </p>
            <!-- claude.ai's row: only the icon, title and chevron take the
                 click, the chevron turns down from pointing right, and the
                 body drops Nuxt UI's pre-wrap so the template's whitespace
                 stays collapsed. -->
            <UChatTool
              :text="entry.tool.title"
              icon="i-simple-icons-kirby"
              chevron-icon="i-ri-arrow-right-s-line"
              :streaming="entry.status === 'running'"
              :ui="{
                trigger: 'w-fit',
                trailingIcon: 'group-data-[state=open]:rotate-90',
                body: 'whitespace-normal',
              }"
              :class="entry.tool.narration ? 'mt-2' : spacingClass(index)"
            >
              <div
                class="divide-y divide-(--client-border) overflow-clip rounded-[8px] border border-(--client-border)"
              >
                <div class="p-3">
                  <p class="mb-1 text-xs font-medium">Request</p>
                  <ExhibitionChatJson :value="entry.tool.request" />
                </div>
                <div class="p-3">
                  <p class="mb-1 text-xs font-medium">Response</p>
                  <ExhibitionChatJson
                    v-if="entry.status === 'done'"
                    :value="entry.tool.response"
                    is-compact
                  />
                  <p
                    v-else-if="entry.status === 'error'"
                    class="font-mono text-xs text-(--client-error)"
                  >
                    {{ entry.tool.error }}
                  </p>
                  <UChatShimmer v-else text="Running…" class="text-xs" />
                </div>
              </div>
            </UChatTool>
          </template>

          <ExhibitionChatText
            v-else-if="entry.kind === 'text'"
            :segments="entry.segments"
            :shown-length="entry.shownLength"
            :can-follow-links="canFollowLinks"
            class="font-serif text-base/7"
            :class="spacingClass(index)"
            @link="emit('link', $event)"
          />
        </template>

        <UIcon
          v-if="isWorking"
          name="i-simple-icons-claude"
          class="mt-4 block size-5 animate-[exhibition-chat-spark-turn_4.8s_cubic-bezier(0.65,0,0.35,1)_infinite,exhibition-chat-spark-pulse_1.6s_cubic-bezier(0.65,0,0.35,1)_infinite] text-(--client-brand) motion-reduce:animate-none"
          aria-hidden="true"
        />
      </div>
    </div>

    <div class="px-4 pb-3 sm:px-6">
      <div class="mx-auto max-w-2xl">
        <div
          class="rounded-[16px] bg-(--client-composer) p-2 shadow-[0_4px_20px_rgb(0_0_0/0.075),inset_0_0_0_1px_var(--client-composer-ring)]"
        >
          <p
            class="min-h-10 px-2 pt-1 text-sm/6"
            :class="!composer && 'text-(--client-dim)'"
          >
            {{ composer || "Reply to Claude…" }}
          </p>
          <div class="flex items-center gap-2">
            <span
              class="flex size-8 items-center justify-center rounded-[8px] text-(--client-dim)"
            >
              <UIcon name="i-ri-add-line" class="size-4" />
            </span>
            <span class="ms-auto text-xs text-(--client-dim)">Opus 5.5</span>
            <span
              class="flex size-8 items-center justify-center rounded-[8px] bg-(--client-accent) text-white transition-opacity"
              :class="!composer && 'opacity-40'"
            >
              <UIcon name="i-ri-arrow-up-line" class="size-4" />
            </span>
          </div>
        </div>

        <p class="mt-2 text-center text-xs text-(--client-dim)">
          Claude is AI and can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* claude.ai's palette, close to its light and dark UI. The dark JSON colors
   are measured from claude.ai. */
.exhibition-chat,
.exhibition-window-tab[data-kind="claude"] {
  --client-back: rgb(250 249 245);
  --client-text: rgb(20 20 19);
  --client-dim: rgb(115 114 108);
  --client-border: rgb(0 0 0 / 0.1);
  --client-user: rgb(240 238 230);
  --client-composer: #fff;
  --client-composer-ring: rgb(0 0 0 / 0.1);
  --client-code: rgb(196 59 59);
  --client-code-back: rgb(127 127 127 / 0.08);
  --client-error: rgb(196 59 59);
  --client-accent: rgb(198 97 63);
  --client-brand: #d97757;
  --client-json-key: rgb(196 45 66);
  --client-json-string: rgb(60 120 30);
  --client-json-literal: rgb(30 100 190);
  --client-json-punctuation: rgb(90 90 86);
  --client-font:
    ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
    sans-serif;
}

.dark :is(.exhibition-chat, .exhibition-window-tab[data-kind="claude"]) {
  --client-back: rgb(21 21 21);
  --client-text: rgb(240 239 236);
  --client-dim: rgb(156 154 146);
  --client-border: rgb(255 255 255 / 0.1);
  --client-user: rgb(255 255 255 / 0.05);
  --client-composer: rgb(32 32 31);
  --client-composer-ring: rgb(255 255 255 / 0.2);
  --client-code: rgb(236 126 126);
  --client-error: rgb(236 126 126);
  --client-json-key: rgb(244 123 133);
  --client-json-string: rgb(155 233 99);
  --client-json-literal: rgb(125 180 255);
  --client-json-punctuation: rgb(211 215 222);
}

/* Nuxt UI's text tokens, pointed at claude.ai's palette, so the tool rows and
   shimmers inside take it. */
.exhibition-chat {
  --ui-text-dimmed: var(--client-dim);
  --ui-text-muted: var(--client-dim);
  --ui-text: var(--client-text);
  --ui-text-highlighted: var(--client-text);
}

/* claude.ai's spark while the agent works: three times it turns a third while
   it shrinks and recovers, then rests, so the loop restarts at a full turn.
   The turn and the pulse are separate animations, so each eases in its own
   time. */
@keyframes exhibition-chat-spark-turn {
  0% {
    rotate: 0deg;
  }
  16%,
  33% {
    rotate: 120deg;
  }
  50%,
  66% {
    rotate: 240deg;
  }
  83%,
  100% {
    rotate: 360deg;
  }
}

@keyframes exhibition-chat-spark-pulse {
  0%,
  48%,
  100% {
    scale: 1;
  }
  24% {
    scale: 0.8;
  }
}
</style>
