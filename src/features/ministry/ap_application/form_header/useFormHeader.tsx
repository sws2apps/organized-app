import { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { APRecordType } from '@definition/ministry';
import { FormHeaderProps } from './index.types';
import { monthNamesState } from '@states/app';
import { groupConsecutiveMonths } from '@utils/date';

const useHeader = ({ applications }: FormHeaderProps) => {
  const monthNames = useRecoilValue(monthNamesState);

  const handleFormat = useCallback(
    (records: APRecordType[]) => {
      const months = records.reduce((acc: string[], current) => {
        acc.push(...current.months);
        return acc;
      }, []);

      const cleanMonths = Array.from(new Set(months)).sort();
      const groups = groupConsecutiveMonths(cleanMonths);

      const result = groups.map((record) => {
        const splits = record.split('-');
        const start = +splits[0].split('/')[1] - 1;

        let str = monthNames[start];

        if (splits[1]) {
          const end = +splits[1].split('/')[1] - 1;
          str += '-' + monthNames[end];
        }

        return str;
      });

      return result.join(', ');
    },
    [monthNames]
  );

  const pending = useMemo(() => {
    const records = applications.filter(
      (record) => !record.status || record.status === 'waiting'
    );

    if (records.length === 0) return;

    const result = handleFormat(records);
    return result;
  }, [applications, handleFormat]);

  const approved = useMemo(() => {
    const records = applications.filter(
      (record) => record.status === 'approved'
    );

    if (records.length === 0) return;

    const result = handleFormat(records);
    return result;
  }, [applications, handleFormat]);

  return { pending, approved };
};

export default useHeader;
