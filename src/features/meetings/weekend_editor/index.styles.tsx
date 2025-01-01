import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const EditorContainer = styled(Box)({
  borderRadius: 'var(--radius-xl)',
  padding: '16px',
  backgroundColor: 'var(--white)',
  border: '1px solid var(--accent-300)',
  flexGrow: 1,
}) as unknown as typeof Box;
