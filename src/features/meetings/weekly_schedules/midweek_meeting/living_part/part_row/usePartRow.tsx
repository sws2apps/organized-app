import { useMemo } from 'react';
import { PartRowProps } from './index.types';
import { AssignmentFieldType } from '@definition/assignment';

const usePartRow = ({ type }: PartRowProps) => {
  const lcField = useMemo(() => {
    const field = type.toString().replace('lc_part', 'MM_LCPart');

    return field as AssignmentFieldType;
  }, [type]);

  return { lcField };
};

export default usePartRow;
