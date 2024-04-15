import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { shortDatePickerFormatState } from '../../states/main';
import { Setting } from '../../classes/Setting';

const PersonAppointmentItem = ({ isFemale, currentStatus, spiritualStatus, setSpiritualStatus }) => {
  const { t } = useTranslation('ui');

  const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

  const secretaryRole = Setting.cong_role.includes('secretary');

  const handleRemoveStatus = () => {
    const obj = spiritualStatus.filter((item) => item.statusId !== currentStatus.statusId);
    setSpiritualStatus(obj);
  };

  const handleInfoChange = (status, startDate, endDate) => {
    const obj = spiritualStatus.map((item) =>
      item.statusId === currentStatus.statusId
        ? {
            statusId: currentStatus.statusId,
            status,
            startDate: startDate,
            endDate: endDate,
          }
        : item
    );
    setSpiritualStatus(obj);
  };

  const handleStatusChange = (newValue) => {
    handleInfoChange(newValue, currentStatus.startDate, currentStatus.endDate);
  };

  const handleStartDateChange = (newValue) => {
    handleInfoChange(currentStatus.status, newValue, currentStatus.endDate);
  };

  const handleEndDateChange = (newValue) => {
    handleInfoChange(currentStatus.status, currentStatus.startDate, newValue);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
      <TextField
        id="outlined-select-status"
        select
        label={t('spiritualStatus')}
        size="medium"
        sx={{ minWidth: '250px' }}
        defaultValue=""
        InputProps={{ readOnly: !secretaryRole }}
        value={currentStatus.status}
        onChange={secretaryRole ? (e) => handleStatusChange(e.target.value) : null}
      >
        <MenuItem value="publisher">{t('publisher')}</MenuItem>
        {!isFemale && <MenuItem value="ms">{t('ministerialServant')}</MenuItem>}
        {!isFemale && <MenuItem value="elder">{t('elder')}</MenuItem>}
      </TextField>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          id="status-start-date"
          label={t('startDate')}
          sx={{ width: '200px' }}
          format={shortDatePickerFormat}
          value={currentStatus.startDate === null ? null : new Date(currentStatus.startDate)}
          onChange={(value) => handleStartDateChange(value)}
          readOnly={!secretaryRole}
        />
      </LocalizationProvider>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            id="status-end-date"
            label={t('endDate')}
            sx={{ width: '200px' }}
            format={shortDatePickerFormat}
            value={currentStatus.endDate === null ? null : new Date(currentStatus.endDate)}
            onChange={(value) => handleEndDateChange(value)}
            readOnly={!secretaryRole}
          />
        </LocalizationProvider>
        {secretaryRole && (
          <IconButton aria-label="delete" color="error" size="large" onClick={handleRemoveStatus}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default PersonAppointmentItem;
