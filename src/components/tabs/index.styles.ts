import { SxProps, Theme } from '@mui/material';
import { TabsAppearance } from './index.types';

// no default here on purpose: each tabs component states its own, so a missing
// prop cannot quietly pick an appearance for the caller
export const tabsSharedStyles = (
  appearance: TabsAppearance
): SxProps<Theme> => {
  const radius =
    appearance === 'chip' ? 'var(--radius-max)' : 'var(--radius-s)';

  return {
    '& .MuiTab-root': {
      borderRadius: radius,
      textTransform: 'none',
      transition: 'background-color 0.2s',
    },
    '& .MuiTab-root:hover': {
      backgroundColor: 'color-mix(in srgb, var(--accent-150) 38%, transparent)',
    },
    '& button.Mui-selected': {
      color: 'var(--accent-main)',
      background: appearance === 'chip' ? 'var(--accent-150)' : 'unset',
    },
    '& button:not(.Mui-selected)': {
      color: 'var(--grey-350)',
    },
    '& .MuiTouchRipple-root': {
      borderRadius: radius,
    },
    '& span.MuiTouchRipple-rippleVisible': {
      color: 'var(--accent-main)',
    },
  };
};
