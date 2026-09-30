import type { AnimationPlaybackControls, MotionValue } from "motion-v";
import type { InjectionKey } from "vue";
import type { ProductIdWithThemeColor } from "#shared/products";
import { animate, motionValue } from "motion-v";

/** A host's claim that the reader scrolls to its Scene, which may then play its way to its Plugin's answer once on its own, from the view button on. */
export const sceneAutoplayKey: InjectionKey<boolean> = Symbol("scene-autoplay");

const VISIBLE_RATIO = 0.6;
const DWELL_DURATION = 800;
// The pause after each step, in which the view answers it.
const STEP_DWELL = 700;
// Fitts's law: a move takes the base time plus a time per bit of difficulty,
// which grows with the distance and shrinks with the target's size.
const MOVE_BASE_DURATION = 0.2;
const MOVE_BIT_DURATION = 0.2;
// Where on the Stage the cursor fades in, as fractions of its width and height.
const CURSOR_START = { x: 0.35, y: 0.6 };

/** A click on the Scene's button or option labeled `click`, or an action of the Scene's own, such as typing, that ends once `signal` aborts. */
export type SceneStep =
  { click: string } | { run: (signal: AbortSignal) => Promise<void> };

export interface SceneCursor {
  productId: ProductIdWithThemeColor;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

export type SceneAutoplay = ReturnType<typeof useSceneAutoplay>;

// Plays the Scene's steps with a drawn cursor, once the Stage has been in view
// long enough and the reader has not acted. A Stage that leaves the view
// pauses the steps, and they resume where they stopped.
export function useSceneAutoplay(
  productId: ProductIdWithThemeColor,
  steps: SceneStep[],
) {
  const cursor = shallowRef<SceneCursor>();
  const hasAutoplayHost = inject(sceneAutoplayKey, false);
  const isInert = inject(panelMockInertKey, false);
  const scene = useCurrentElement<HTMLElement>();
  const isMounted = useMounted();
  const reducedMotion = usePreferredReducedMotion();
  const documentVisibility = useDocumentVisibility();
  const isStageVisible = ref(false);
  const hasReaderActed = ref(false);
  const hasFinished = ref(false);
  const stepIndex = ref(0);
  let controller: AbortController | undefined;
  let animation: AnimationPlaybackControls | undefined;

  // Read once mounted, so hydration meets the frame the server rendered.
  const canPlay = computed(
    () =>
      hasAutoplayHost &&
      !isInert &&
      !(isMounted.value && reducedMotion.value === "reduce"),
  );
  const isPending = computed(
    () => canPlay.value && !hasReaderActed.value && !hasFinished.value,
  );

  // The Scene is keyed by its dialog's opens, so the Stage is looked up anew.
  // What the site's sticky header covers is out of view.
  useIntersectionObserver(
    () => scene.value?.querySelector<HTMLElement>(".panel-mock-stage"),
    ([entry]) => {
      isStageVisible.value = entry!.intersectionRatio >= VISIBLE_RATIO;
    },
    {
      threshold: VISIBLE_RATIO,
      rootMargin: () => `-${headerHeight()}px 0px 0px 0px`,
    },
  );

  // The reader's press or key ends the autoplay; its own clicks are untrusted.
  // A key released inside the Scene is the Tab that moved the focus into it,
  // and a touch that scrolls the page sends no `mousedown`.
  useEventListener(scene, ["mousedown", "keydown", "keyup"], (event) => {
    if (event.isTrusted) hasReaderActed.value = true;
  });

  const isReady = computed(
    () =>
      isPending.value &&
      isStageVisible.value &&
      documentVisibility.value === "visible",
  );

  const { start: startDwell, stop: stopDwell } = useTimeoutFn(
    play,
    DWELL_DURATION,
    { immediate: false },
  );

  watch(isReady, (value) => {
    if (value) {
      startDwell();
    } else {
      stopDwell();
      pause();
    }
  });

  onScopeDispose(() => {
    controller?.abort();
    animation?.stop();
  });

  async function play() {
    controller = new AbortController();
    const { signal } = controller;
    const focusedElement = document.activeElement;

    while (stepIndex.value < steps.length) {
      const step = steps[stepIndex.value]!;
      if ("run" in step) await step.run(signal);
      else if (!(await click(step))) break;
      if (signal.aborted) return;

      stepIndex.value++;
      await new Promise((resolve) => setTimeout(resolve, STEP_DWELL));
      if (signal.aborted) return;
      returnFocus(focusedElement);
    }

    hasFinished.value = true;
  }

  async function click(step: { click: string }) {
    const stage = scene.value?.querySelector<HTMLElement>(".panel-mock-stage");
    // Only what the reader could click: a dialog inerts the view behind it.
    const target = [
      ...(stage?.querySelectorAll<HTMLElement>("button, label") ?? []),
    ].find(
      (element) =>
        !element.closest("[inert]") &&
        element.textContent?.trim() === step.click,
    );
    if (!stage || !target) return false;

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

    animation = animate([
      [opacity, 1, { duration: 0.2 }],
      [x, targetX, { duration, ease: "easeInOut" }],
      [y, targetY, { duration, ease: "easeInOut", at: "<" }],
      [scale, 0.8, { duration: 0.1 }],
      [scale, 1, { duration: 0.1 }],
    ]);
    // A stopped animation never resolves, so a run cut short never clicks.
    await animation.finished;
    // A label's own click would move the focus to its checkbox.
    const control = target instanceof HTMLLabelElement ? target.control : null;
    (control ?? target).click();
    return true;
  }

  // Hands the focus back to where the reader left it, or drops it if that
  // element is gone. Kirby's dropdown takes the focus as it opens, so the focus
  // stays there while one is open.
  function returnFocus(focusedElement: Element | null) {
    const activeElement = document.activeElement;
    if (
      !(activeElement instanceof HTMLElement) ||
      !scene.value?.contains(activeElement) ||
      scene.value.querySelector("dialog[open]")
    )
      return;

    if (focusedElement instanceof HTMLElement && focusedElement.isConnected)
      focusedElement.focus({ preventScroll: true });
    else activeElement.blur();
  }

  // Kirby's dropdown is modal and would hold the page while the Scene is out of
  // view, so it closes, and the click that opened it plays again on resume. A
  // reader who acts keeps it open to pick from.
  function pause() {
    controller?.abort();
    const dropdown =
      scene.value?.querySelector<HTMLDialogElement>("dialog[open]");
    if (dropdown && !hasReaderActed.value) {
      dropdown.close();
      stepIndex.value--;
    }
    fadeOut();
  }

  function fadeOut() {
    animation?.stop();
    if (!cursor.value) return;

    animation = animate(cursor.value.opacity, 0, { duration: 0.2 });
    animation.finished.then(() => {
      cursor.value = undefined;
    });
  }

  return { cursor, canPlay, isPending, hasReaderActed };
}

// Nuxt UI sizes its header in `rem`, which an observer's margin does not take.
function headerHeight() {
  const style = getComputedStyle(document.documentElement);
  return (
    Number.parseFloat(style.getPropertyValue("--ui-header-height")) *
    Number.parseFloat(style.fontSize)
  );
}

function moveDuration(distance: number, targetSize: number) {
  return (
    MOVE_BASE_DURATION +
    MOVE_BIT_DURATION * Math.log2(1 + distance / targetSize)
  );
}
