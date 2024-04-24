import { TextField } from '@mui/material';
import { SelectPropsType } from './index.types';
import { Theme } from '@mui/material/styles/createTheme';

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
    <TextField
      {...props}
      fullWidth={fullWidth}
      required={required}
      label={label}
      value={props.value}
      onChange={props.onChange}
      select
      sx={{
        '& .MuiSelect-icon': {
          color: 'var(--black) !important', // change the color of the dropdown icon
        },
        '.MuiInputBase-root': {
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
        '.MuiInputBase-input': {
          paddingTop: `calc(14.5px - ${varHeight}px)`,
          paddingBottom: `calc(14.5px - ${varHeight}px)`,
          flex: '1 0 0',

          '&.MuiSelect-select': {
            minHeight: 'unset',
          },
        },
        '.MuiOutlinedInput-root': {
          borderRadius: 'var(--radius-l)',
          color: 'var(--black)',
          '& svg': {
            color: 'var(--accent-350)',
            boxSizing: 'content-box',
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
        '.MuiFormLabel-root[data-shrink=false]': { top: `-${varHeight}px` },
        '.MuiTypography-root': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        ...props.sx,
      }}
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
    </TextField>
  );
};

export default CustomSelect;
