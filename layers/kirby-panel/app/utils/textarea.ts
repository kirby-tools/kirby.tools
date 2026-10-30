/**
 * Sizes a textarea to its content where the browser lacks `field-sizing`, as
 * Kirby's `$library.autosize` does on mount and on every input. A hidden
 * textarea measures 0 and keeps its height.
 */
export function sizeTextareaToContent(
  textarea: HTMLTextAreaElement | null | undefined,
) {
  if (!textarea?.scrollHeight || CSS.supports("field-sizing", "content"))
    return;

  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}
