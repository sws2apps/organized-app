import { FC } from 'react';
import { Radio, RadioProps } from '@mui/material';
import { IconRadioButtonChecked, IconRadioButtonUnchecked } from '@icons/index';

/**
 * Custom radio button component.
 * @param props - Component props.
 * @returns JSX element representing the custom radio button.
 */
const CustomRadio: FC<RadioProps> = (props) => {
  return (
    <Radio
      {...props}
      sx={{
        padding: '4px',
        '&.Mui-disabled': {
          color: 'var(--accent-300)',
        },
      }}
      icon={
        <IconRadioButtonUnchecked
          color={props.disabled ? 'var(--accent-300)' : 'var(--accent-350)'}
        />
      }
      checkedIcon={
        <IconRadioButtonChecked
          color={props.disabled ? 'var(--accent-300)' : 'var(--accent-main)'}
        />
      }
    />
  );
};

export default CustomRadio;
