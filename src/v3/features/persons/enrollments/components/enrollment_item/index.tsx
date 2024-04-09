import { Box } from '@mui/material';
import DateHistory from '@features/persons/date_history';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { EnrollmentItemType } from './index.types';

const EnrollmentItem = ({
  id,
  endDate,
  isLast,
  onAdd,
  onDelete,
  onEndDateChange,
  onStartDateChange,
  startDate,
  enrollment,
  onEnrollmentChange,
}: EnrollmentItemType) => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Select
        className="body-regular"
        label={t('tr_enrollment')}
        value={enrollment}
        onChange={(e) => onEnrollmentChange(id, e.target.value)}
      >
        <MenuItem value="AP">
          <Typography>{t('tr_AP')}</Typography>
        </MenuItem>
        <MenuItem value="FR">
          <Typography>{t('tr_FR')}</Typography>
        </MenuItem>
        <MenuItem value="FS">
          <Typography>{t('tr_FS')}</Typography>
        </MenuItem>
        <MenuItem value="FMF">
          <Typography>{t('tr_FMF')}</Typography>
        </MenuItem>
      </Select>

      <DateHistory
        id={id}
        startDate={startDate}
        endDate={endDate}
        isLast={isLast}
        onAdd={onAdd}
        onDelete={onDelete}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
    </Box>
  );
};

export default EnrollmentItem;
