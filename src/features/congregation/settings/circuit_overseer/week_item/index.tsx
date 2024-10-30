import { Box } from '@mui/material';
import { IconDelete } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { DatePicker } from '@components/index';
import { WeekItemType } from './index.types';
import useWeekItem from './useWeekItem';
import IconButton from '@components/icon_button';

const WeekItem = ({ visit }: WeekItemType) => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { handleDateChange, handleDeleteVisit } = useWeekItem(visit);

  return (
    <Box sx={{ display: 'flex', gap: '16px' }}>
      <DatePicker
        disablePast
        label={t('tr_coNextVisitWeek')}
        value={visit.weekOf === '' ? null : new Date(visit.weekOf)}
        onChange={(date) => handleDateChange(date)}
        readOnly={!isAdmin}
      />

      {isAdmin && (
        <IconButton
          color="error"
          sx={{
            borderRadius: 'var(--radius-m)',
            width: '48px',
            height: '48px',
          }}
          onClick={handleDeleteVisit}
        >
          <IconDelete color="var(--red-main)" />
        </IconButton>
      )}
    </Box>
  );
};

export default WeekItem;
