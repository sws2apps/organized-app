import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { DateSelectorProps } from './index.types';
import MonthSelector from '@features/reports/service_year_month_selector/month_selector';
import YearSelector from '@features/reports/service_year_month_selector/year_selector';

const DateSelector = ({
  report,
  year,
  onYearChange,
  month,
  onMonthChange,
}: DateSelectorProps) => {
  const { tabletUp } = useBreakpoints();

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexDirection: tabletUp ? 'row' : 'column',
      }}
    >
      <YearSelector value={year} onChange={onYearChange} />
      {report === 'S-1' && (
        <MonthSelector year={year} value={month} onChange={onMonthChange} />
      )}
    </Box>
  );
};

export default DateSelector;
