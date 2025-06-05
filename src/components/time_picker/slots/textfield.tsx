import { forwardRef, Ref } from 'react';
import { PickersTextField, PickersTextFieldProps } from '@mui/x-date-pickers';

const InputTextField = forwardRef(function DatePickerInputField(
  props: PickersTextFieldProps,
  ref: Ref<HTMLDivElement>
) {
  const heightLocal = 44;

  const varHeight = (56 - heightLocal) / 2;

  return (
    <PickersTextField
      {...props}
      fullWidth
      className="body-regular"
      ref={ref}
      sx={{
        '.MuiPickersInputBase-root': {
          height: `${heightLocal}px`,
          paddingTop: 'auto',
          paddingBottom: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
        '.MuiPickersInputBase-input': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingTop: `calc(14.5px - ${varHeight}px)`,
          paddingBottom: `calc(14.5px - ${varHeight}px)`,
          flex: '1 0 0',
          color:
            props.value || props.inputProps['value']
              ? 'var(--black)'
              : 'var(--accent-400)',
          cursor: props.disabled && 'not-allowed',
        },
        '.MuiPickersInput-root:before': {
          borderBottom: '1px solid var(--accent-300) !important',
        },
        '.MuiPickersInput-root:after': {
          borderBottom: '1px solid var(--accent-main)',
        },
        '.MuiPickersInput-root:hover:before': {
          borderBottom: '1px solid var(--accent-main)',
          outline: 0,
        },
        '.MuiPickersOutlinedInput-root': {
          borderRadius: 'var(--radius-l)',
          color: 'var(--black)',
          '& svg': {
            boxSizing: 'content-box',
          },
          '& fieldset': {
            border: '1px solid var(--accent-350)',
          },
          '&:hover fieldset': {
            border: '1px solid var(--accent-main)',
          },
          '&.Mui-focused fieldset': {
            border: '1px solid var(--accent-main) !important',
          },
          '&.Mui-error': {
            '&:hover fieldset': {
              border: '1px solid var(--red-main)',
            },
            '&.Mui-focused fieldset': {
              border: '1px solid var(--red-main)',
            },
          },

          '&.Mui-disabled fieldset': {
            border: '1px solid var(--accent-200)',
          },
        },
        '.MuiInputLabel-root': {
          color: !props.disabled ? 'var(--accent-350)' : 'var(--accent-200)',
          '&.Mui-focused': {
            color: 'var(--accent-350)',
          },
          '&.Mui-error': {
            color: 'var(--red-main)',
          },
        },

        '& .MuiSvgIcon-root': {
          fill: 'var(--accent-350)',
          '& g, & g path': {
            fill: 'var(--accent-350) !important',
          },
        },

        '.MuiFormLabel-root[data-shrink=false]': { top: `-${varHeight}px` },
        '& > .MuiAutocomplete-popupIndicator': {
          '& svg, & svg g, & svg g path': { fill: 'var(--black)' },
        },
      }}
    />
  );
});

export default InputTextField;
