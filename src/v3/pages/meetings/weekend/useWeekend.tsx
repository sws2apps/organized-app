import { useRecoilValue } from 'recoil';
import { sourcesFormattedState } from '@states/sources';

const useWeekend = () => {
  const sources = useRecoilValue(sourcesFormattedState);

  const hasWeeks = sources.length > 0;

  return { hasWeeks };
};

export default useWeekend;
