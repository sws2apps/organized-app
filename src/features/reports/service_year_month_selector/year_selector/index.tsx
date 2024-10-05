import { useAppTranslation } from '@hooks/index';
import { YearSelectorProps } from './index.types';
import useYearSelector from './useYearSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const YearSelector = ({ onChange, value, sx }: YearSelectorProps) => {
  const { t } = useAppTranslation();

  const { serviceYears } = useYearSelector();

  return (
    <Select
      label={t('tr_serviceYear')}
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      sx={sx}
    >
      {serviceYears.map((record) => (
        <MenuItem key={record.year} value={record.year}>
          <Typography>{record.year}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default YearSelector;
