// Repeated along a typed text, so the keystrokes keep an uneven pace.
const KEYSTROKE_DURATIONS = [80, 100, 65, 115, 85, 70];

/**
 * Looks up the milliseconds from the keystroke before the one at `index` to it.
 */
export function keystrokeDuration(index: number) {
  return KEYSTROKE_DURATIONS[index % KEYSTROKE_DURATIONS.length]!;
}

/** Sums the milliseconds the first `keystrokeCount` keystrokes take. */
export function sumKeystrokeDurations(keystrokeCount: number) {
  let duration = 0;
  for (let index = 0; index < keystrokeCount; index++)
    duration += keystrokeDuration(index);
  return duration;
}
