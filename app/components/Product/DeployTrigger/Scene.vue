<script setup lang="ts">
import { translate } from "#panel-mock/translate";

const DEPLOY_DURATION = 1500;

const SUCCESS_NOTIFICATION: PanelNotificationProps = {
  text: translate("johannschopplich.deploy-trigger.success"),
};

const isInert = inject(panelMockInertKey, false);
const reducedMotion = usePreferredReducedMotion();
const page = useExhibitionPage();
const { notification, open, close } = usePanelNotification();
const { isPending, start } = useTimeoutFn(notifySuccess, DEPLOY_DURATION, {
  immediate: false,
});

const viewButton = computed<PanelViewButton>(() => ({
  plugin: "deploy-trigger",
  isDeploying: isPending.value,
  click: deploy,
}));

function deploy() {
  if (reducedMotion.value === "reduce") notifySuccess();
  else start();
}

function notifySuccess() {
  open(SUCCESS_NOTIFICATION);
}
</script>

<template>
  <ExhibitionScene
    :page="page"
    :view-button="viewButton"
    :notification="isInert ? SUCCESS_NOTIFICATION : notification"
    :crop="isInert ? undefined : 'hero'"
    @close-notification="close"
  />
</template>
