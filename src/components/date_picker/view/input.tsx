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
          paddingLeft: '12px',
          paddingRight: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        },
        '.MuiPickersInputBase-sectionsContainer': {
          display: 'block',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        // The section list must fill the space left after the icon button, not
        // its intrinsic content width, or the sections overflow and push the
        // calendar icon outside the outlined input (invisible icon).
        '.MuiPickersSectionList-root': {
          flex: '1 1 auto',
          overflow: 'hidden',
          minWidth: 0,
        },
        '.MuiPickersInputBase-input': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          paddingTop: `calc(14.5px - ${varHeight}px)`,
          paddingBottom: `calc(14.5px - ${varHeight}px)`,
          paddingLeft: '0px',
          paddingRight: '0px',
          flex: '1 0 0',
          color:
            props.value || props.inputProps['value']
              ? 'var(--black)'
              : 'var(--accent-400)',
          cursor: props.disabled && 'not-allowed',
        },
        '.MuiInputAdornment-root': {
          margin: 0,
          // Never shrink: the icon button keeps its full width no matter how
          // narrow the field becomes.
          flexShrink: 0,
        },
        '.MuiInput-root:before': {
          borderBottom: '1px solid var(--accent-300) !important',
        },
        '.MuiInput-root:after': {
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
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
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
