import { FC } from 'react';
import { Switch as MUISwitch, SwitchProps } from '@mui/material';
import { IconOffCircle, IconOnCircle } from '@icons/index';

const Switch: FC<SwitchProps> = (props) => {
  return (
    <MUISwitch
      disableRipple
      icon={<IconOffCircle width={14} height={14} color="var(--accent-300)" />}
      checkedIcon={
        <IconOnCircle width={18} height={18} color="var(--accent-main)" />
      }
      {...props}
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
        ...props.sx,
      }}
    />
  );
};

export default Switch;
