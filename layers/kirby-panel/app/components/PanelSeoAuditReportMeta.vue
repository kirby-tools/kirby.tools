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

// The plugin prints the reader's time zone; a Mock pins one, so the server and
// every reader print the same hour.
const { format } = new Intl.DateTimeFormat("en", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "UTC",
});

const text = computed(() =>
  [
    props.version && VERSION_LABEL[props.version],
    format(props.timestamp),
    props.isStale && "Content changed since",
  ]
    .filter(Boolean)
    .join(" · "),
);
</script>

<template>
  <span>{{ text }}</span>
</template>
