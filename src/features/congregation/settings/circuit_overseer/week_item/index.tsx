import { Box } from '@mui/material';
import { IconDelete } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { DatePicker } from '@components/index';
import { WeekItemType } from './index.types';
import useWeekItem from './useWeekItem';
import IconButton from '@components/icon_button';
import { formatDate, getWeekDate } from '@utils/date';

const WeekItem = ({ visit, error, helperText, onWeekChange, onDelete }: WeekItemType) => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { handleDateChange, handleDeleteVisit } = useWeekItem(visit);

  const computeWeekOf = (date: Date | null) => {
    if (date === null) {
      return '';
    }

    return formatDate(getWeekDate(date), 'yyyy/MM/dd');
  };

  const handlePickerChange = async (date: Date | null) => {
    const optimisticWeekOf = computeWeekOf(date);

    if (onWeekChange) {
      onWeekChange(visit.id, optimisticWeekOf);
    }

    try {
      const nextWeekOf = await handleDateChange(date);

      if (onWeekChange && nextWeekOf !== optimisticWeekOf) {
        onWeekChange(visit.id, nextWeekOf);
      }
    } catch (error) {
      if (onWeekChange) {
        onWeekChange(visit.id, visit.weekOf);
      }

      console.error(error);
    }
  };

  const handleDeleteClick = async () => {
    await handleDeleteVisit();

    if (onDelete) {
      onDelete(visit.id);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: '16px' }}>
      <DatePicker
        disablePast
        label={t('tr_coNextVisitWeek')}
        value={visit.weekOf === '' ? null : new Date(visit.weekOf)}
        onChange={handlePickerChange}
        readOnly={!isAdmin}
        error={error}
        helperText={helperText}
      />

      {isAdmin && (
        <IconButton
          color="error"
          sx={{
            borderRadius: 'var(--radius-m)',
            width: '48px',
            height: '48px',
          }}
          onClick={handleDeleteClick}
        >
          <IconDelete color="var(--red-main)" />
        </IconButton>
      )}
    </Box>
  );
};

export default WeekItem;
