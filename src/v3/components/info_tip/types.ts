import { ReactElement } from 'react';
import { SxProps } from '@mui/material';

export type InfoTipProps = {
  /**
   * Indicates whether the information tip is big or not.
   */
  isBig: boolean;
  /**
   * The text content of the information tip.
   */
  text?: string;
  /**
   * The title of the information tip.
   */
  title?: string;
  /**
   * The icon element to display alongside the text.
   */
  icon?: ReactElement;
  /**
   * The color of the information tip.
   */
  color?: string;
  /**
   * Additional styles for the information tip container.
   */
  sx?: SxProps;
  /**
   * The children elements of the information tip.
   */
  children?: ReactElement;
};
