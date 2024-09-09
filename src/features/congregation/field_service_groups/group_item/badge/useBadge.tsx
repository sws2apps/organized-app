import { useMemo } from 'react';
import { GroupBadgeProps } from './index.types';

const useBadge = ({ group, index }: GroupBadgeProps) => {
  const bg_color = useMemo(() => {
    const css = `--group-${index}`;
    return `var(${css})`;
  }, [index]);

  const members_count = useMemo(() => {
    return group.group_data.members.length;
  }, [group]);

  return { bg_color, members_count };
};

export default useBadge;
