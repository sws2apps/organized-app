import { Path, Svg } from '@react-pdf/renderer';
import { CustomDutyIconType } from '@definition/duties';
import {
  CUSTOM_DUTY_ICONS,
  resolveCustomDutyIcon,
} from '@constants/duty_icons';
import { IconProps } from '@views/components/icons/index.types';
import IconDuties from '@views/components/icons/IconDuties';

const IconCustomDuty = ({
  icon,
  size = 24,
  color = '#222222',
}: IconProps & { icon?: CustomDutyIconType }) => {
  const value = resolveCustomDutyIcon(icon);
  if (value === 'default') return <IconDuties size={size} color={color} />;
  return (
    <Svg width={size} height={size} viewBox="0 -960 960 960">
      <Path d={CUSTOM_DUTY_ICONS[value].path} fill={color} />
    </Svg>
  );
};

export default IconCustomDuty;
