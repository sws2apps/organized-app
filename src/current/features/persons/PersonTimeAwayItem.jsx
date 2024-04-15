import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import { shortDatePickerFormatState } from '../../states/main';
import { Setting } from '../../classes/Setting';

const PersonTimeAwayItem = ({ timeAway, timeAways, setTimeAway }) => {
  const { t } = useTranslation('ui');

  const { timeAwayId } = timeAway;

  const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

  const [comments, setComments] = useState('');

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const isEditAllowed = lmmoRole || secretaryRole;

  const handleInfoChange = (startDate, endDate, comments) => {
    if (timeAwayId) {
      const obj = timeAways.map((timeAway) =>
        timeAway.timeAwayId === timeAwayId
          ? {
              timeAwayId: timeAwayId,
              startDate: startDate,
              endDate: endDate,
              comments: comments,
            }
          : timeAway
      );
      setTimeAway(obj);
    }
  };

  const handleStartedChange = (newValue) => {
    handleInfoChange(newValue, timeAway.endDate, comments);
  };

  const handleExpiredChange = (newValue) => {
    handleInfoChange(timeAway.startDate, newValue, comments);
  };

  const handleCommentsChange = (value) => {
    setComments(value);
    handleInfoChange(timeAway.startDate, timeAway.endDate, value);
  };

  const handleRemoveTimeAway = () => {
    let obj = timeAways.filter((timeAway) => timeAway.timeAwayId !== timeAwayId);
    setTimeAway(obj);
  };

  return (
    <Box
      id="time-away-item"
      sx={{
        border: '1px outset',
        width: '100%',
        borderRadius: '8px',
        paddingBottom: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginTop: '15px',
          marginLeft: '10px',
          gap: '10px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              id="start-date-time-away-picker"
              label={t('startDate')}
              format={shortDatePickerFormat}
              value={timeAway.startDate === null ? null : new Date(timeAway.startDate)}
              onChange={(value) => handleStartedChange(value)}
              readOnly={!isEditAllowed}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              id="end-date-time-away-picker"
              label={t('endDate')}
              format={shortDatePickerFormat}
              value={timeAway.endDate === null ? null : new Date(timeAway.endDate)}
              onChange={(value) => handleExpiredChange(value)}
              readOnly={!isEditAllowed}
            />
          </LocalizationProvider>
        </Box>
        <TextField
          label={t('comments')}
          variant="outlined"
          autoComplete="off"
          sx={{ flexGrow: 1, marginRight: '10px' }}
          value={comments}
          onChange={(e) => handleCommentsChange(e.target.value)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '10px',
          marginRight: '10px',
        }}
      >
        <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={handleRemoveTimeAway}>
          {t('delete')}
        </Button>
      </Box>
    </Box>
  );
};

export default PersonTimeAwayItem;
