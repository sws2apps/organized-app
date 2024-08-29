import { TimeFieldProps } from './index.types';
import useTimeField from './useTimeField';
import TextField from '@components/textfield';

const TimeField = (props: TimeFieldProps) => {
  const { handleKeyDown, inputRef, handleClick, handleBlur } =
    useTimeField(props);

  return (
    <TextField
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onBlur={handleBlur}
      onDragStart={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
      placeholder="H:MM"
      inputProps={{
        maxLength: 7,
        ref: inputRef,
        className: props.className,
        style: {
          color: props.value === '0:00' ? 'var(--accent-350)' : 'var(--black)',
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
