import { Theme } from '@mui/material/styles/createTheme';
import { SelectPropsType } from './types';
import StyledTextField from './index.styles';

/**
 * Custom select component.
 *
 * @param props The props for the CustomSelect component.
 * @returns A custom select input field.
 */
const Select = (props: SelectPropsType) => {
  const {
    label = '',
    className = '',
    startIcon = null,
    endIcon = null,
    required = false,
    height = 44,
    fullWidth = true,
    disabled = false,
  } = props;

  const varHeight = (56 - height) / 2;

  return (
    <StyledTextField
      {...props}
      varHeight={varHeight}
      height={height}
      fullWidth={fullWidth}
      required={required}
      label={label}
      value={props.value}
      onChange={props.onChange}
      select
      sx={props.sx}
      InputProps={{
        ...props.InputProps,
        className: className,
        startAdornment: startIcon,
        endAdornment: endIcon,
      }}
      inputProps={{
        disabled,
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
              '& ul': { paddingTop: 0, paddingBottom: 0, gap: '5px' },
              '& li': {
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'var(--accent-150)',
                },
                borderBottom: '1px solid var(--accent-200)',
                '&.Mui-selected p': {
                  color: 'var(--accent-main)',
                },
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
    </StyledTextField>
  );
};

export default Select;
