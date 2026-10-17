import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';

export const StyledIconButton = styled(IconButton)({
  borderRadius: 'var(--radius-max)',
  '&:hover': {
    backgroundColor: 'var(--accent-150)',
  },
});
