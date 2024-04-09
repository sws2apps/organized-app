import { Box } from '@mui/material';
import DateHistory from '@features/persons/date_history';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { PrivilegeItemType } from './index.types';

const PrivilegeItem = ({
  id,
  endDate,
  isLast,
  onAdd,
  onDelete,
  onEndDateChange,
  onStartDateChange,
  startDate,
  privilege,
  onPrivilegeChange,
}: PrivilegeItemType) => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Select
        className="body-regular"
        label={t('tr_spiritualStatus')}
        value={privilege}
        onChange={(e) => onPrivilegeChange(id, e.target.value)}
      >
        <MenuItem value="ms">
          <Typography>{t('tr_ministerialServant')}</Typography>
        </MenuItem>
        <MenuItem value="elder">
          <Typography>{t('tr_elder')}</Typography>
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

export default PrivilegeItem;
