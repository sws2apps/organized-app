import { SxProps, Theme } from '@mui/material';

/**
 * Type definition for the `IconLoading` component props.
 */
export type IconLoadingProps = {
  /** The color of the loading spinner. Defaults to `#222222`. */
  color?: string;

  /** The width of the loading spinner container. Defaults to `24`. */
  width?: number;

  /** The height of the loading spinner container. Defaults to `24`. */
  height?: number;

  /** Additional MUI `sx` styles applied to the spinner. */
  sx?: SxProps<Theme>;
};
