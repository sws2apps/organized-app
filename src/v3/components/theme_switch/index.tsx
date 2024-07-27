import { Box, Switch } from '@mui/material';
import { IconNight, IconSun, IconToggle } from '@icons/index';

/**
 * A custom theme switch component.
 *
 * @param {object} props - The props for the CustomThemeSwitch component.
 * @param {boolean} props.checked - The checked state of the switch.
 * @param {function} props.onChange - The function to handle the change event.
 * @returns {JSX.Element} - JSX.Element
 */
const CustomThemeSwitch = ({
  checked,
  onChange = () => null,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '40px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        justifyContent: 'center',
        borderRadius: 'var(--radius-max)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '3px',
          top: '3px',
          transform: 'translateY(100%)',
          opacity: 0,
          zIndex: 10,
          animation: checked
            ? 'fade-in-top 0.25s ease-in-out forwards'
            : 'fade-out-top 0.25s ease-in-out forwards',
          cursor: 'pointer',
        }}
        onClick={() => onChange(!checked)}
      >
        <IconNight color="white" width={18} height={19} />
      </Box>

      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
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
            opacity: 1,
          },
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          right: '3px',
          top: '1px',
          transform: 'translateY(0)',
          opacity: 1,
          zIndex: 10,
          animation: checked
            ? 'fade-out-bottom 0.25s ease-in-out forwards'
            : 'fade-in-bottom 0.25s ease-in-out forwards',
          cursor: 'pointer',
        }}
        onClick={() => onChange(!checked)}
      >
        <IconSun color="white" width={14} height={14} />
      </Box>
    </Box>
  );
};

export default CustomThemeSwitch;
