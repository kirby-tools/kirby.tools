import type { MaybeRefOrGetter } from "vue";

const VISIBLE_RATIO = 0.6;
const TYPING_DELAY = 800;
// Copilot's default `completion.debounce`.
const SUGGESTION_DEBOUNCE = 1000;
const SUGGESTION_LATENCY = 1000;
const SUGGESTION_DWELL = 3000;
const ACCEPTED_DWELL = 3000;
// The end of the accepted dwell, in which the field's text fades out before
// the cycle starts over.
const FADE_DURATION = 400;

const ACCEPTED_VALUE = `${COPILOT_SUGGESTION_PREFIX}${COPILOT_SUGGESTION_TYPED_TEXT} ${COPILOT_SUGGESTION}`;
// When each typed character appears, in milliseconds into a cycle.
const KEYSTROKE_TIMES = Array.from(
  COPILOT_SUGGESTION_TYPED_TEXT,
  (_, index) => TYPING_DELAY + sumKeystrokeDurations(index + 1),
);
const SUGGESTION_TOKENS = splitTokens(COPILOT_SUGGESTION);
const SUGGESTION_TIME = KEYSTROKE_TIMES.at(-1)! + SUGGESTION_DEBOUNCE;
const STREAM_TIME = SUGGESTION_TIME + SUGGESTION_LATENCY;
const ACCEPT_TIME =
  STREAM_TIME + SUGGESTION_TOKENS.length * TOKEN_INTERVAL + SUGGESTION_DWELL;
const CYCLE_DURATION = ACCEPT_TIME + ACCEPTED_DWELL;

// Loops Copilot's inline suggestion while the Mock is in view: the editor
// types, pauses, and takes the ghost text as Tab would. An inert host takes the
// click that would pause the loop, so there it cannot be paused.
export function useCopilotSuggestionLoop(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
) {
  const isInert = inject(panelMockInertKey, false);
  const reducedMotion = usePreferredReducedMotion();
  const isMounted = useMounted();
  const documentVisibility = useDocumentVisibility();
  const isInView = ref(false);
  const isPaused = ref(false);
  const cycleTime = ref(0);

  useIntersectionObserver(
    target,
    ([entry]) => {
      isInView.value = entry!.intersectionRatio >= VISIBLE_RATIO;
    },
    { threshold: VISIBLE_RATIO },
  );

  const { pause, resume } = useRafFn(
    ({ delta }) => {
      cycleTime.value = (cycleTime.value + delta) % CYCLE_DURATION;
    },
    { immediate: false },
  );

  // Read once mounted, so hydration meets the frame the server rendered.
  const isMotionReduced = computed(
    () => isMounted.value && reducedMotion.value === "reduce",
  );
  const canPause = computed(() => !isInert && !isMotionReduced.value);
  const frameTime = computed(() =>
    isMotionReduced.value ? ACCEPT_TIME : cycleTime.value,
  );
  const isAccepted = computed(() => frameTime.value >= ACCEPT_TIME);
  const isFading = computed(
    () => frameTime.value >= CYCLE_DURATION - FADE_DURATION,
  );

  const isPlaying = computed(
    () =>
      isInView.value &&
      documentVisibility.value === "visible" &&
      !isMotionReduced.value &&
      !isPaused.value,
  );

  watch(isPlaying, (value) => {
    if (value) resume();
    else pause();
  });

  const typedLength = computed(
    () =>
      KEYSTROKE_TIMES.filter(
        (keystrokeTime) => keystrokeTime <= frameTime.value,
      ).length,
  );

  const value = computed(() =>
    isAccepted.value
      ? ACCEPTED_VALUE
      : COPILOT_SUGGESTION_PREFIX +
        COPILOT_SUGGESTION_TYPED_TEXT.slice(0, typedLength.value),
  );

  const suggestion = computed(() => {
    if (frameTime.value < SUGGESTION_TIME || isAccepted.value) return;
    const tokenCount = Math.ceil(
      (frameTime.value - STREAM_TIME) / TOKEN_INTERVAL,
    );
    return tokenCount > 0
      ? ` ${SUGGESTION_TOKENS.slice(0, tokenCount).join("")}`
      : "";
  });

  function togglePause() {
    isPaused.value = !isPaused.value;
  }

  return {
    value,
    acceptedValue: ACCEPTED_VALUE,
    suggestion,
    isFading,
    isPaused,
    canPause,
    togglePause,
  };
}
