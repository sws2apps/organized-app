import { styled } from '@mui/system';
import { Select } from '@mui/material';

const SelectStyled = styled(Select)({
  '.MuiSelect-select p': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '.MuiSelect-icon': {
    color: 'var(--black)',
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
});

export default SelectStyled;
