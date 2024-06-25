import CustomIconButton from '@components/icon_button';
import styled from '@emotion/styled';

export const StyledCustomIconButton = styled(CustomIconButton)({
  borderRadius: 'var(--radius-max)',
  '&:hover': {
    backgroundColor: 'var(--accent-150)',
  },
});
