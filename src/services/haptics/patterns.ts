import type { Vibration } from 'web-haptics';

export type HapticIntent = 'tap' | 'limit' | 'reset';

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

  // Decays over the 500ms reset spin, then a firm pulse as the count lands on 0.
  reset: [
    { duration: 70, intensity: TAP_INTENSITY },
    { duration: 90, intensity: 0.42 },
    { duration: 110, intensity: 0.28 },
    { duration: 120, intensity: 0.16 },
    { duration: 90, intensity: 0.07 },
    { delay: 70, duration: 70, intensity: 1 },
  ],
};
