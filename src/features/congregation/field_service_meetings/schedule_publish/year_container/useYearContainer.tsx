import { useMemo } from 'react';
import { ScheduleListType } from '../index.types';

const useYearContainer = (months: ScheduleListType['months']) => {
  const checked = useMemo(() => {
    const cnChecked = months.filter((record) => record.checked);

    return cnChecked.length === months.length;
  }, [months]);

  const indeterminate = useMemo(() => {
    const cnChecked = months.filter((record) => record.checked);

    return cnChecked.length > 0 && cnChecked.length < months.length;
  }, [months]);

  return { checked, indeterminate };
};

export default useYearContainer;
