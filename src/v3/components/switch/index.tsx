import { ChangeEvent } from 'react';
import { Switch } from '@mui/material';
import { IconOffCircle, IconOnCircle } from '@icons/index';

/**
 * Custom Switch component.
 * @param checked - The current state of the switch.
 * @param onChange - The function called when the switch state changes.
 */
const CustomSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      disableRipple
      icon={<IconOffCircle width={14} height={14} color="var(--accent-300)" />}
      checkedIcon={
        <IconOnCircle width={18} height={18} color="var(--accent-main)" />
      }
      sx={{
        padding: 0,
        width: '40px',
        height: '24px',
        '& .MuiSwitch-switchBase': {
          padding: '5px',
          '&.Mui-checked': {
            padding: '3px',
            transform: 'translateX(16px)',
            '& + .MuiSwitch-track': {
              backgroundColor: 'var(--accent-main)',
              border: '1px solid var(--accent-main)',
              opacity: 1,
            },
          },
        },
        '& .MuiSwitch-track': {
          backgroundColor: 'unset',
          border: '1px solid var(--accent-350)',
          borderRadius: 'var(--radius-max)',
        },
      }}
    />
  );
};

export default CustomSwitch;
