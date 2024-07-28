import { TextField } from '@mui/material';
import { CustomTextareaProps } from './textarea.types';

/**
 * CustomTextarea Component
 *
 * A customized text area component built on top of MUI TextField.
 *
 * @param {CustomTextareaProps} props - Props for CustomTextarea component.
 * @returns {JSX.Element} - JSX element representing the CustomTextarea component.
 */
const CustomTextarea = (props: CustomTextareaProps) => {
  return (
    <TextField
      multiline
      placeholder={props.placeholder}
      className="body-regular"
      onChange={props.onChange}
      sx={{
        width: '100%',
        minHeight: '90px',
        '.MuiInputBase-root': {
          borderRadius: 'var(--radius-l)',
          height: '100%',
          alignItems: 'flex-start',
        },
        '.MuiInputBase-input': {
          color: 'var(--black)',
        },

        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'var(--accent-300)',
          },
          '&:hover fieldset': {
            borderColor: 'var(--accent-main)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--accent-main)',
            color: 'var(--accent-main)',
          },
        },
      }}
    />
  );
};

export default CustomTextarea;
