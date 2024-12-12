import { TimeFieldProps } from './index.types';
import useTimeField from './useTimeField';
import TextField from '@components/textfield';

const TimeField = (props: TimeFieldProps) => {
  const { handleKeyDown, inputRef, handleClick, handleBlur, handleWheel } =
    useTimeField(props);

  return (
    <TextField
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onBlur={handleBlur}
      onDragStart={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
      placeholder="0:00"
      slotProps={{
        htmlInput: {
          maxLength: 7,
          ref: inputRef,
          className: props.className,
          inputMode: 'numeric',
          pattern: '[0-9]*',
          style: {
            color:
              props.value === '0:00' ? 'var(--accent-350)' : 'var(--black)',
          },
        },
      }}
      sx={{
        ...props.sx,
        '.MuiInputBase-input': {
          textAlign: 'center',
        },
        '.MuiOutlinedInput-root': {
          paddingRight: 'unset !important',
        },
        '& fieldset': {
          border: 'none',
        },
      }}
    />
  );
};

export default TimeField;
