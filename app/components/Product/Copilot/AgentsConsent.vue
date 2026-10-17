<script setup lang="ts">
// The consent Mock in a Window, as Claude connects to Hanna's site: the Panel
// names the agent, the site, and her account, and she ticks what it may do.
// Connecting closes the tab back into Claude, where she asks for a photo on
// the published page – an upload only Publish changes allows. Without it,
// Claude's call waits for her to connect again, and the consent asks for
// Publish changes. Until the reader acts, and with motion allowed, the cursor
// ticks Publish changes and connects.
import type { WindowTab } from "~/components/Exhibition/Window.vue";
import type { ChatAccess } from "~/utils/exhibition-chats";

const DEFAULT_PERMISSIONS = ["content:read", "content:prepare"];
const PUBLISH_PERMISSION = "content:publish";
// claude.ai first asks for every permission, so the two beyond the defaults
// read as requested; asked again, it adds only the one the call lacks.
const REQUESTED_PERMISSIONS = [PUBLISH_PERMISSION, "content:delete"];
// How long the consent shows before the cursor heads for the tick, and how
// long the tick shows before the cursor heads for Connect.
const TICK_DWELL = 3000;
const CONNECT_DWELL = 900;

const access = ref<ChatAccess>();
const isAskingAgain = ref(false);
const conversation = computed(() =>
  uploadChat(access.value ?? "none", waitForPublish),
);

const activeTab = ref("consent");
const consentCount = ref(0);
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
let allowPublish: (() => void) | undefined;

const tabs = computed<WindowTab[]>(() => [
  claudeTab(conversation.value),
  ...(access.value && !isAskingAgain.value ? [] : [CONSENT_TAB]),
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

// Resolves once Hanna connects again with Publish changes.
function waitForPublish(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    allowPublish = () => {
      signal.removeEventListener("abort", abort);
      allowPublish = undefined;
      resolve();
    };
    signal.addEventListener("abort", abort, { once: true });
    function abort() {
      allowPublish = undefined;
      reject(signal.reason);
    }
  });
}

function askAgain() {
  if (!allowPublish) return;
  consentCount.value++;
  isAskingAgain.value = true;
  activeTab.value = "consent";
}

function connect(permissions: string[]) {
  const hasPublish = permissions.includes(PUBLISH_PERMISSION);
  if (!access.value) {
    answerConsent(hasPublish ? "publish" : "prepare");
    return;
  }
  closeConsent();
  if (hasPublish) allowPublish?.();
}

function closeConsent() {
  if (!access.value) {
    answerConsent("none");
    return;
  }
  isAskingAgain.value = false;
  activeTab.value = "claude";
}

function closeTab(value: string) {
  if (value === "consent") closeConsent();
}

function replay() {
  stopCursor();
  access.value = undefined;
  isAskingAgain.value = false;
  hasReaderActed.value = false;
  activeTab.value = "consent";
  consentCount.value++;
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
          @connect="askAgain"
        />
      </div>
    </template>

    <template #consent>
      <div ref="consent" class="h-full">
        <PanelMock
          :key="consentCount"
          class="[&_.panel-mock-stage]:overflow-auto"
        >
          <PanelCopilotAgentsAuthorizeView
            :site="EXHIBITION_SITE.title"
            :account="CHAT_ACCOUNT"
            :client="{ host: 'claude.ai' }"
            :redirect="{ label: 'claude.ai' }"
            :default-permissions="DEFAULT_PERMISSIONS"
            :requested-permissions="
              isAskingAgain ? [PUBLISH_PERMISSION] : REQUESTED_PERMISSIONS
            "
            @connect="connect"
            @cancel="closeConsent"
          />
          <ExhibitionCursor v-if="cursor" v-bind="cursor" />
        </PanelMock>
      </div>
    </template>
  </ExhibitionWindow>
</template>
