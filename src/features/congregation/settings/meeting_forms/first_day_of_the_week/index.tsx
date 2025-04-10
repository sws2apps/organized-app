import MenuItem from '@components/menuitem';
import Select from '@components/select';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useFirstDayOfTheWeek from './useFirstDayOfTheWeek';
import { FirstDayOfTheWeekOption } from '@definition/settings';

const FirstDayOfTheWeek = () => {
  const { t } = useAppTranslation();
  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();
  const { firstDayOfTheWeek, handleFirstDayOfTheWeekChange } =
    useFirstDayOfTheWeek();

  return (
    <Select
      label={t('tr_firstDayOfTheWeek')}
      value={firstDayOfTheWeek}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
      onChange={(e) =>
        handleFirstDayOfTheWeekChange(e.target.value as FirstDayOfTheWeekOption)
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
