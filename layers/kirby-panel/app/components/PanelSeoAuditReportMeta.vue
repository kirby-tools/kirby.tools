<script setup lang="ts">
const props = defineProps<{
  version?: PanelSeoAuditContentVersion;
  timestamp: number;
  isStale?: boolean;
}>();

const VERSION_LABEL: Record<PanelSeoAuditContentVersion, string> = {
  changes: "Unsaved changes",
  latest: "Published version",
};

// The plugin prints the reader's time zone, which the prerender can't know, so
// the page prints UTC until it hydrates.
const isMounted = useMounted();

const text = computed(() =>
  [
    props.version && VERSION_LABEL[props.version],
    new Intl.DateTimeFormat("en", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: isMounted.value ? undefined : "UTC",
    }).format(props.timestamp),
    props.isStale && "Content changed since",
  ]
    .filter(Boolean)
    .join(" · "),
);
</script>

<template>
  <span>{{ text }}</span>
</template>
