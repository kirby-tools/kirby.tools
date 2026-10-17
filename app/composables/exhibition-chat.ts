import type { MaybeRefOrGetter } from "vue";

export interface ChatTool {
  /** The MCP tool name, e.g. `prepare_changes`. */
  name: string;
  /** The title claude.ai shows for the tool, e.g. `Prepare changes`. */
  title: string;
  request: Record<string, unknown>;
  response?: Record<string, unknown>;
  /** A tool error's text, as the Plugin returns it. */
  error?: string;
  /** The line claude.ai writes before the call, saying what it is for. */
  narration?: string;
}

export type ChatStep =
  | {
      /** The user's message, typed into the composer key by key. */
      user: string;
      /** Text the user pastes after it in one go, such as a URL. */
      paste?: string;
    }
  | { think: number }
  | {
      tool: ChatTool;
      duration?: number;
      /**
       * Resolves once the user connects again with the permission the call
       * lacks, which claude.ai asks for when the Plugin answers
       * `insufficient_scope`; the same call then runs again.
       */
      authorize?: (signal: AbortSignal) => Promise<void>;
    }
  | { say: string }
  | {
      /** Gets a signal that aborts on a Replay, so it can stop what it started. */
      run: (signal: AbortSignal) => void | Promise<void>;
    };

export type ChatEntry =
  | { id: number; kind: "user"; text: string }
  | { id: number; kind: "think"; seconds: number; isDone: boolean }
  | {
      id: number;
      kind: "tool";
      tool: ChatTool;
      status: "running" | "authorizing" | "done" | "error";
    }
  | {
      id: number;
      kind: "text";
      segments: ChatSegment[];
      shownLength: number;
    };

export interface ChatSegment {
  type: "text" | "bold" | "code" | "link" | "break";
  text: string;
  href?: string;
}

const SEND_DWELL = 350;

// Parses the little Markdown a reply here needs: `**bold**`, `` `code` ``,
// `[text](href)`, and blank-line paragraphs.
export function parseChatText(source: string): ChatSegment[] {
  const segments: ChatSegment[] = [];
  const pattern = /\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\((.+?)\)|\n\n/g;
  let last = 0;
  for (const match of source.matchAll(pattern)) {
    if (match.index > last)
      segments.push({ type: "text", text: source.slice(last, match.index) });
    if (match[1]) segments.push({ type: "bold", text: match[1] });
    else if (match[2]) segments.push({ type: "code", text: match[2] });
    else if (match[3])
      segments.push({ type: "link", text: match[3], href: match[4] });
    else segments.push({ type: "break", text: "" });
    last = match.index + match[0].length;
  }
  if (last < source.length)
    segments.push({ type: "text", text: source.slice(last) });
  return segments;
}

/** Cuts the segments to their first `shownLength` characters. */
export function sliceChatSegments(
  segments: ChatSegment[],
  shownLength: number,
) {
  const result: ChatSegment[] = [];
  let remaining = shownLength;
  for (const segment of segments) {
    if (segment.type === "break") {
      if (remaining > 0) result.push(segment);
      continue;
    }
    if (remaining <= 0) break;
    result.push({ ...segment, text: segment.text.slice(0, remaining) });
    remaining -= segment.text.length;
  }
  return result;
}

// Plays a scripted conversation into a Chat: the user's message typed into
// the composer, then the agent's reasoning, tool calls, and streamed reply.
// It plays once the Chat is in view, again after a reset, and without motion
// shows where it ends.
export function useExhibitionChat(
  steps: MaybeRefOrGetter<ChatStep[]>,
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
) {
  const entries = ref<ChatEntry[]>([]);
  const composer = ref("");
  const isPlaying = ref(false);
  const reducedMotion = usePreferredReducedMotion();
  const isMounted = useMounted();
  let controller: AbortController | undefined;
  let nextId = 0;

  const isInstant = computed(
    () => isMounted.value && reducedMotion.value === "reduce",
  );

  // Returns the entry from the reactive list, so later changes render.
  function push<T extends ChatEntry>(entry: Omit<T, "id">) {
    entries.value = [...entries.value, { ...entry, id: nextId++ } as T];
    return entries.value.at(-1) as T;
  }

  async function runStep(step: ChatStep, signal: AbortSignal) {
    if ("user" in step) {
      const text = step.user + (step.paste ?? "");
      if (!isInstant.value) {
        for (let length = 1; length <= step.user.length; length++) {
          composer.value = step.user.slice(0, length);
          await sleep(keystrokeDuration(length - 1), signal);
        }
        composer.value = text;
        await sleep(SEND_DWELL, signal);
      }
      composer.value = "";
      push<Extract<ChatEntry, { kind: "user" }>>({ kind: "user", text });
    } else if ("think" in step) {
      const entry = push<Extract<ChatEntry, { kind: "think" }>>({
        kind: "think",
        seconds: Math.max(1, Math.round(step.think / 1000)),
        isDone: isInstant.value,
      });
      if (isInstant.value) return;
      await sleep(step.think, signal);
      entry.isDone = true;
    } else if ("tool" in step) {
      const entry = push<Extract<ChatEntry, { kind: "tool" }>>({
        kind: "tool",
        tool: step.tool,
        status: "running",
      });
      const duration = step.duration ?? 900;
      if (!isInstant.value) await sleep(duration, signal);
      if (step.authorize) {
        entry.status = "authorizing";
        await step.authorize(signal);
        entry.status = "running";
        if (!isInstant.value) await sleep(duration, signal);
      }
      entry.status = step.tool.error ? "error" : "done";
    } else if ("say" in step) {
      const segments = parseChatText(step.say);
      const text = segments.map((segment) => segment.text).join("");
      const entry = push<Extract<ChatEntry, { kind: "text" }>>({
        kind: "text",
        segments,
        shownLength: isInstant.value ? text.length : 0,
      });
      if (isInstant.value) return;
      for (const token of splitTokens(text)) {
        await sleep(TOKEN_INTERVAL, signal);
        entry.shownLength += token.length;
      }
      entry.shownLength = text.length;
    } else {
      await step.run(signal);
    }
  }

  const isVisible = useAutoplayVisibility(target);
  let hasStarted = false;

  watch(isVisible, (visible) => {
    if (visible && !hasStarted) play();
  });

  function stop() {
    controller?.abort();
    entries.value = [];
    composer.value = "";
    isPlaying.value = false;
  }

  async function play() {
    stop();
    hasStarted = true;
    controller = new AbortController();
    const { signal } = controller;
    isPlaying.value = true;
    try {
      for (const step of toValue(steps)) await runStep(step, signal);
    } catch (error) {
      if (!signal.aborted) throw error;
    } finally {
      if (!signal.aborted) isPlaying.value = false;
    }
  }

  onScopeDispose(() => controller?.abort());

  return {
    entries,
    composer,
    isPlaying,
    play,
    /** Clears the Chat, which then plays again once it is in view. */
    reset: async () => {
      stop();
      hasStarted = false;
      // The caller may have just hidden the Chat's tab, which the observer
      // reports only later; after the DOM update, the element itself knows.
      await nextTick();
      const element = toValue(target);
      if (isVisible.value && element?.getClientRects().length) play();
    },
  };
}
