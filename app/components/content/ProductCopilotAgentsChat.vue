<script setup lang="ts">
// One of Hanna's conversations with Claude, alone in a Window.
import type { ChatScript } from "~/utils/exhibition-chats";

const props = defineProps<{
  chat: "waiting" | "publish-guard" | "script" | "lock";
}>();

const CHATS: Record<typeof props.chat, ChatScript> = {
  waiting: WAITING_CHAT,
  "publish-guard": PUBLISH_GUARD_CHAT,
  script: SCRIPT_CHAT,
  lock: LOCK_CHAT,
};

const conversation = computed(() => CHATS[props.chat]);
const tabs = computed(() => [claudeTab(conversation.value)]);

const activeTab = ref("claude");
const thread = useTemplateRef<HTMLElement>("thread");

const { entries, composer, isPlaying, play } = useExhibitionChat(
  () => conversation.value.steps,
  thread,
);
</script>

<template>
  <ExhibitionWindow
    v-model="activeTab"
    :tabs="tabs"
    body-class="h-116"
    class="my-6"
    @replay="play"
  >
    <template #claude>
      <div ref="thread" class="h-full">
        <ExhibitionChat
          :entries="entries"
          :composer="composer"
          :is-playing="isPlaying"
        />
      </div>
    </template>
  </ExhibitionWindow>
</template>
