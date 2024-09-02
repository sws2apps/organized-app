import { MonthSelectorProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useDateSelector from './useMonthSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const MonthSelector = ({ onChange, value, year }: MonthSelectorProps) => {
  const { t } = useAppTranslation();

  const { months } = useDateSelector(year);

  return (
    <Select
      label={t('tr_month')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {months.map((record) => (
        <MenuItem key={record.value} value={record.value}>
          <Typography>{record.label}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default MonthSelector;
