// Opens the Scene's dialog on load, unless the Scene can play its way there,
// and again whenever the reader or the autoplay asks. The count keys the
// Scene, so each call to `open` remounts it.
export function useSceneDialog(autoplay: SceneAutoplay) {
  const isOpen = ref(!autoplay.canPlay.value);
  const openCount = ref(0);
  // Only a dialog the reader opened takes the focus, never one open on load or
  // one the autoplay opened.
  const hasReaderOpened = computed(
    () => openCount.value > 0 && autoplay.hasReaderActed.value,
  );

  // Reduced motion is only known once mounted; for a reader who prefers it, the
  // dialog opens as on load.
  watch(autoplay.canPlay, (canPlay) => {
    if (!canPlay && openCount.value === 0) isOpen.value = true;
  });

  function open() {
    openCount.value++;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return { isOpen, openCount, hasReaderOpened, open, close };
}
