import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import {
  classCountState,
  congNameState,
  congNumberState,
  meetingDayState,
  meetingTimeState,
} from '../../states/congregation';

const BasicSettings = () => {
  const { t } = useTranslation();

  const [isErrorCongName, setIsErrorCongName] = useState(false);
  const [isErrorCongNumber, setIsErrorCongNumber] = useState(false);

  const [congName, setCongName] = useRecoilState(congNameState);
  const [congNumber, setCongNumber] = useRecoilState(congNumberState);
  const [meetingDay, setMeetingDay] = useRecoilState(meetingDayState);
  const [classCount, setClassCount] = useRecoilState(classCountState);
  const [meetingTime, setMeetingTime] = useRecoilState(meetingTimeState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [tempCongName, setTempCongName] = useState(congName);
  const [tempCongNumber, setTempCongNumber] = useState(congNumber);
  const [tempMeetingDay, setTempMeetingDay] = useState(meetingDay);
  const [tempClassCount, setTempClassCount] = useState(classCount);
  const [tempMeetingTime, setTempMeetingTime] = useState(meetingTime);

  const handleCongNameChange = (value) => {
    if (value) {
      setIsErrorCongName(false);
    } else {
      setIsErrorCongName(true);
    }
    setTempCongName(value);
  };

  const handleCongNumberChange = (value) => {
    if (value) {
      setIsErrorCongNumber(false);
    } else {
      setIsErrorCongNumber(true);
    }
    setTempCongNumber(value);
  };

  const handleMeetingDayChange = (e) => {
    setTempMeetingDay(e.target.value);
  };

  const handleClassChange = (e) => {
    setTempClassCount(e.target.value);
  };

  const handleMeetingTimeChange = (value) => {
    setTempMeetingTime(value);
  };

  const saveAppSettings = async () => {
    var obj = {};
    obj.cong_name = tempCongName;
    obj.cong_number = tempCongNumber;
    obj.class_count = tempClassCount;
    obj.meeting_day = tempMeetingDay;
    obj.meeting_time = tempMeetingTime;
    await dbUpdateAppSettings(obj);

    setCongName(tempCongName);
    setCongNumber(tempCongNumber);
    setClassCount(tempClassCount);
    setMeetingDay(tempMeetingDay);
    setMeetingTime(tempMeetingTime);

    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('settings.saved'));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography className={'settingHeader'}>{t('settings.aboutCongregation')}</Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ padding: '20px 20px' }}>
        <TextField
          id="outlined-basic"
          label={t('global.congregation')}
          variant="outlined"
          size="small"
          autoComplete="off"
          required
          error={isErrorCongName ? true : false}
          helperText={isErrorCongName ? t('settings.blankRequired') : null}
          sx={{
            width: '320px',
            marginRight: '5px',
            marginBottom: '10px',
          }}
          value={tempCongName}
          onChange={(e) => handleCongNameChange(e.target.value)}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-basic"
          type="number"
          label={t('global.number')}
          variant="outlined"
          size="small"
          autoComplete="off"
          required
          error={isErrorCongNumber ? true : false}
          helperText={isErrorCongName ? t('settings.blankRequired') : null}
          sx={{ width: '120px' }}
          value={tempCongNumber}
          onChange={(e) => handleCongNumberChange(e.target.value)}
          InputProps={{
            readOnly: true,
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: '20px',
            gap: '10px',
          }}
        >
          <TextField
            id="outlined-select-day"
            select
            label={t('startup.meetingDay')}
            value={tempMeetingDay}
            defaultValue={3}
            onChange={handleMeetingDayChange}
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <MenuItem value={1}>{t('global.monday')}</MenuItem>
            <MenuItem value={2}>{t('global.tuesday')}</MenuItem>
            <MenuItem value={3}>{t('global.wednesday')}</MenuItem>
            <MenuItem value={4}>{t('global.thursday')}</MenuItem>
            <MenuItem value={5}>{t('global.friday')}</MenuItem>
            <MenuItem value={6}>{t('global.saturday')}</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label={t('global.time')}
              value={tempMeetingTime}
              onChange={handleMeetingTimeChange}
              renderInput={(params) => <TextField {...params} size="small" sx={{ width: '180px' }} />}
            />
          </LocalizationProvider>
          <TextField
            id="outlined-select-class"
            select
            label={t('startup.classCount')}
            value={tempClassCount}
            defaultValue={1}
            onChange={handleClassChange}
            size="small"
            sx={{
              minWidth: 100,
            }}
          >
            <MenuItem value={1}>{t('global.oneClass')}</MenuItem>
            <MenuItem value={2}>{t('global.twoClass')}</MenuItem>
          </TextField>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={() => saveAppSettings()}
          sx={{ marginTop: '10px' }}
        >
          {t('global.save')}
        </Button>
      </Box>
    </Box>
  );
};

export default BasicSettings;
