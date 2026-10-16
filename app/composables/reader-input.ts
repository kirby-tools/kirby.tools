import type { MaybeRefOrGetter } from "vue";

// Returns a flag that turns true on the reader's first press or key inside
// `target`. A key released without its press inside is the Tab that moved the
// focus into it; the release of a key pressed inside counts no more, so a
// Replay by Enter that resets the flag keeps it reset. A touch that scrolls
// the page sends no `mousedown`.
export function useReaderInput(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
) {
  const hasReaderActed = ref(false);
  let isKeyPressedInside = false;

  useEventListener(target, ["mousedown", "keydown"], (event) => {
    if (!event.isTrusted) return;
    hasReaderActed.value = true;
    if (event.type === "keydown") isKeyPressedInside = true;
  });
  useEventListener(target, "keyup", (event) => {
    if (!event.isTrusted) return;
    if (!isKeyPressedInside) hasReaderActed.value = true;
    isKeyPressedInside = false;
  });

  return hasReaderActed;
}
