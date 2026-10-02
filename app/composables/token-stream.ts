export const TOKEN_INTERVAL = 35;
// The wait for a model's first token, in which Copilot's button already shows
// the run.
const FIRST_TOKEN_LATENCY = 1000;
const TOKEN = /\S+\s*/g;

// `update` draws the answer up to the given token count and reports whether
// it is complete; under reduced motion it is asked for everything at once.
export function useTokenStream(update: (tokenCount: number) => boolean) {
  const reducedMotion = usePreferredReducedMotion();
  let tokenCount = 0;

  const {
    isActive: isStreamingTokens,
    pause: pauseTokens,
    resume: resumeTokens,
  } = useIntervalFn(streamNextToken, TOKEN_INTERVAL, { immediate: false });
  const {
    isPending: isAwaitingFirstToken,
    start: awaitFirstToken,
    stop: stopAwaitingFirstToken,
  } = useTimeoutFn(resumeTokens, FIRST_TOKEN_LATENCY, { immediate: false });
  const isStreaming = computed(
    () => isAwaitingFirstToken.value || isStreamingTokens.value,
  );

  function start() {
    if (reducedMotion.value === "reduce") {
      update(Infinity);
      return;
    }

    tokenCount = 0;
    awaitFirstToken();
  }

  function stop() {
    stopAwaitingFirstToken();
    pauseTokens();
  }

  function streamNextToken() {
    tokenCount++;
    if (update(tokenCount)) pauseTokens();
  }

  return { isStreaming, start, stop };
}

// Hands the tokens streamed so far to texts in the order they ask, each text
// taking what the texts before it left.
export function createTokenBudget(tokenCount: number) {
  let remainingTokenCount = tokenCount;

  function take(text: string) {
    const tokens = splitTokens(text);
    const streamedText = tokens.slice(0, remainingTokenCount).join("");
    remainingTokenCount = Math.max(0, remainingTokenCount - tokens.length);
    return streamedText;
  }

  return { take, hasTokensLeft: () => remainingTokenCount > 0 };
}

export function splitTokens(text: string) {
  return text.match(TOKEN) ?? [];
}
