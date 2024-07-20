import { Theme } from '@mui/material/styles/createTheme';
import { SelectPropsType } from './types';
import StyledTextField from './styled';

/**
 * Custom select component.
 *
 * @param props The props for the CustomSelect component.
 * @returns A custom select input field.
 */
const CustomSelect = (props: SelectPropsType) => {
  const label = props.label || '';
  const className = props.className || '';
  const startIcon = props.startIcon || null;
  const endIcon = props.endIcon || null;
  const required = props.required || false;
  const height = props.height || 44;
  const fullWidth = props.fullWidth ?? true;

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
                  backgroundColor: 'var(--accent-100)',
                },
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
    </StyledTextField>
  );
};

export default CustomSelect;
