import type { MaybeRefOrGetter } from "vue";

const VISIBLE_RATIO = 0.6;

/** Tells whether enough of `target` is in view for an autoplay to start; what the site's sticky header covers is out of view. */
export function useAutoplayVisibility(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
) {
  const isVisible = ref(false);
  useIntersectionObserver(
    target,
    ([entry]) => {
      isVisible.value = entry!.intersectionRatio >= VISIBLE_RATIO;
    },
    {
      threshold: VISIBLE_RATIO,
      rootMargin: () => `-${headerHeight()}px 0px 0px 0px`,
    },
  );
  return isVisible;
}

// Nuxt UI sizes its header in `rem`, which an observer's margin does not take.
function headerHeight() {
  const style = getComputedStyle(document.documentElement);
  return (
    Number.parseFloat(style.getPropertyValue("--ui-header-height")) *
    Number.parseFloat(style.fontSize)
  );
}
