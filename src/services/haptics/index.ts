import { WebHaptics } from 'web-haptics';
import { store } from '@states/index';
import { hapticsEnabledState } from '@states/settings';
import { HAPTIC_PATTERNS, type HapticIntent } from './patterns';

export type { HapticIntent } from './patterns';

// Single instance: web-haptics appends a DOM element for its iOS fallback.
const engine = new WebHaptics();

export const haptic = (intent: HapticIntent) => {
  try {
    if (!store.get(hapticsEnabledState)) return;

    void engine.trigger(HAPTIC_PATTERNS[intent]);
  } catch {
    // never let a non-essential enhancement break the interaction
  }
};
