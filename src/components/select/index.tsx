import { FormControl, InputLabel } from '@mui/material';
import { Theme } from '@mui/material/styles/createTheme';
import { SelectPropsType } from './index.types';
import SelectStyled from './index.styles';

/**
 * Custom select component.
 *
 * @param props The props for the CustomSelect component.
 * @returns A custom select input field.
 */
const Select = (props: SelectPropsType) => {
  return (
    <FormControl fullWidth sx={props.sx}>
      <InputLabel
        className="body-regular"
        sx={{
          color: 'var(--accent-350)',
          '&.Mui-focused': { color: 'var(--accent-main)' },
          '&[data-shrink=false]': { top: `-8px` },
          marginTop: '2px',
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
