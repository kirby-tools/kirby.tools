/** Waits `ms` milliseconds, or rejects with the reason once `signal` aborts. */
export function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal.addEventListener("abort", abort, { once: true });
    function abort() {
      clearTimeout(timer);
      reject(signal.reason);
    }
  });
}
