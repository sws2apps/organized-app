import { CardContainer } from '../../../shared_styles';
import { useAppTranslation } from '@hooks/index';
import useMonthlyReport from './useMonthlyReport';
import FormS4 from '../../form_S4';
import ScrollableTabs from '@components/scrollable_tabs';
import Typography from '@components/typography';

const MonthlyReport = () => {
  const { t } = useAppTranslation();

  const { monthsTab, handleMonthChange, selectedMonth, initialValue, userUID } =
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
        <FormS4 month={selectedMonth} person_uid={userUID} publisher={true} />
      )}
    </CardContainer>
  );
};

export default MonthlyReport;
