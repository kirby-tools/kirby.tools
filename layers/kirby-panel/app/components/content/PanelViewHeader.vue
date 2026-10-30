<script setup lang="ts">
import { translate } from "#panel-mock/translate";

const props = defineProps<{
  title?: string;
  buttons?: PanelViewButton[];
  hasDiff?: boolean;
}>();

const emit = defineEmits<(event: "discard" | "save") => void>();

const PLUGIN_BUTTON_COMPONENTS: Record<
  PanelPluginViewButton["plugin"],
  string
> = {
  copilot: "PanelCopilotButton",
  "content-translator": "PanelContentTranslatorDropdownButton",
  "seo-audit": "PanelSeoAuditButton",
  "deploy-trigger": "PanelDeployTriggerButton",
};

const buttons = computed(() =>
  (props.buttons ?? []).map((button, index) => {
    if (typeof button === "string") return button;
    if ("component" in button) return { key: index, ...button };
    if (button.plugin) {
      const { plugin, ...pluginProps } = button;
      return {
        key: index,
        component: PLUGIN_BUTTON_COMPONENTS[plugin],
        props: pluginProps,
      };
    }
    if ("status" in button)
      return { key: index, props: pageStatusButton(button.status) };

    // Kirby's `ViewButton` defaults `responsive` to `true`.
    return { key: index, props: { responsive: true, ...button } };
  }),
);

// Mirrors Kirby's `PageStatusButton` for a page whose blueprint keeps the
// default status label.
function pageStatusButton(status: PanelPageStatus) {
  const text = translate(`page.status.${status}`);
  const theme = { draft: "negative", unlisted: "info", listed: "positive" }[
    status
  ];

  return {
    icon: `status-${status}`,
    style: "--icon-size: 15px",
    text,
    title: `${translate("page.status")}: ${text}`,
    theme: `${theme}-icon`,
    responsive: true,
  };
}
</script>

<template>
  <k-header class="panel-view-header">
    {{ title }}

    <template #buttons>
      <k-view-buttons :buttons="buttons">
        <template v-if="hasDiff" #after>
          <k-form-controls
            has-diff
            @discard="emit('discard')"
            @submit="emit('save')"
          />
        </template>
      </k-view-buttons>
    </template>
  </k-header>
</template>

<style>
/* Kirby pads the header itself and reserves a gap below it for the view. A Mock that
   stages the header alone shows no view, so the gap goes and Kirby's own padding
   stands in for the stage's. */
.panel-mock .panel-view-header:last-child {
  margin-bottom: 0;
}

.panel-mock
  .panel-mock-stage:has(
    > .panel-view-header,
    > .panel-mock-view > .panel-view-header
  ) {
  padding-top: 0;
}

/* Kirby keeps title and buttons on one line from a 70rem viewport up, but the
   Mock is a box a few hundred pixels wide inside such a viewport. It wraps on
   its own width instead. */
@media screen and (min-width: 70rem) {
  .panel-mock .panel-view-header {
    flex-wrap: wrap;
  }
}

@container panel-stage (min-width: 40rem) {
  .panel-mock .panel-view-header {
    flex-wrap: nowrap;
  }
}
</style>
