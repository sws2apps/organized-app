import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { FirstDayWeekOption } from '@definition/settings';
import useFirstDayWeek from './useFirstDayWeek';
import MenuItem from '@components/menuitem';
import Select from '@components/select';

const FirstDayWeek = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { firstDayWeek, handleFirstDayWeekChange } = useFirstDayWeek();

  return (
    <Select
      label={t('tr_firstDayOfTheWeek')}
      value={firstDayWeek}
      onChange={(e) => handleFirstDayWeekChange(+e.target.value)}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
    >
      <MenuItem
        key={FirstDayWeekOption.SUNDAY}
        value={FirstDayWeekOption.SUNDAY}
      >
        {t('tr_sunday')}
      </MenuItem>
      <MenuItem
        key={FirstDayWeekOption.MONDAY}
        value={FirstDayWeekOption.MONDAY}
      >
        {t('tr_monday')}
      </MenuItem>
      <MenuItem
        key={FirstDayWeekOption.SATURDAY}
        value={FirstDayWeekOption.SATURDAY}
      >
        {t('tr_saturday')}
      </MenuItem>
    </Select>
  );
};

export default FirstDayWeek;
