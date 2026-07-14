import { useAtomValue } from 'jotai';
import { selectedWeekState } from '@states/schedules';

const useStage = () => {
  const week = useAtomValue(selectedWeekState);

  return { week };
};

export default useStage;
