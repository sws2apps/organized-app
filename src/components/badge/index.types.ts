import { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';
import { BadgeColor, CustomClassName } from '@definition/app';

/**
 * Props type for the Badge component.
 */
export type BadgePropsType = {
  className?: CustomClassName;
  /**
   * Size of the badge.
   */
  size: 'small' | 'medium' | 'big';

  /**
   * Indicates whether the badge is filled.
   */
  filled?: boolean;

  /**
   * Text displayed on the badge.
   */
  text: string;

  /**
   * Color of the badge.
   */
  color: BadgeColor;

  /**
   * Indicates whether the badge should occupy full width.
   */
  fullWidth?: boolean;

  /**
   * Indicates whether the badge should adjust to multiple lines.
   */
  multiLine?: boolean;

  /**
   * Indicates whether the badge content should be centered.
   */
  centerContent?: boolean;

  /**
   * Border style of the badge.
   */
  borderStyle?: 'dashed' | 'solid';

  /**
   * Icon displayed on the badge.
   */
  icon?: ReactElement;

  /**
   * Custom styles for the badge.
   */
  sx?: SxProps<Theme>;

  /**
   * Key for the badge.
   */
  key?: number | string;

  faded?: boolean
};

/**
 * Props type for the typography component within the Badge.
 */
export type BadgeTypographyPropsType = PropsWithChildren & {
  /**
   * Custom styles for the typography component.
   */
  sx?: SxProps<Theme>;

  className?: CustomClassName;
};

/**
 * Props type for the content component within the Badge.
 */
export type BadgeContentPropsType = {
  /**
   * Color of the content.
   */
  color: string;

  /**
   * Children elements to be rendered within the content component.
   */
  children: ReactNode;

  /**
   * Icon displayed within the content component.
   */
  icon?: ReactElement;

  /**
   * Height of the icon.
   */
  iconHeight: string;

  /**
   * Width of the icon.
   */
  iconWidth: string;
};
