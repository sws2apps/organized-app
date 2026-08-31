import { forwardRef, Ref } from 'react';
import { PickersTextField, PickersTextFieldProps } from '@mui/x-date-pickers';

/** The pixel value an sx `height` resolves to, or null when it can't be known. */
const pixelHeight = (height: string | number): number | null => {
  if (typeof height === 'number') {
    return height > 1 ? height : null;
  }

  const trimmed = height.trim();

  if (!trimmed.endsWith('px')) return null;

  const parsed = Number.parseFloat(trimmed);

  return Number.isFinite(parsed) ? parsed : null;
};

const InputTextField = forwardRef(function DatePickerInputField(
  props: PickersTextFieldProps,
  ref: Ref<HTMLDivElement>
) {
  const heightLocal = 44;

  // Consumers set the height via slotProps.textField.sx; array and function
  // sx forms can't be inspected.
  const consumerHeight =
    props.sx && !Array.isArray(props.sx) && typeof props.sx === 'object'
      ? (props.sx as { height?: unknown }).height
      : undefined;

  const customHeight =
    typeof consumerHeight === 'string' || typeof consumerHeight === 'number'
      ? consumerHeight
      : `${heightLocal}px`;

  // Padding and the label offset follow the rendered height, or a consumer
  // override leaves them misaligned.
  const effectiveHeight = pixelHeight(customHeight) ?? heightLocal;

  const varHeight = (56 - effectiveHeight) / 2;

  return (
    <PickersTextField
      {...props}
      fullWidth
      className="body-regular"
      ref={ref}
      sx={{
        '.MuiPickersInputBase-root': {
          height: customHeight,
          paddingTop: 'auto',
          paddingBottom: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
        // The sections must fill the space left after the icon button, or
        // they overflow and push the clock icon outside the input.
        '.MuiPickersSectionList-root, .MuiPickersInputBase-sectionsContainer': {
          flex: '1 1 auto',
          overflow: 'hidden',
          minWidth: 0,
        },
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
