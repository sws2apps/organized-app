import { useEffect, useState } from 'react';
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
import { dbGetAppSettings, dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import {
  classCountState,
  congNameState,
  congNumberState,
  meetingDayState,
  meetingTimeState,
} from '../../states/congregation';
import { generateDisplayName } from '../../utils/person';

const BasicSettings = () => {
  const { t } = useTranslation('ui');

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
  const [coName, setCoName] = useState('');
  const [coDisplayName, setCoDisplayName] = useState('');

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

  const handleChangeCOName = (value) => {
    setCoName(value);
    setCoDisplayName(generateDisplayName(value));
  };

  const saveAppSettings = async () => {
    const obj = {};
    obj.cong_name = tempCongName;
    obj.cong_number = tempCongNumber;
    obj.class_count = tempClassCount;
    obj.meeting_day = tempMeetingDay;
    obj.meeting_time = tempMeetingTime;
    obj.co_name = coName;
    obj.co_displayName = coDisplayName;
    await dbUpdateAppSettings(obj);

    setCongName(tempCongName);
    setCongNumber(tempCongNumber);
    setClassCount(tempClassCount);
    setMeetingDay(tempMeetingDay);
    setMeetingTime(tempMeetingTime);

    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('saved'));
  };

  useEffect(() => {
    const getAppSettings = async () => {
      const settings = await dbGetAppSettings();
      setCoName(settings.co_name || '');
      setCoDisplayName(settings.co_displayName || '');
    };

    getAppSettings();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography className={'settingHeader'}>{t('aboutCongregation')}</Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ padding: '20px 20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <TextField
            id="outlined-basic"
            label={t('congregation')}
            variant="outlined"
            size="small"
            autoComplete="off"
            required
            error={isErrorCongName ? true : false}
            helperText={isErrorCongName ? t('blankRequired') : null}
            sx={{ width: '320px' }}
            value={tempCongName}
            onChange={(e) => handleCongNameChange(e.target.value)}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="outlined-basic"
            type="number"
            label={t('number')}
            variant="outlined"
            size="small"
            autoComplete="off"
            required
            error={isErrorCongNumber ? true : false}
            helperText={isErrorCongName ? t('blankRequired') : null}
            sx={{ width: '120px' }}
            value={tempCongNumber}
            onChange={(e) => handleCongNumberChange(e.target.value)}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: '20px',
            gap: '15px',
          }}
        >
          <TextField
            id="outlined-select-day"
            select
            label={t('meetingDay')}
            value={tempMeetingDay}
            defaultValue={3}
            onChange={handleMeetingDayChange}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value={1}>{t('monday')}</MenuItem>
            <MenuItem value={2}>{t('tuesday')}</MenuItem>
            <MenuItem value={3}>{t('wednesday')}</MenuItem>
            <MenuItem value={4}>{t('thursday')}</MenuItem>
            <MenuItem value={5}>{t('friday')}</MenuItem>
            <MenuItem value={6}>{t('saturday')}</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label={t('time')}
              value={tempMeetingTime}
              onChange={handleMeetingTimeChange}
              renderInput={(params) => <TextField {...params} size="small" sx={{ width: '180px' }} />}
            />
          </LocalizationProvider>
          <TextField
            id="outlined-select-class"
            select
            label={t('classCount')}
            value={tempClassCount}
            defaultValue={1}
            onChange={handleClassChange}
            size="small"
            sx={{ minWidth: 100 }}
          >
            <MenuItem value={1}>{t('oneClass')}</MenuItem>
            <MenuItem value={2}>{t('twoClass')}</MenuItem>
          </TextField>
        </Box>

        <Typography sx={{ marginTop: '15px', fontWeight: 'bold' }}>{t('circuitOverseer')}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
          <TextField
            id="outlined-basic"
            label={t('name')}
            variant="outlined"
            size="small"
            autoComplete="off"
            sx={{ width: '320px' }}
            value={coName}
            onChange={(e) => handleChangeCOName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label={t('displayName')}
            variant="outlined"
            size="small"
            autoComplete="off"
            sx={{ width: '200px' }}
            value={coDisplayName}
            onChange={(e) => setCoDisplayName(e.target.value)}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={() => saveAppSettings()}
          sx={{ marginTop: '20px' }}
        >
          {t('save')}
        </Button>
      </Box>
    </Box>
  );
};

export default BasicSettings;
