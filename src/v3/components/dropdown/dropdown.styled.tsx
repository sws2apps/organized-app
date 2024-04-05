import { Box, styled } from '@mui/material';

/**
 * A styled component representing an item box for a dropdown with schools variant.
 */
export const StyledItemBoxForDropdownWithSchools = styled(Box)({
  padding: '8px 12px 8px 16px',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: 'var(--accent-100)',
    '.MuiSvgIcon-root path': {
      fill: 'var(--accent-dark)',
    },
    '.MuiTypography-root': {
      color: 'var(--accent-dark)',
    },
  },

  /* Divider */
  borderBottom: '1px solid var(--accent-200)',
});
