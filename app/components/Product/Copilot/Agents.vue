<script setup lang="ts">
// Copilot's agents in a Window: Hanna asks Claude for the exhibition page's
// text and description, and the Panel tab she has open reloads with them. They
// wait in the unsaved changes until she saves them in the Panel. Until the
// reader acts, with motion allowed and while in view, the Window follows
// Claude's link into the Panel on its own, and the cursor saves there.
import type { WindowTab } from "~/components/Exhibition/Window.vue";
import type { ChatStep } from "~/composables/exhibition-chat";

const props = withDefaults(
  defineProps<{
    /** The tab the reader sees first; the conversation starts once Claude's tab shows. */
    start?: "panel" | "claude";
    bodyClass?: string;
  }>(),
  { start: "claude", bodyClass: "h-120" },
);

// How long the Window waits on Claude's link before following it.
const LINK_DWELL = 2000;
// How long the reloaded view shows before the cursor moves to Save.
const REVIEW_DWELL = 1600;
// Copilot's button, as the site has the plugin; its prompt dialog is the
// Copilot Scene's to show.
const VIEW_BUTTON: PanelViewButton = { plugin: "copilot" };

const activeTab = ref<string>(props.start);
const hasOpenedClaude = ref(props.start === "claude");
const hasAgentChange = ref(false);
const hasSeenChange = ref(false);
const replayCount = ref(0);
const page = useExhibitionPage({ text: [], description: "" });
const {
  notification,
  open: openNotification,
  close: closeNotification,
} = usePanelNotification();

const root = useCurrentElement<HTMLElement>();
const chat = useTemplateRef<HTMLElement>("chat");
const panel = useTemplateRef<HTMLElement>("panel");
const isVisible = useAutoplayVisibility(root);
const reducedMotion = usePreferredReducedMotion();
// The reader's input ends what the Window does on its own; the conversation
// itself plays on.
const hasReaderActed = useReaderInput(root);
const {
  cursor,
  click,
  fadeOut,
  clear: clearCursor,
} = useMockCursor("copilot", hasReaderActed);
let followLink: (() => void) | undefined;

const conversation = prepareChat(reloadPanel);

const tabs = computed<WindowTab[]>(() => [
  { ...PANEL_TAB, hasActivity: hasAgentChange.value && !hasSeenChange.value },
  { ...claudeTab(conversation), hasActivity: !hasOpenedClaude.value },
]);

// Input before the conversation began, like the click that opened Claude's
// tab, leaves the Window to follow the link on its own.
const steps: ChatStep[] = [
  {
    run: () => {
      hasReaderActed.value = false;
    },
  },
  ...conversation.steps,
  { run: waitForLink },
  { run: save },
];

const { entries, composer, isPlaying, reset } = useExhibitionChat(steps, chat);

watch(activeTab, (value) => {
  if (value === "claude") hasOpenedClaude.value = true;
  showChange();
});

function reloadPanel() {
  page.update(
    {
      text: EXHIBITION_PAGE.text,
      description: EXHIBITION_PAGE.description,
    },
    // Claude's `prepare_changes` names no language, so it writes the default
    // one, whichever the Panel tab shows.
    EXHIBITION_DEFAULT_LANGUAGE.code,
  );
  hasAgentChange.value = true;
  showChange();
}

// Shows why the Panel reloaded once the reader looks at it, so the notice
// isn't gone by then. Copilot reloads a view only in the language the agent
// wrote, so a look in another language uses the notice up.
function showChange() {
  if (activeTab.value !== "panel" || !hasAgentChange.value) return;
  if (hasSeenChange.value) return;
  hasSeenChange.value = true;
  if (page.languageCode.value !== EXHIBITION_DEFAULT_LANGUAGE.code) return;
  openNotification({
    icon: "info",
    theme: "info",
    text: "An agent changed this content, so the view was reloaded.",
  });
}

// Resolves once the reader follows Claude's link, or once the Window follows
// it on its own for a reader who hasn't acted, with motion allowed and the
// Window in view.
function waitForLink(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      if (
        !hasReaderActed.value &&
        isVisible.value &&
        reducedMotion.value !== "reduce"
      )
        openPanel();
    }, LINK_DWELL);
    followLink = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      followLink = undefined;
      resolve();
    };
    signal.addEventListener("abort", abort, { once: true });
    function abort() {
      clearTimeout(timer);
      followLink = undefined;
      reject(signal.reason);
    }
  });
}

function openPanel() {
  // Claude's link names the default language, so the Panel opens in it.
  page.languageCode.value = EXHIBITION_DEFAULT_LANGUAGE.code;
  activeTab.value = "panel";
  followLink?.();
}

function followLinkByReader() {
  hasReaderActed.value = true;
  openPanel();
}

// Moves the cursor onto the Panel's Save button and clicks it, unless the
// reader has acted or scrolled away by then.
async function save(signal: AbortSignal) {
  await sleep(REVIEW_DWELL, signal);
  if (activeTab.value !== "panel" || !isVisible.value) return;
  if (!(await click(panel.value, "Save", signal))) return;
  fadeOut(0.8);
}

// Returns to the start tab; the conversation plays again once Claude's tab
// shows.
function replay() {
  clearCursor();
  page.reset();
  page.languageCode.value = EXHIBITION_DEFAULT_LANGUAGE.code;
  hasAgentChange.value = false;
  hasSeenChange.value = false;
  hasReaderActed.value = false;
  closeNotification();
  activeTab.value = props.start;
  hasOpenedClaude.value = props.start === "claude";
  replayCount.value++;
  reset();
}
</script>

<template>
  <ExhibitionWindow
    v-model="activeTab"
    :tabs="tabs"
    :body-class="bodyClass"
    @replay="replay"
  >
    <template #panel>
      <div ref="panel" class="h-full">
        <!-- The Panel tab before the agent changed anything. -->
        <div
          v-if="$slots.idle && !hasAgentChange"
          :key="replayCount"
          class="h-full"
        >
          <slot name="idle" />
        </div>
        <ExhibitionScene
          v-else
          :page="page"
          :view-button="VIEW_BUTTON"
          :notification="notification"
          :cursor="cursor"
          @save="closeNotification"
          @discard="closeNotification"
          @close-notification="closeNotification"
        />
      </div>
    </template>

    <template #claude>
      <div ref="chat" class="h-full">
        <ExhibitionChat
          :entries="entries"
          :composer="composer"
          :is-playing="isPlaying"
          can-follow-links
          @link="followLinkByReader"
        />
      </div>
    </template>
  </ExhibitionWindow>
</template>
