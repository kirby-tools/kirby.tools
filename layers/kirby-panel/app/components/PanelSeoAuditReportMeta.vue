<script setup lang="ts">
const props = defineProps<{
  version?: PanelSeoAuditContentVersion;
  timestamp: string;
  isStale?: boolean;
}>();

const VERSION_LABEL: Record<PanelSeoAuditContentVersion, string> = {
  changes: "Unsaved changes",
  latest: "Published version",
};

const { format } = new Intl.DateTimeFormat("en", {
  dateStyle: "short",
  timeStyle: "short",
});

const text = computed(() =>
  [
    props.version && VERSION_LABEL[props.version],
    format(new Date(props.timestamp)),
    props.isStale && "Content changed since",
  ]
    .filter(Boolean)
    .join(" · "),
);
</script>

<template>
  <span>{{ text }}</span>
</template>
