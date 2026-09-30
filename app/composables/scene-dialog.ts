// Opens the Scene's dialog on load, and again whenever the reader asks. The
// count keys the Scene, so each call to `open` remounts it.
export function useSceneDialog() {
  const isOpen = ref(true);
  const openCount = ref(0);
  // Only a dialog the reader opened takes the focus, never one open on load.
  const hasReaderOpened = computed(() => openCount.value > 0);

  function open() {
    openCount.value++;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return { isOpen, openCount, hasReaderOpened, open, close };
}
