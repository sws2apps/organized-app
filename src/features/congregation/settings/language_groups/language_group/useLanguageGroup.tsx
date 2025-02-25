import { useMemo } from 'react';
import { LanguageGroupProps } from './index.types';

const useLanguageGroup = ({ group }: LanguageGroupProps) => {
  const group_name = useMemo(() => {
    return `${group.name}, ${group.circuit}`;
  }, [group.name, group.circuit]);

  return { group_name };
};

export default useLanguageGroup;
