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

export const DefaultCaseFilter: SxProps<Theme> = {
  height: CASE_SIZE,
  display: 'flex',
  alignItems: 'center',
  padding: '8px',
};

export const ActiveCaseFilter: SxProps<Theme> = {
  ...DefaultCaseFilter,
  backgroundColor: 'var(--accent-150)',
  borderRadius: 'var(--radius-s)',
};

export const CaseContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  cursor: 'ns-resize',
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
  scrollBehavior: 'smooth',
};
