import { ChangeEvent } from 'react';

interface HandleBooleans {
  (
    e: ChangeEvent<HTMLInputElement>,
    setFunction: (value: boolean) => void
  ): void;
}

const handleBoolean: HandleBooleans = (e, setFunction) => {
  setFunction(e.target.checked);
};

interface HandleNumbers {
  (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    setFunction: (value: number) => void
  ): void;
}

const handleNumber: HandleNumbers = (e, setFunction) => {
  setFunction(Number(e.target.value.replaceAll(/\D/g, '')));
};

const textFieldSelectStyles = {
  SelectProps: {
    MenuProps: {
      sx: {
        '.MuiPaper-root': {
          backgroundColor: 'var(--white)',
          borderColor: 'var(--accent-200)',
          color: 'var(--black)',
        },
      },
    },
  },
  sx: {
    '.MuiOutlinedInput-root': {
      borderRadius: 'var(--radius-l)',
      paddingRight: '8px',
      color: 'var(--black)',
      '& svg': {
        color: 'var(--accent-350)',
      },
      '&.Mui-focused svg': {
        color: 'var(--black)',
      },
      '& fieldset': {
        border: '1px solid var(--accent-350)',
      },
      '&:hover fieldset': {
        border: '1px solid var(--accent-main)',
      },
      '&.Mui-focused fieldset': {
        border: '1px solid var(--accent-main)',
      },
    },
    '.MuiInputLabel-root': {
      color: 'var(--accent-350)',
      '&.Mui-focused': {
        color: 'var(--accent-main)',
      },
    },
  },
};

export { handleBoolean, handleNumber, textFieldSelectStyles };
