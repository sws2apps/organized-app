import { SvgIcon, SvgIconProps } from '@mui/material';
import {
  CUSTOM_DUTY_ICONS,
  resolveCustomDutyIcon,
} from '@constants/duty_icons';
import { CustomDutyIconType } from '@definition/duties';
import IconDuties from '@components/icons/IconDuties';

type IconCustomDutyProps = {
  icon?: CustomDutyIconType;
  color?: string;
  size?: number;
  sx?: SvgIconProps['sx'];
};

const IconCustomDuty = ({
  icon,
  color = 'var(--accent-dark)',
  size = 24,
  sx,
}: IconCustomDutyProps) => {
  const value = resolveCustomDutyIcon(icon);
  if (value === 'default')
    return <IconDuties width={size} height={size} color={color} sx={sx} />;

  return (
    <SvgIcon
      viewBox="0 -960 960 960"
      aria-hidden="true"
      sx={{ width: size, height: size, color, ...sx }}
    >
      <path d={CUSTOM_DUTY_ICONS[value].path} fill="currentColor" />
    </SvgIcon>
  );
};

export default IconCustomDuty;
