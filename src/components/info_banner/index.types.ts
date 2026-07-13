import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';
import { CustomClassName } from '@definition/app';

export type InfoBannerVariant = 'orange' | 'green' | 'red';

export interface InfoBannerProps {
  /** Banner text. Plain strings or markup/JSX both flow inline under the icon. */
  children: ReactNode;
  /** Color scheme of the banner. Defaults to `orange`. */
  variant?: InfoBannerVariant;
  /** Custom leading icon. Defaults to `IconInfo` in the variant color. */
  icon?: ReactNode;
  /** Render a 1px border in the variant color. Defaults to `false`. */
  bordered?: boolean;
  /** Typography class for the text. Defaults to `body-small-regular`. */
  className?: CustomClassName;
  sx?: SxProps<Theme>;
}
