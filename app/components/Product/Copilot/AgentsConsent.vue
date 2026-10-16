<script setup lang="ts">
// The consent Mock in a Window, as Claude connects to Hanna's site: the Panel
// names the agent, the site, and her account, and she ticks what it may do.
// Connecting closes the tab back into Claude, where she asks for a photo on
// the published page – an upload only Publish changes allows. Until the
// reader acts, and with motion allowed, the cursor ticks Publish changes and
// connects.
import type { WindowTab } from "~/components/Exhibition/Window.vue";
import type { ChatAccess } from "~/utils/exhibition-chats";

const DEFAULT_PERMISSIONS = ["content:read", "content:prepare"];
const PUBLISH_PERMISSION = "content:publish";
// claude.ai asks for every permission, so the two beyond the defaults read as
// requested.
const REQUESTED_PERMISSIONS = [PUBLISH_PERMISSION, "content:delete"];
// How long the consent shows before the cursor heads for the tick, and how
// long the tick shows before the cursor heads for Connect.
const TICK_DWELL = 3000;
const CONNECT_DWELL = 900;

const access = ref<ChatAccess>();
const conversation = computed(() => uploadChat(access.value ?? "none"));

const activeTab = ref("consent");
const replayCount = ref(0);
const root = useCurrentElement<HTMLElement>();
const hasReaderActed = useReaderInput(root);
const chat = useTemplateRef<HTMLElement>("chat");
const consent = useTemplateRef<HTMLElement>("consent");
const isVisible = useAutoplayVisibility(root);
const reducedMotion = usePreferredReducedMotion();
const {
  cursor,
  moveTo,
  clear: clearCursor,
} = useMockCursor("copilot", hasReaderActed);
let controller: AbortController | undefined;

const tabs = computed<WindowTab[]>(() => [
  claudeTab(conversation.value),
  ...(access.value ? [] : [CONSENT_TAB]),
]);

// Until Hanna answers the consent, Claude's tab shows an empty chat.
const { entries, composer, isPlaying, play, reset } = useExhibitionChat(
  () => (access.value ? conversation.value.steps : []),
  chat,
);

watch(isVisible, (visible) => {
  if (visible) startCursor();
  else stopCursor();
});

onScopeDispose(stopCursor);

function startCursor() {
  if (controller || access.value || hasReaderActed.value) return;
  if (reducedMotion.value === "reduce") return;
  controller = new AbortController();
  const { signal } = controller;
  consentByCursor(signal).catch((error) => {
    if (!signal.aborted) throw error;
  });
}

function stopCursor() {
  controller?.abort();
  controller = undefined;
  clearCursor();
}

async function consentByCursor(signal: AbortSignal) {
  await sleep(TICK_DWELL, signal);
  const stage = consent.value?.querySelector<HTMLElement>(".panel-mock-stage");
  const checkbox = stage?.querySelector<HTMLInputElement>(
    `input[value="${PUBLISH_PERMISSION}"]`,
  );
  if (!stage || !checkbox || !(await moveTo(stage, checkbox, signal))) return;
  // A run cut short by scrolling away may have ticked it already.
  if (!checkbox.checked) clickStageTarget(checkbox);

  await sleep(CONNECT_DWELL, signal);
  const button = findStageTarget(stage, "Connect");
  if (!button || !(await moveTo(stage, button, signal))) return;
  clickStageTarget(button);
}

function answerConsent(value: ChatAccess) {
  stopCursor();
  access.value = value;
  activeTab.value = "claude";
  play();
}

function connect(permissions: string[]) {
  answerConsent(
    permissions.includes(PUBLISH_PERMISSION) ? "publish" : "prepare",
  );
}

function closeTab(value: string) {
  if (value === "consent") answerConsent("none");
}

function replay() {
  stopCursor();
  access.value = undefined;
  hasReaderActed.value = false;
  activeTab.value = "consent";
  replayCount.value++;
  reset();
  if (isVisible.value) startCursor();
}
</script>

<template>
  <ExhibitionWindow
    v-model="activeTab"
    :tabs="tabs"
    body-class="h-136"
    @close="closeTab"
    @replay="replay"
  >
    <template #claude>
      <div ref="chat" class="h-full">
        <ExhibitionChat
          :entries="entries"
          :composer="composer"
          :is-playing="isPlaying"
        />
      </div>
    </template>

    <template #consent>
      <div ref="consent" class="h-full">
        <PanelMock
          :key="replayCount"
          class="[&_.panel-mock-stage]:overflow-auto"
        >
          <PanelCopilotAgentsAuthorizeView
            :site="EXHIBITION_SITE.title"
            :account="CHAT_ACCOUNT"
            :client="{ host: 'claude.ai' }"
            :redirect="{ label: 'claude.ai' }"
            :default-permissions="DEFAULT_PERMISSIONS"
            :requested-permissions="REQUESTED_PERMISSIONS"
            @connect="connect"
            @cancel="answerConsent('none')"
          />
          <ExhibitionCursor v-if="cursor" v-bind="cursor" />
        </PanelMock>
      </div>
    </template>
  </ExhibitionWindow>
</template>
