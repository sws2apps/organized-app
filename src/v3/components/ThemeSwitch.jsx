import PropTypes from 'prop-types';
import { Switch } from '@mui/material';
import { IconToggle } from '@icons';

const CPEThemeSwitch = ({ checked, onChange }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      disableRipple
      icon={<IconToggle width={18} height={18} />}
      checkedIcon={<IconToggle width={18} height={18} color="white" />}
      sx={{
        padding: 0,
        width: '40px',
        height: '24px',
        '& .MuiSwitch-switchBase': {
          padding: '3px',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            '& + .MuiSwitch-track': {
              backgroundColor: '#000',
              opacity: 1,
            },
          },
          '& svg, & svg g, & svg ellipse, & svg g path': {
            fill: 'white',
            filter: 'drop-shadow(0px 2px 3px rgba(86, 107, 208, 0.16))',
            borderRadius: 'var(--radius-max)',
          },
        },
        '& .MuiSwitch-track': {
          backgroundColor: 'var(--accent-200)',
          borderRadius: 'var(--radius-max)',
        },
      }}
    />
  );
};

CPEThemeSwitch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default CPEThemeSwitch;
