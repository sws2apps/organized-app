import type { SxProps } from '@mui/material';
import { GroupBadgeProps } from './index.types';

const useGroupBadge = ({
  color,
  variant = 'solid',
}: Omit<GroupBadgeProps, 'label'>) => {
  const cssGroupColor = color ? `var(--${color})` : 'inherit';
  const cssGroupColorRGBA = color
    ? `rgba(var(--${color}-base), 0.04)`
    : 'transparent';

  const style: SxProps = {
    backgroundColor: variant === 'solid' ? cssGroupColor : cssGroupColorRGBA,
    color: variant === 'solid' ? 'var(--always-white)' : cssGroupColor,
    border: variant === 'outlined' ? `1px solid ${cssGroupColor}` : 'none',
  };

  return { style };
};

export default useGroupBadge;
