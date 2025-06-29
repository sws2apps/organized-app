import MenuItem from '@components/menuitem';
import Select from '@components/select';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { FirstDayOfTheWeekOption } from '@definition/settings';
import useFirstDayWeek from './useFirstDayWeek';

const FirstDayOfTheWeek = () => {
  const { t } = useAppTranslation();
  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();
  const { firstDayOfTheWeek, handleFirstDayOfTheWeekChange } =
    useFirstDayWeek();

  return (
    <Select
      label={t('tr_firstDayOfTheWeek')}
      value={firstDayOfTheWeek}
      onChange={(e) => handleFirstDayOfTheWeekChange(+e.target.value)}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
    >
      <MenuItem key={0} value={FirstDayOfTheWeekOption.SUNDAY}>
        {t('tr_sunday')}
      </MenuItem>
      <MenuItem key={1} value={FirstDayOfTheWeekOption.MONDAY}>
        {t('tr_monday')}
      </MenuItem>
      <MenuItem key={6} value={FirstDayOfTheWeekOption.SATURDAY}>
        {t('tr_saturday')}
      </MenuItem>
    </Select>
  );
};

export default FirstDayOfTheWeek;
