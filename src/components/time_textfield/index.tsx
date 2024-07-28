import { StyledCustomTimeTextField } from './time_textfield.styles';
import { CustomTimeTextFieldProps } from './time_textfield.types';

/**
 * CustomTimeTextField Component
 *
 * A custom-styled text field specifically for time input.
 *
 * @component
 * @example
 * // Usage example:
 * <CustomTimeTextField value="12:00" onChange={handleTimeChange} color="red" />
 *
 * @param {Object} props - The props for CustomTimeTextField component.
 *
 * @returns {JSX.Element} The rendered time input component.
 */
const CustomTimeTextField = (props: CustomTimeTextFieldProps) => {
  return (
    <StyledCustomTimeTextField
      type="time"
      value={props.value}
      onChange={props.onChange}
      fontColor={props.color}
    />
  );
};

export default CustomTimeTextField;
