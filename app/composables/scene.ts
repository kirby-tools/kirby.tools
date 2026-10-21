import type { ProductIdWithThemeColor } from "#shared/products";

// Plays the Scene's steps and opens its dialog: on load unless the Scene can
// play its way there, and again whenever the reader or the autoplay asks. The
// open count keys the Scene, so each call to `openDialog` remounts it.
export function useScene(
  productId: ProductIdWithThemeColor,
  page: ExhibitionPage,
  steps: SceneStep[],
) {
  const { cursor, canPlay, isPending, hasReaderActed } = useSceneAutoplay(
    productId,
    steps,
  );
  const {
    notification,
    open: openNotification,
    close: closeNotification,
  } = usePanelNotification();
  const isDialogOpen = ref(!canPlay.value);
  const openCount = ref(0);
  // Only a dialog the reader opened takes the focus, never one open on load or
  // one the autoplay opened.
  const hasReaderOpenedDialog = computed(
    () => openCount.value > 0 && hasReaderActed.value,
  );

  // Reduced motion is only known once mounted; for a reader who prefers it, the
  // dialog opens as on load.
  watch(canPlay, (value) => {
    if (!value && openCount.value === 0) isDialogOpen.value = true;
  });

  function openDialog() {
    openCount.value++;
    isDialogOpen.value = true;
  }

  function closeDialog() {
    isDialogOpen.value = false;
  }

  /** Opens the dialog on the page as it loaded and without the last run's notification, the way a plugin's fresh run starts. */
  function restart() {
    closeNotification();
    page.reset();
    openDialog();
  }

  return {
    cursor,
    isPending,
    notification,
    openNotification,
    closeNotification,
    isDialogOpen,
    openCount,
    hasReaderOpenedDialog,
    openDialog,
    closeDialog,
    restart,
  };
}
