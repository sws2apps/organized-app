import { useRecoilValue } from 'recoil';
import { sourcesFormattedState } from '@states/sources';
import MonthsContainer from './months_container';

const useWeekSelector = () => {
  const sources = useRecoilValue(sourcesFormattedState);

  const tabs = sources.map((year) => ({
    label: year.value.toString(),
    Component: <MonthsContainer months={year.months} />,
  }));

  const hasWeeks = sources.length > 0;

  return { tabs, hasWeeks };
};

export default useWeekSelector;
