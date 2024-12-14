import { MonthSelectorProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useDateSelector from './useMonthSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const MonthSelector = ({
  onChange,
  value,
  year,
  sx,
  readOnly,
}: MonthSelectorProps) => {
  const { t } = useAppTranslation();

  const { months } = useDateSelector(year);

  return (
    <Select
      readOnly={readOnly}
      disabled={readOnly}
      label={t('tr_month')}
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      sx={sx}
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
