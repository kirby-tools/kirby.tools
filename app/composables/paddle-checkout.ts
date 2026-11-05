import type { CheckoutOpenOptions, Paddle } from "@paddle/paddle-js";
import { initializePaddle } from "@paddle/paddle-js";

let paddlePromise: Promise<Paddle | undefined> | undefined;

export function usePaddleCheckout() {
  const { paddle } = useRuntimeConfig().public;

  async function openCheckout(options: CheckoutOpenOptions) {
    paddlePromise ??= initializePaddle({
      environment: import.meta.dev ? "sandbox" : "production",
      token: paddle.clientToken,
      ...(import.meta.dev && {
        eventCallback(event) {
          // eslint-disable-next-line no-console
          console.log("Paddle event:", event);
        },
      }),
    });

    try {
      const paddleInstance = await paddlePromise;
      if (!paddleInstance) throw new Error("Paddle.js not available");
      paddleInstance.Checkout.open(options);
    } catch (error) {
      paddlePromise = undefined;
      console.warn(error);
    }
  }

  return { openCheckout };
}
