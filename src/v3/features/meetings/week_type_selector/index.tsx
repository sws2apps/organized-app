import { useAppTranslation } from '@hooks/index';
import { WeekTypeSelectorType } from './index.types';
import useWeekTypeSelector from './useWeekTypeSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const WeekTypeSelector = ({ week }: WeekTypeSelectorType) => {
  const { t } = useAppTranslation();

  const { weekType, weekTypeOptions, handleWeekTypeChange } = useWeekTypeSelector(week);

  return (
    <Select
      label={t('tr_weekType')}
      fullWidth={false}
      sx={{ maxWidth: '520px', width: '100%' }}
      value={weekType}
      onChange={(e) => handleWeekTypeChange(+e.target.value)}
    >
      {weekTypeOptions.map((weekType) => (
        <MenuItem key={weekType.id} value={weekType.id}>
          <Typography>{weekType.week_type_name}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default WeekTypeSelector;
