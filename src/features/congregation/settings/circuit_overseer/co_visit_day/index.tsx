import Select from '@components/select';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useCOVisitDay from './useCOVisitDay';
import MenuItem from '@components/menuitem';

const COVisitDay = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { normalizedVisitDay, weekdays, handleVisitDayChange } =
    useCOVisitDay();

  return (
    <Select
      label={t('tr_visitDay')}
      value={normalizedVisitDay}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
      onChange={(e) => handleVisitDayChange(+e.target.value)}
    >
      {weekdays.map((day, index) => (
        <MenuItem value={index} key={index}>
          {t(day)}
        </MenuItem>
      ))}
    </Select>
  );
};

export default COVisitDay;
