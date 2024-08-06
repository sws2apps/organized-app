import { Box } from '@mui/material';
import DateHistory from '@features/persons/date_history';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { PrivilegeItemType } from './index.types';

const PrivilegeItem = ({
  id,
  end_date,
  isLast,
  onAdd,
  onDelete,
  onEndDateChange,
  onStartDateChange,
  start_date,
  privilege,
  onPrivilegeChange,
}: PrivilegeItemType) => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Select
        className="body-regular"
        label={t('tr_privilege')}
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
        start_date={start_date}
        end_date={end_date}
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
