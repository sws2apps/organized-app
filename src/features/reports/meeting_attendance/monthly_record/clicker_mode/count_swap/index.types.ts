import { ClickerTab } from '../index.types';

/**
 * Props for the {@link CountSwap} crossfading counter.
 */
export type CountSwapProps = {
  /**
   * Which counter (tab) is currently shown. Changing it crossfades the old
   * count out and the new one in.
   */
  tab: ClickerTab;

  /**
   * Value of the active counter.
   */
  value: number;

  /**
   * Caption rendered above the number.
   */
  label: string;

  /**
   * Bump to trigger a denial shake on the active counter.
   */
  shake?: number;
};
