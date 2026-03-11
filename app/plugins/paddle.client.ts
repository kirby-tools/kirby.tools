import { initializePaddle } from "@paddle/paddle-js";

export default defineNuxtPlugin(async () => {
  const { paddle } = useRuntimeConfig().public;

  const paddleInstance = await initializePaddle({
    environment: import.meta.dev ? "sandbox" : "production",
    token: paddle.clientToken,
    ...(import.meta.dev && {
      eventCallback(event) {
        // eslint-disable-next-line no-console
        console.log("Paddle event:", event);
      },
    }),
  });

  return {
    provide: {
      paddle: paddleInstance,
    },
  };
});
