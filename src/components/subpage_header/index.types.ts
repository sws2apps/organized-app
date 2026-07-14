import { ReactNode } from 'react';

/**
 * Props for the {@link SubpageHeader}.
 */
export type SubpageHeaderProps = {
  /**
   * Main title.
   */
  title: string;

  /**
   * Optional secondary line shown under the title. Defaults to the parent
   * page's navbar title when omitted, so an overlay shows where it belongs.
   */
  secondaryTitle?: string;

  /**
   * Called when the back button is pressed.
   */
  onBack: () => void;

  /**
   * Accessible label for the back button.
   */
  backLabel?: string;

  /**
   * Optional action rendered at the trailing edge (e.g. a settings icon
   * button). When omitted, a spacer keeps the title centered on mobile.
   */
  trailing?: ReactNode;
};
