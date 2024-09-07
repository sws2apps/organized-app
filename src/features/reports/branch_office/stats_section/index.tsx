import { Stack } from '@mui/material';
import { StatsSectionProps } from './index.types';
import MonthlyReport from './monthly_report';
import YearlyReport from './yearly_report';

const StatsSection = ({ month, report, year }: StatsSectionProps) => {
  return (
    <Stack spacing="16px" flex={0.8}>
      {report === 'S-1' && <MonthlyReport month={month} />}
      {report === 'S-10' && <YearlyReport year={year} />}
    </Stack>
  );
};

export default StatsSection;
