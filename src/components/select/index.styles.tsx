import { styled, Theme } from '@mui/material/styles';
import { Select } from '@mui/material';

export const SelectStyled = styled(Select)({
  '.MuiSelect-select p': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '.MuiSelect-select': {
    color: 'var(--black)',
    display: 'flex',
    alignItems: 'center',
    height: '44px !important',
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
  },
  '.MuiSelect-icon': {
    color: 'var(--black)',
    '&.Mui-disabled': {
      color: 'var(--accent-200)',
    },
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--accent-350)',
    borderRadius: 'var(--radius-l)',
  },
  '&.Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderWidth: '1px',
      borderColor: 'var(--accent-main)',
    },
  },
  '&:hover': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--accent-350)',
    },
  },
  '&.Mui-disabled': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--accent-200)',
    },
  },
});

export const dropdownPaper = (theme: Theme) => ({
  background: 'var(--white)',
  backgroundColor: 'var(--white)',
  borderRadius: 'var(--radius-l)',
  border: '1px solid var(--accent-200)',
  padding: '8px 0px',
  marginTop: '2px',
  maxHeight: '232px',
  '& ul': {
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  '& li': {
    position: 'relative',
    boxSizing: 'border-box',
    borderBottom: '1px solid var(--accent-200)',
    color: 'var(--black)',
  },
  '& li:last-child': {
    borderBottom: 'none',
  },
  [theme.breakpoints.down('tablet')]: {
    marginLeft: '-4px',
  },

  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
});
