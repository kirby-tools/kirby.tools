import type { InjectionKey } from "vue";
import type { ProductIdWithThemeColor } from "#shared/products";

/** A host's claim that the reader scrolls to its Scene, which may then play its way to its Plugin's answer once on its own, from the view button on. */
export const sceneAutoplayKey: InjectionKey<boolean> = Symbol("scene-autoplay");

const DWELL_DURATION = 800;
// The pause after each step, in which the view answers it.
const STEP_DWELL = 400;

/** A click on the Scene's button or option labeled `click`, or an action of the Scene's own, such as typing, that ends once `signal` aborts. */
export type SceneStep =
  { click: string } | { run: (signal: AbortSignal) => Promise<void> };

export type SceneAutoplay = ReturnType<typeof useSceneAutoplay>;

// Plays the Scene's steps with a drawn cursor, once the Stage has been in view
// long enough and the reader has not acted. A Stage that leaves the view
// pauses the steps, and they resume where they stopped.
export function useSceneAutoplay(
  productId: ProductIdWithThemeColor,
  steps: SceneStep[],
) {
  const hasAutoplayHost = inject(sceneAutoplayKey, false);
  const isInert = inject(panelMockInertKey, false);
  const scene = useCurrentElement<HTMLElement>();
  const isMounted = useMounted();
  const reducedMotion = usePreferredReducedMotion();
  const documentVisibility = useDocumentVisibility();
  const hasReaderActed = useReaderInput(scene);
  const { cursor, click, fadeOut } = useMockCursor(productId, hasReaderActed);
  const hasFinished = ref(false);
  const stepIndex = ref(0);
  let controller: AbortController | undefined;

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
  const isStageVisible = useAutoplayVisibility(() =>
    scene.value?.querySelector<HTMLElement>(".panel-mock-stage"),
  );

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

  onScopeDispose(() => controller?.abort());

  async function play() {
    controller = new AbortController();
    const { signal } = controller;
    const focusedElement = document.activeElement;

    try {
      while (stepIndex.value < steps.length) {
        const step = steps[stepIndex.value]!;
        if ("run" in step) await step.run(signal);
        else if (
          !(await click(scene.value, step.click, signal)) &&
          !signal.aborted
        )
          break;
        if (signal.aborted) return;

        stepIndex.value++;
        await sleep(STEP_DWELL, signal);
        returnFocus(focusedElement);
      }
    } catch (error) {
      if (signal.aborted) return;
      throw error;
    }

    hasFinished.value = true;
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

  return { cursor, canPlay, isPending, hasReaderActed };
}
