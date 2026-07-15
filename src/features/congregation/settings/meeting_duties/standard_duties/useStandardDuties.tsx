import { DutyStandard } from './index.types';

const STANDARD_DUTIES: DutyStandard[] = [
  'tr_audioVideo',
  'tr_dutiesMicrophones',
  'tr_dutiesStage',
  'tr_dutiesEntranceAttendant',
  'tr_hospitality',
];

const useStandardDuties = () => {
  return { duties: STANDARD_DUTIES };
};

export default useStandardDuties;
