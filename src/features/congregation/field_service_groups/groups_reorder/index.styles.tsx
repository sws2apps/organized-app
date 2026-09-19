import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const GroupsContainer = styled(Box)({
  width: '100%',
  '.MuiBox-root': {
    borderBottom: '1px solid var(--accent-200)',
  },
  '.MuiBox-root:last-child': {
    borderBottom: 'none',
  },
});
