import { useMemo } from 'react';
import { DutyStandard } from './index.types';

const useStandardDuties = () => {
  const duties: DutyStandard[] = useMemo(() => {
    return [
      'tr_audioVideo',
      'tr_dutiesMicrophones',
      'tr_dutiesStage',
      'tr_dutiesEntranceAttendant',
      'tr_hospitality',
    ];
  }, []);

  return { duties };
};

export default useStandardDuties;
