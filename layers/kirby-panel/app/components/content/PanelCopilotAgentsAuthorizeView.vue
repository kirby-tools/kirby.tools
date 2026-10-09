<script setup lang="ts">
import { translate } from "#panel-mock/translate";
import "#kirby-panel/components/Dialogs/Dialog.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Body.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Footer.vue?vue&type=style&index=0&lang.css";

defineProps<{
  site: string;
  account: string;
  client: { name: string; host: string };
  redirect: { label: string };
}>();

const PERMISSIONS = [
  {
    value: "content:read",
    text: "Read content",
    info: "Pages, files, and fields you can access",
    disabled: true,
  },
  {
    value: "content:prepare",
    text: "Prepare changes",
    info: "New drafts and unsaved changes you review and publish – and discarding anyone’s unsaved changes",
  },
  {
    value: "content:publish",
    text: "Publish changes",
    info: "Publish anyone’s unsaved changes, change a page’s status, and upload files (live at once)",
  },
  {
    value: "content:delete",
    text: "Delete content",
    info: "Delete pages and files",
  },
];

const selectedPermissions = ref(["content:read", "content:prepare"]);
</script>

<template>
  <div class="panel-copilot-agents-authorize-view k-dialog">
    <div class="k-dialog-body [&>*+*]:mt-[var(--spacing-6)]">
      <header class="[&>*+*]:mt-[var(--spacing-2)]">
        <k-headline tag="h1">
          Connect {{ client.host }} to {{ site }}?
        </k-headline>
        <k-text v-if="client.name !== client.host">
          <p>{{ client.name }}</p>
        </k-text>
      </header>

      <k-text>
        <p>
          The agent works as {{ account }}, within the permissions of your role.
        </p>
      </k-text>

      <k-checkboxes-input
        :options="PERMISSIONS"
        :value="selectedPermissions"
        @input="selectedPermissions = $event"
      />

      <k-box
        theme="info"
        :text="`Afterwards, you return to ${redirect.label}.`"
      />
    </div>

    <footer class="k-dialog-footer">
      <k-button-group layout="collapsed" class="justify-end">
        <k-button :text="translate('cancel')" variant="filled" />
        <k-button
          icon="check"
          text="Connect"
          theme="positive"
          variant="filled"
        />
      </k-button-group>
    </footer>
  </div>
</template>

<style>
/* The stage stands in for `k-panel-outside`. */
.panel-mock .panel-mock-stage:has(> .panel-copilot-agents-authorize-view) {
  display: grid;
  place-items: center;
}
</style>
