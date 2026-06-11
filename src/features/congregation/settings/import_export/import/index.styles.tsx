import { FC } from 'react';
import { styled } from '@mui/system';
import { Box, BoxProps } from '@mui/material';

type DropZoneOwnProps = {
  $hasFile?: boolean;
  $isProcessing?: boolean;
};

export const DropZone = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== '$hasFile' && prop !== '$isProcessing',
})<DropZoneOwnProps>(({ $hasFile = false, $isProcessing = false }) => ({
  border: $hasFile
    ? '1px solid var(--accent-300)'
    : '1px dashed var(--accent-dark)',
  borderRadius: 'var(--radius-m)',
  height: '160px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: $isProcessing ? 'default' : 'pointer',
  backgroundColor: $hasFile ? 'var(--accent-150)' : 'transparent',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: $isProcessing ? undefined : 'var(--accent-100)',
  },
})) as unknown as FC<BoxProps & DropZoneOwnProps>;

export const DropZoneContent = styled(Box)({
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
}) as unknown as typeof Box;

export const FileInfoRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '16px',
}) as unknown as typeof Box;
