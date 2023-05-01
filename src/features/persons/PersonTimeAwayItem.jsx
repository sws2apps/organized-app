import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import { shortDatePickerFormatState } from '../../states/main';

const PersonTimeAwayItem = ({ timeAway, timeAways, setTimeAway }) => {
  const { t } = useTranslation('ui');

  const { timeAwayId } = timeAway;

  const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

  const [startedDate, setStartedDate] = useState(timeAway.startDate ? new Date(timeAway.startDate) : null);
  const [expiredDate, setExpiredDate] = useState(timeAway.endDate ? new Date(timeAway.endDate) : null);
  const [comments, setComments] = useState('');

  const handleInfoChange = (startDate, endDate, comments) => {
    if (timeAwayId) {
      let obj = timeAways.map((timeAway) =>
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
    if (newValue instanceof Date && !isNaN(newValue)) {
      setStartedDate(newValue);
      handleInfoChange(newValue, expiredDate, comments);
    }
  };

  const handleExpiredChange = (newValue) => {
    if (newValue instanceof Date && !isNaN(newValue)) {
      setExpiredDate(newValue);
      handleInfoChange(startedDate, newValue, comments);
    }
  };

  const handleCommentsChange = (value) => {
    setComments(value);
    handleInfoChange(startedDate, expiredDate, value);
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
            <DesktopDatePicker
              id="start-date-time-away-picker"
              label={t('startDate')}
              format={shortDatePickerFormat}
              value={startedDate}
              onChange={handleStartedChange}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              id="end-date-time-away-picker"
              label={t('endDate')}
              format={shortDatePickerFormat}
              value={expiredDate}
              onChange={handleExpiredChange}
            />
          </LocalizationProvider>
        </Box>
        <TextField
          label={t('comments')}
          variant="outlined"
          autoComplete="off"
          sx={{
            flexGrow: 1,
            marginRight: '10px',
          }}
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
