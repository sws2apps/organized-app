import { FormControl, InputLabel, Theme } from '@mui/material';
import { SelectStyled } from './index.styles';
import { SelectPropsType } from './index.types';

/**
 * Custom select component.
 *
 * @param props The props for the CustomSelect component.
 * @returns A custom select input field.
 */
const Select = (props: SelectPropsType) => {
  return (
    <FormControl fullWidth sx={props.sx} disabled={props.disabled ?? false}>
      <InputLabel
        className="body-regular"
        sx={{
          color: 'var(--accent-350)',
          '&.Mui-focused': { color: 'var(--accent-main)' },
          '&[data-shrink=false]': { top: `-8px` },
          marginTop: '2px',
          '&.Mui-disabled': { color: 'var(--accent-200)' },
        }}
      >
        {props.label}
      </InputLabel>
      <SelectStyled
        {...props}
        size="small"
        fullWidth
        inputProps={{
          ...props.inputProps,
          MenuProps: {
            PaperProps: {
              sx: (theme: Theme) => ({
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
                ...props.MenuProps.PaperProps.sx,
              }),
              className: 'small-card-shadow',
            },
          },
        }}
      >
        {props.children}
      </SelectStyled>
    </FormControl>
  );
};

export default Select;
