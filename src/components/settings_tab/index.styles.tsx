import { styled } from '@mui/system';
import { Box, BoxProps, ButtonBase, ButtonBaseProps } from '@mui/material';

export const StyledSettingsTab = styled(ButtonBase)<ButtonBaseProps>({
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
});

export const IndicatorBar = styled(Box)<BoxProps>({
  width: '4px',
  alignSelf: 'stretch',
  backgroundColor: 'var(--accent-main)',
  borderRadius: '2px',
  transition: 'opacity 0.15s ease',
  flexShrink: 0,
});

export const IconWrapper = styled(Box)<BoxProps>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flexShrink: 0,
});

export const TextColumn = styled(Box)<BoxProps>({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
  minWidth: 0,
  paddingTop: '8px',
  paddingBottom: '8px',
});

export const ChevronWrapper = styled(Box)<BoxProps>({
  display: 'flex',
  alignItems: 'center',
  paddingRight: '8px',
  transition: 'opacity 0.15s ease',
});
