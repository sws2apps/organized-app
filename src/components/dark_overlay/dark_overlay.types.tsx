import { ReactNode } from 'react';

/**
 * Props for DarkOverlay component.
 */
export type DarkOverlayProps = {
  /**
   * The content to be displayed within the dark overlay.
   */
  children?: ReactNode;

  /**
   * Specifies whether the overlay is opened or not.
   */
  overlayIsOpened: boolean;
};
