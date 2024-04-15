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

const PersonServiceItem = ({ currentService, otherService, setOtherService }) => {
  const { t } = useTranslation('ui');

  const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

  const secretaryRole = Setting.cong_role.includes('secretary');

  const handleRemoveStatus = () => {
    const obj = otherService.filter((item) => item.serviceId !== currentService.serviceId);
    setOtherService(obj);
  };

  const handleInfoChange = (service, startDate, endDate) => {
    const obj = otherService.map((item) =>
      item.serviceId === currentService.serviceId
        ? {
            serviceId: currentService.serviceId,
            service,
            startDate: startDate,
            endDate: endDate,
          }
        : item
    );
    setOtherService(obj);
  };

  const handleStatusChange = (newValue) => {
    handleInfoChange(newValue, currentService.startDate, currentService.endDate);
  };

  const handleStartDateChange = (newValue) => {
    handleInfoChange(currentService.service, newValue, currentService.endDate);
  };

  const handleEndDateChange = (newValue) => {
    handleInfoChange(currentService.service, currentService.startDate, newValue);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
      <TextField
        id="outlined-select-service"
        select
        label={t('service')}
        size="medium"
        sx={{ minWidth: '250px' }}
        defaultValue=""
        InputProps={{ readOnly: !secretaryRole }}
        value={currentService.service}
        onChange={secretaryRole ? (e) => handleStatusChange(e.target.value) : null}
      >
        <MenuItem value="auxiliaryPioneer">{t('auxiliaryPioneer')}</MenuItem>
        <MenuItem value="regularPioneer">{t('regularPioneer')}</MenuItem>
        <MenuItem value="specialPioneer">{t('specialPioneer')}</MenuItem>
      </TextField>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          id="service-start-date"
          label={t('startDate')}
          sx={{ width: '200px' }}
          format={shortDatePickerFormat}
          value={currentService.startDate === null ? null : new Date(currentService.startDate)}
          onChange={(value) => handleStartDateChange(value)}
          readOnly={!secretaryRole}
        />
      </LocalizationProvider>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            id="service-end-date"
            label={t('endDate')}
            sx={{ width: '200px' }}
            format={shortDatePickerFormat}
            value={currentService.endDate === null ? null : new Date(currentService.endDate)}
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

export default PersonServiceItem;
