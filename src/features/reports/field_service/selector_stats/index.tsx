import { Stack } from '@mui/material';
import useSelectorStats from './useSelectorStats';
import Card from '@components/card';
import Divider from '@components/divider';
import ReceivedReports from './received_reports';
import ServiceYearMonthSelector from '@features/reports/service_year_month_selector';
import PersonFilter from './person_filter';

const SelectorStats = () => {
  const { handleMonthChange, handleYearChange, month, year } =
    useSelectorStats();

  return (
    <Card>
      <Stack spacing="24px" divider={<Divider color="var(--accent-200)" />}>
        <ServiceYearMonthSelector
          year={year}
          month={month || ''}
          onYearChange={handleYearChange}
          onMonthChange={handleMonthChange}
        />

        <Stack spacing="24px">
          <ReceivedReports />
          <PersonFilter />
        </Stack>
      </Stack>
    </Card>
  );
};

export default SelectorStats;
