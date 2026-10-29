<script setup lang="ts">
import { AgentsAuthorize } from "#kirby-plugin/copilot";
import { translate } from "#panel-mock/translate";
import "#kirby-panel/components/Dialogs/Dialog.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  site: string;
  account: string;
  client: { host: string };
  redirect: { label: string };
  defaultPermissions: string[];
  /** What the agent asked for beyond the defaults, which the plugin's PHP marks in the labels it sends. */
  requestedPermissions?: string[];
}>();

// The options `ConnectionPermission::options()` sends for a role that may grant
// every permission.
const PERMISSIONS = [
  { value: "content:read", key: "read" },
  { value: "content:prepare", key: "prepare" },
  { value: "content:publish", key: "publish" },
  { value: "content:delete", key: "delete" },
];

const permissions = computed(() =>
  PERMISSIONS.map(({ value, key }) => {
    const text = translate(`johannschopplich.copilot.agents.permission.${key}`);

    return {
      value,
      text: props.requestedPermissions?.includes(value)
        ? translate("johannschopplich.copilot.agents.authorize.requested", {
            permission: text,
          })
        : text,
      info: translate(`johannschopplich.copilot.agents.permission.${key}.info`),
      disabled: value === "content:read",
    };
  }),
);
</script>

<template>
  <AgentsAuthorize
    :site="site"
    :account="account"
    :client="{
      id: client.host,
      name: client.host,
      host: client.host,
      isVerified: true,
    }"
    :redirect="{ type: 'web', label: redirect.label }"
    :permissions="permissions"
    :default-permissions="defaultPermissions"
  />
</template>

<style>
/* Kirby centers the dialog through `.k-panel.k-panel-outside`, whose full-height
   `k-panel` no Mock carries. */
.panel-mock .k-copilot-agents-authorize-view {
  display: grid;
  place-items: center;
}
</style>
