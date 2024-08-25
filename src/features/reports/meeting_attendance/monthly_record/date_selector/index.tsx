import { Box } from '@mui/material';
import { DateSelectorProps } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useDateSelector from './useDateSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const DateSelector = ({
  month,
  year,
  onMonthChange,
  onYearChange,
}: DateSelectorProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { serviceYears, months } = useDateSelector(year);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: laptopUp ? 'row' : 'column',
      }}
    >
      <Select
        label={t('tr_serviceYear')}
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
      >
        {serviceYears.map((record) => (
          <MenuItem key={record.year} value={record.year}>
            <Typography>{record.year}</Typography>
          </MenuItem>
        ))}
      </Select>

      <Select
        label={t('tr_month')}
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
      >
        {months.map((record) => (
          <MenuItem key={record.value} value={record.value}>
            <Typography>{record.label}</Typography>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default DateSelector;
