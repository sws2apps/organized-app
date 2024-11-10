import { formatDate } from '@services/dateformat';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useDateFormat from './useDateFormat';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const DateFormat = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const {
    handleShortDateFormatChange,
    shortDateFormat,
    shortDateFormatOptions,
  } = useDateFormat();

  return (
    <Select
      label={t('tr_dateFormatSelect')}
      value={shortDateFormat}
      onChange={(e) => handleShortDateFormatChange(e.target.value as string)}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
    >
      {shortDateFormatOptions.map((format) => (
        <MenuItem key={format} value={format}>
          <Typography>{formatDate(new Date(2024, 10, 20), format)}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default DateFormat;
