import { useAtomValue } from 'jotai';
import { selectedWeekState } from '@states/schedules';

const useAuditoriumAttendant = () => {
  const week = useAtomValue(selectedWeekState);

  return { week };
};

export default useAuditoriumAttendant;
