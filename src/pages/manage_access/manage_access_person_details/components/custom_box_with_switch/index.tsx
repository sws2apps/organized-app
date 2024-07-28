import CustomSwitch from '@components/switch';
import { Box } from '@mui/material';
import { CustomBoxWithSwitchProps } from './custom_box_with_switch.types';
import CustomTypography from '@components/typography';

/**
 * CustomBoxWithSwitch Component
 *
 * This component renders a box containing a custom switch and a label.
 *
 * @param {CustomBoxWithSwitchProps} props - The props for the component.
 * @returns {JSX.Element} The rendered CustomBoxWithSwitch component.
 */
const CustomBoxWithSwitch = (props: CustomBoxWithSwitchProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <CustomSwitch checked={props.checked} onChange={props.onChange} />
      <CustomTypography className="body-regular" color={'var(--black)'}>
        {props.label}
      </CustomTypography>
    </Box>
  );
};

export default CustomBoxWithSwitch;
