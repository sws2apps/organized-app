import { useMemo } from 'react';
import { GroupItemProps } from './index.types';

const useGroupItem = ({ group, index }: GroupItemProps) => {
  const border_color = useMemo(() => {
    const css = `--group-${index}-base`;

    return `1px solid rgba(var(${css}), 0.48)`;
  }, [index]);

  const divider_color = useMemo(() => {
    const css = `--group-${index}-base`;

    return `rgba(var(${css}), 0.16)`;
  }, [index]);

  const members = useMemo(() => {
    return group.group_data.members;
  }, [group.group_data.members]);

  return {
    border_color,
    divider_color,
    members,
  };
};

export default useGroupItem;
