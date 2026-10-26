// Disabled fields stay readable in every color scheme, including WebKit text fill.
export const disabledFieldStyles = {
  '&.Mui-disabled, & .MuiInputBase-root.Mui-disabled, & .MuiPickersInputBase-root.Mui-disabled':
    {
      color: 'var(--grey-350)',
      WebkitTextFillColor: 'var(--grey-350)',
      '& input, & textarea, & .MuiSelect-select, & .MuiTypography-root, & .MuiPickersSectionList-root':
        {
          color: 'var(--grey-350)',
          WebkitTextFillColor: 'var(--grey-350)',
        },
      '& .MuiSvgIcon-root': { color: 'var(--grey-350)' },
      '& .MuiSvgIcon-root path': { fill: 'var(--grey-350) !important' },
    },
  '& .MuiInputLabel-root.Mui-disabled': { color: 'var(--grey-350)' },
};
