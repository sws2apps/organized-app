import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const StyledCircleBox = styled(Box)({
    height: '156px',
    width: '156px',
    backgroundColor: 'var(--always-white-base)',
    borderRadius: 'var(--radius-xxl, 16px)',
    display: 'flex',
    padding: '24px 40px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 16px 24px 0px rgba(28, 28, 28, 0.16)',
    gap: '16px',
});
