import type PanelNotification from "../components/content/PanelNotification.vue";

// Kirby closes any notification but an error after four seconds.
const NOTIFICATION_TIMEOUT = 4000;

export type PanelNotificationProps = InstanceType<
  typeof PanelNotification
>["$props"];

export function usePanelNotification() {
  const notification = ref<PanelNotificationProps>();

  const { start: startTimeout, stop: stopTimeout } = useTimeoutFn(
    close,
    NOTIFICATION_TIMEOUT,
    { immediate: false },
  );

  function open(value: PanelNotificationProps) {
    notification.value = value;
    startTimeout();
  }

  function close() {
    stopTimeout();
    notification.value = undefined;
  }

  return { notification, open, close };
}
