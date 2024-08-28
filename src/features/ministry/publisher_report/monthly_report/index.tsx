import { CardContainer } from '../shared_styles';
import { useAppTranslation } from '@hooks/index';
import useMonthlyReport from './useMonthlyReport';
import BibleStudies from './bible_studies';
import Comments from './comments';
import MinistryShared from './ministry_shared';
import ScrollableTabs from '@components/scrollable_tabs';
import Typography from '@components/typography';

const MonthlyReport = () => {
  const { t } = useAppTranslation();

  const { monthsTab, initialValue, handleMonthChange, selectedMonth } =
    useMonthlyReport();

  return (
    <CardContainer>
      <Typography className="h2">{t('tr_monthlyReport')}</Typography>

      <ScrollableTabs
        tabs={monthsTab}
        value={initialValue}
        onChange={handleMonthChange}
      />

      {selectedMonth.length > 0 && (
        <>
          <MinistryShared />
          <BibleStudies />
          <Comments />
        </>
      )}
    </CardContainer>
  );
};

export default MonthlyReport;
