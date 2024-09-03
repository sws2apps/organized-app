import { FC } from 'react';
import { Select, SelectProps, styled } from '@mui/material';

const SelectStyled: FC<SelectProps> = styled(Select)({
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
