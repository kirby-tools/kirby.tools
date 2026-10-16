<script setup lang="ts">
import { translate } from "#panel-mock/translate";
import "#kirby-panel/components/Dialogs/Dialog.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Body.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Dialogs/Elements/Footer.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{
  site: string;
  account: string;
  client: { host: string };
  redirect: { label: string };
  defaultPermissions: string[];
  /** What the agent asked for beyond the defaults. The Plugin hands its view these options already labelled in `permissions`; the Mock keeps the options itself, so it takes the values to label. */
  requestedPermissions?: string[];
}>();

// The Plugin posts the answer to its consent route; a Mock hands it to its host.
const emit = defineEmits<{ connect: [permissions: string[]]; cancel: [] }>();

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
    info: "New drafts and unsaved changes you review and publish",
  },
  {
    value: "content:publish",
    text: "Publish changes",
    info: "Publish or discard unsaved changes, change a page’s status, slug, or parent, and upload files to published pages (live at once)",
  },
  {
    value: "content:delete",
    text: "Delete content",
    info: "Delete pages and files",
  },
];

const options = computed(() =>
  PERMISSIONS.map((permission) =>
    props.requestedPermissions?.includes(permission.value)
      ? { ...permission, text: `${permission.text} (requested by the agent)` }
      : permission,
  ),
);

const selectedPermissions = ref([...props.defaultPermissions]);
</script>

<template>
  <div class="panel-copilot-agents-authorize-view k-dialog">
    <div class="k-dialog-body [&>*+*]:mt-[var(--spacing-6)]">
      <k-headline tag="h1">Connect {{ client.host }} to {{ site }}?</k-headline>

      <k-text>
        <p>
          The agent works as {{ account }}, within the permissions of your role.
        </p>
      </k-text>

      <k-checkboxes-input
        :options="options"
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
        <k-button
          :text="translate('cancel')"
          variant="filled"
          @click="emit('cancel')"
        />
        <k-button
          icon="check"
          text="Connect"
          theme="positive"
          variant="filled"
          @click="emit('connect', selectedPermissions)"
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
