import { CardContainer } from '@features/ministry/shared_styles';
import useYearlyStats from './useYearlyStats';
import ScrollableTabs from '@components/scrollable_tabs';

const YearlyStats = () => {
  const { yearsTab, activeTabInitial, handleYearChange } = useYearlyStats();

  return (
    <CardContainer>
      <ScrollableTabs
        tabs={yearsTab}
        value={activeTabInitial}
        onChange={handleYearChange}
      />
    </CardContainer>
  );
};

export default YearlyStats;
