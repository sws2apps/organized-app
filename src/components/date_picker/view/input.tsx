import { forwardRef, Ref } from 'react';
import { PickersTextField, PickersTextFieldProps } from '@mui/x-date-pickers';

const InputTextField = forwardRef(function DatePickerInputField(
  props: PickersTextFieldProps,
  ref: Ref<HTMLDivElement>
) {
  const heightLocal = 44;

  const varHeight = (56 - heightLocal) / 2;

  // Allow consumers to shrink the input via slotProps.textField.sx.height.
  // Guard against array/function sx forms, which can't be inspected.
  const consumerHeight =
    props.sx && !Array.isArray(props.sx) && typeof props.sx === 'object'
      ? (props.sx as { height?: string }).height
      : undefined;
  const customHeight = consumerHeight ?? `${heightLocal}px`;

  return (
    <PickersTextField
      {...props}
      ref={ref}
      fullWidth
      sx={{
        '.MuiPickersInputBase-root': {
          height: customHeight,
          paddingTop: 'auto',
          paddingBottom: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
        // The sections container must grow to fill the space left after the
        // icon button, not to its intrinsic content width.  `width: 'auto'`
        // was removing MUI X's intended `flex: 1` behaviour and letting the
        // sections overflow — which pushed the calendar icon outside the
        // outlined-input's `overflow: hidden` boundary (invisible icon).
        // `overflow: hidden` here clips the date text when the field is narrow
        // instead of letting it spill outside (ellipsis-style clipping).
        '.MuiPickersSectionList-root, .MuiPickersInputBase-sectionsContainer': {
          flex: '1 1 auto',
          overflow: 'hidden',
          minWidth: 0,
        },
        // The icon button must never shrink — it gets its full 40 px regardless
        // of how narrow the field becomes.
        '.MuiInputAdornment-root': {
          flexShrink: 0,
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
            border: '1px solid var(--accent-main)',
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
          // Cover both icon structures:
          // • icons that wrap content in <g><path> (e.g. IconClock with mask)
          // • icons that put <path> directly inside SvgIcon (e.g. IconDate
          //   after the mask-removal refactor)
          '& g, & g path, & path': {
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
