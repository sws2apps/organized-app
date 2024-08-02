import { useAppTranslation } from '@hooks/index';
import { WeekTypeSelectorType } from './index.types';
import useWeekTypeSelector from './useWeekTypeSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const WeekTypeSelector = (props: WeekTypeSelectorType) => {
  const { t } = useAppTranslation();

  const { weekType, options, handleWeekTypeChange } =
    useWeekTypeSelector(props);

  return (
    <Select
      label={t('tr_weekType')}
      fullWidth={false}
      sx={{ width: '100%', flex: 1 }}
      value={weekType}
      onChange={(e) => handleWeekTypeChange(+e.target.value)}
    >
      {options.map((weekType) => (
        <MenuItem key={weekType.id} value={weekType.id}>
          <Typography>{weekType.week_type_name}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default WeekTypeSelector;
