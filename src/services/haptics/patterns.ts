import type { Vibration } from 'web-haptics';

export type HapticIntent = 'tap' | 'limit' | 'reset' | 'celebrate';

const TAP_INTENSITY = 0.55;

export const HAPTIC_PATTERNS: Record<HapticIntent, Vibration[]> = {
  tap: [{ duration: 10, intensity: TAP_INTENSITY }],

  // Mirrors the 400ms cap-refused shake: four decaying jolts, one every 80ms.
  limit: [
    { duration: 40, intensity: 0.9 },
    { delay: 40, duration: 40, intensity: 0.75 },
    { delay: 40, duration: 40, intensity: 0.6 },
    { delay: 40, duration: 40, intensity: 0.45 },
  ],

  // Decays as the count rolls down, with the firm pulse landing at ~420ms —
  // while the number is still settling onto 0, not after it arrives.
  reset: [
    { duration: 60, intensity: TAP_INTENSITY },
    { duration: 80, intensity: 0.42 },
    { duration: 90, intensity: 0.28 },
    { duration: 90, intensity: 0.16 },
    { duration: 60, intensity: 0.07 },
    { delay: 40, duration: 70, intensity: 1 },
  ],

  // Light "prrr" alongside the confetti burst.
  celebrate: [
    { duration: 12, intensity: 0.35 },
    { delay: 28, duration: 12, intensity: 0.35 },
    { delay: 28, duration: 12, intensity: 0.32 },
    { delay: 28, duration: 12, intensity: 0.28 },
    { delay: 28, duration: 12, intensity: 0.24 },
    { delay: 28, duration: 12, intensity: 0.2 },
  ],
};
