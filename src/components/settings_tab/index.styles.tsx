import { styled } from '@mui/system';
import { Box, ButtonBase } from '@mui/material';

export const StyledSettingsTab = styled(ButtonBase)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  width: '100%',
  borderRadius: 'var(--radius-s)',
  padding: 0,
  textAlign: 'left',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  '&:hover .chevron-container': {
    opacity: 1,
  },
}) as unknown as typeof ButtonBase;

export const IndicatorBar = styled(Box)({
  width: '4px',
  alignSelf: 'stretch',
  backgroundColor: 'var(--accent-main)',
  borderRadius: '2px',
  transition: 'opacity 0.15s ease',
  flexShrink: 0,
}) as unknown as typeof Box;

export const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flexShrink: 0,
}) as unknown as typeof Box;

export const TextColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
  minWidth: 0,
  paddingTop: '8px',
  paddingBottom: '8px',
}) as unknown as typeof Box;

export const ChevronWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  paddingRight: '8px',
  transition: 'opacity 0.15s ease',
}) as unknown as typeof Box;
