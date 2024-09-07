import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { ServiceYearMonthSelectorProps } from './index.types';
import MonthSelector from './month_selector';
import YearSelector from './year_selector';

const ServiceYearMonthSelector = ({
  month,
  year,
  onMonthChange,
  onYearChange,
}: ServiceYearMonthSelectorProps) => {
  const { laptopUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: laptopUp ? 'row' : 'column',
      }}
    >
      <YearSelector value={year} onChange={onYearChange} />

      <MonthSelector year={year} value={month} onChange={onMonthChange} />
    </Box>
  );
};

export default ServiceYearMonthSelector;
