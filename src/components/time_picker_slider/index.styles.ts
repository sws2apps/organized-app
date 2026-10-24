import { CSSProperties } from 'react';
import { SxProps, Theme } from '@mui/material';

export const CASE_SIZE = 40;

export const TimePickerTypography: SxProps<Theme> = {
  fontSize: '18px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  color: 'var(--black)',
  userSelect: 'none',
};

export const WheelStyle: SxProps<Theme> = {
  position: 'relative',
  width: CASE_SIZE,
  height: CASE_SIZE * 3,
  isolation: 'isolate',
  backgroundColor: 'var(--white)',
};

export const WheelHighlightStyle: SxProps<Theme> = {
  position: 'absolute',
  inset: `${CASE_SIZE}px 0`,
  backgroundColor: 'var(--accent-150)',
  borderRadius: 'var(--radius-s)',
};

// Colors the rows by blending over them, so the highlight never lags behind
// the scroll the way a scroll-driven text color does.
export const WheelTintStyle: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  mixBlendMode: 'lighten',
  background: `linear-gradient(to bottom, var(--grey-200) ${CASE_SIZE - 4}px, var(--accent-main) ${CASE_SIZE + 4}px, var(--accent-main) ${CASE_SIZE * 2 - 4}px, var(--grey-200) ${CASE_SIZE * 2 + 4}px)`,
  '[data-theme$="dark"] &': { mixBlendMode: 'darken' },
};

export const WheelScrollerStyle: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  paddingBlock: `${CASE_SIZE}px`,
  scrollbarWidth: 'none',
  borderRadius: 'var(--radius-s)',
  maskImage:
    'linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)',
  '&::-webkit-scrollbar': { display: 'none' },
  '&:focus-visible': { outline: '2px solid var(--accent-main)' },
  '& > div': {
    height: CASE_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
};

export const TimePickerContainerStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const TimePickerArrowStyle: CSSProperties = {
  color: '#757575',
  cursor: 'pointer',
  height: CASE_SIZE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const TimePickerSelectorStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};
