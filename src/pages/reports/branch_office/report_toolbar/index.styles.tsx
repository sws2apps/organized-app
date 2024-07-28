import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Select, Button } from '@components/index';

export const StyledSelect = styled(Select)({
  flex: 1,
});

export const StyledButton = styled(Button)({
  flex: 1,
});

export const StyledBox = styled(Box)(
  ({ laptopView }: { laptopView: boolean }) => ({
    display: 'flex',
    gap: '16px',
    flexDirection: laptopView ? 'row' : 'column',
  })
);
