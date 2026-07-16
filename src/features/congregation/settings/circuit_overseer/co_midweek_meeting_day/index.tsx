import Select from '@components/select';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useCOMidweekMeetingDay from './useCOMidweekMeetingDay';
import MenuItem from '@components/menuitem';

const COMidweekMeetingDay = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { normalizedVisitDay, weekdays, handleVisitDayChange } =
    useCOMidweekMeetingDay();

  return (
    <Select
      label={t('tr_midweekMeetingDay')}
      value={normalizedVisitDay}
      readOnly={!isAdmin}
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

export default COMidweekMeetingDay;
