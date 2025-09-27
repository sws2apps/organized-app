import type { SxProps } from '@mui/material';
import { GroupBadgeProps } from './index.types';

const useGroupBadge = ({ color, variant }: Omit<GroupBadgeProps, 'label'>) => {
  const cssGroupColor = `var(--${color})`;
  const cssGroupColorRGBA = `rgba(var(--${color}-base), 0.04)`;
  const style: SxProps = {
    backgroundColor: variant === 'solid' ? cssGroupColor : cssGroupColorRGBA,
    color: variant === 'solid' ? 'var(--always-white)' : cssGroupColor,
    border: variant === 'outlined' ? `1px solid ${cssGroupColor}` : 'none',
  };

  return { style };
};

export default useGroupBadge;
