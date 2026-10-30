import type { AnimationPlaybackControls, MotionValue } from "motion-v";
import type { Ref, ShallowRef } from "vue";
import type { ProductIdWithThemeColor } from "#shared/products";
import { animate, motionValue } from "motion-v";

// Fitts's law: a move takes the base time plus a time per bit of difficulty,
// which grows with the distance and shrinks with the target's size.
const MOVE_BASE_DURATION = 0.2;
const MOVE_BIT_DURATION = 0.2;
// Where on the Stage the cursor fades in, as fractions of its width and height.
const CURSOR_START = { x: 0.35, y: 0.6 };

export interface MockCursor {
  productId: ProductIdWithThemeColor;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

// Drives a drawn cursor over a Mock's Stage and fades it out once the reader
// acts.
export function useMockCursor(
  productId: ProductIdWithThemeColor,
  hasReaderActed: Ref<boolean>,
) {
  const cursor = shallowRef<MockCursor>();
  let animation: AnimationPlaybackControls | undefined;

  watch(hasReaderActed, (value) => {
    if (value) fadeOut();
  });

  /** Moves the cursor onto the button or label that reads `text` on the Stage within `container` and clicks it, resolving with whether it got there before the reader acted or `signal` aborted. */
  async function click(
    container: HTMLElement | null | undefined,
    text: string,
    signal: AbortSignal,
  ) {
    const stage = container?.querySelector<HTMLElement>(".panel-mock-stage");
    if (!stage) return false;
    const target = findStageTarget(stage, text);
    if (!target || !(await moveTo(stage, target, signal))) return false;
    clickStageTarget(target);
    return true;
  }

  async function moveTo(
    stage: HTMLElement,
    target: HTMLElement,
    signal: AbortSignal,
  ) {
    if (signal.aborted || hasReaderActed.value) return false;
    animation = moveCursor(cursor, productId, stage, target);
    // A stopped move never finishes, so the reader's input or an abort ends the
    // wait too.
    let stopWatching: (() => void) | undefined;
    let abort: (() => void) | undefined;
    await Promise.race([
      animation.finished,
      new Promise<void>((resolve) => {
        stopWatching = whenever(hasReaderActed, () => resolve());
        abort = resolve;
        signal.addEventListener("abort", abort, { once: true });
      }),
    ]);
    stopWatching?.();
    signal.removeEventListener("abort", abort!);
    return !signal.aborted && !hasReaderActed.value;
  }

  function fadeOut(delay = 0) {
    animation?.stop();
    animation = fadeOutCursor(cursor, delay);
  }

  function clear() {
    animation?.stop();
    cursor.value = undefined;
  }

  onScopeDispose(() => animation?.stop());

  return { cursor, click, fadeOut, clear };
}

/** Finds the Stage's button or label that reads `text` and that the reader could click: a dialog inerts the view behind it. */
function findStageTarget(stage: HTMLElement, text: string) {
  return [...stage.querySelectorAll<HTMLElement>("button, label")].find(
    (element) =>
      !element.closest("[inert]") && element.textContent?.trim() === text,
  );
}

/** Clicks a target the cursor has reached; a label's own click would move the focus to its control. */
function clickStageTarget(target: HTMLElement) {
  const control = target instanceof HTMLLabelElement ? target.control : null;
  (control ?? target).click();
}

function fadeOutCursor(cursor: ShallowRef<MockCursor | undefined>, delay = 0) {
  if (!cursor.value) return;
  const animation = animate(cursor.value.opacity, 0, { duration: 0.2, delay });
  animation.finished.then(() => {
    cursor.value = undefined;
  });
  return animation;
}

/** Fades the cursor in on the Stage if it isn't there yet, and moves it onto `target` with a press. The caller clicks once the move has finished. */
function moveCursor(
  cursor: ShallowRef<MockCursor | undefined>,
  productId: ProductIdWithThemeColor,
  stage: HTMLElement,
  target: HTMLElement,
) {
  const stageRect = stage.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const { x, y, opacity, scale } = (cursor.value ??= {
    productId,
    x: motionValue(stageRect.width * CURSOR_START.x),
    y: motionValue(stageRect.height * CURSOR_START.y),
    opacity: motionValue(0),
    scale: motionValue(1),
  });

  const targetX = targetRect.left - stageRect.left + targetRect.width / 2;
  const targetY = targetRect.top - stageRect.top + targetRect.height / 2;
  const duration = moveDuration(
    Math.hypot(targetX - x.get(), targetY - y.get()),
    Math.min(targetRect.width, targetRect.height),
  );

  return animate([
    [opacity, 1, { duration: opacity.get() < 1 ? 0.2 : 0 }],
    [x, targetX, { duration, ease: "easeInOut" }],
    [y, targetY, { duration, ease: "easeInOut", at: "<" }],
    [scale, 0.8, { duration: 0.1 }],
    [scale, 1, { duration: 0.1 }],
  ]);
}

function moveDuration(distance: number, targetSize: number) {
  return (
    MOVE_BASE_DURATION +
    MOVE_BIT_DURATION * Math.log2(1 + distance / targetSize)
  );
}
