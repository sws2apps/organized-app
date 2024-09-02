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

export const ActiveCaseFilter: SxProps<Theme> = {
  position: 'absolute',
  pointerEvents: 'none',
  backgroundColor: 'var(--accent-150)',
  borderRadius: 'var(--radius-s)',
  height: CASE_SIZE,
  width: CASE_SIZE,
  top: '50%',
  transform: 'translateY(-50%)',
  left: 0,
  right: 0,
};

export const TimePickerCaseStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: CASE_SIZE,
  width: CASE_SIZE,
  flexShrink: 0,
  scrollSnapAlign: 'center',
};

export const CaseContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  overflowY: 'scroll',
  zIndex: 1,
  scrollSnapType: 'y mandatory',
  maxHeight: CASE_SIZE * 3,
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  position: 'relative',
  userSelect: 'none',
};

export const TimePickerContainerStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  '*::-webkit-scrollbar': {
    display: 'none',
  },
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
  position: 'relative',
};
