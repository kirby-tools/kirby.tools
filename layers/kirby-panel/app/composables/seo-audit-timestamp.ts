import type { MaybeRefOrGetter } from "vue";

/**
 * Shifts a report's timestamp by the local offset until the page hydrates, so
 * prerender and reader both print it in UTC. The plugin prints it in the
 * reader's time zone, which the prerender can't know.
 */
export function useSeoAuditTimestamp(
  timestamp: MaybeRefOrGetter<number | undefined>,
) {
  const isMounted = useMounted();

  return computed(() => {
    const value = toValue(timestamp);
    if (value === undefined || isMounted.value) return value;

    return value + new Date(value).getTimezoneOffset() * 60_000;
  });
}
