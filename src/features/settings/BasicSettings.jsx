import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { dbGetAppSettings, dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
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

  const [classCount, setClassCount] = useRecoilState(classCountState);
  const [meetingDay, setMeetingDay] = useRecoilState(meetingDayState);
  const [meetingTime, setMeetingTime] = useRecoilState(meetingTimeState);

  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);

  const [tempMeetingDay, setTempMeetingDay] = useState(meetingDay);
  const [tempClassCount, setTempClassCount] = useState(classCount);
  const [tempMeetingTime, setTempMeetingTime] = useState(meetingTime);
  const [coName, setCoName] = useState('');
  const [coDisplayName, setCoDisplayName] = useState('');

  const handleMeetingDayChange = async (e) => {
    setTempMeetingDay(e.target.value);
    await dbUpdateAppSettings({ meeting_day: e.target.value });
    setMeetingDay(e.target.value);
  };

  const handleClassChange = async (e) => {
    setTempClassCount(e.target.value);
    await dbUpdateAppSettings({ class_count: e.target.value });
    setClassCount(e.target.value);
  };

  const handleMeetingTimeChange = async (value) => {
    setTempMeetingTime(value);
    await dbUpdateAppSettings({ meeting_time: value });
    setMeetingTime(value);
  };

  const handleChangeCOName = async (value) => {
    setCoName(value);

    const dispName = generateDisplayName(value);
    setCoDisplayName(dispName);

    const obj = {};
    obj.co_name = value;
    obj.co_displayName = dispName;
    await dbUpdateAppSettings(obj);
  };

  const handleChangeCODispName = async (value) => {
    setCoDisplayName(value);
    await dbUpdateAppSettings({ co_displayName: value });
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
            sx={{ width: '320px' }}
            value={congName}
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
            sx={{ width: '120px' }}
            value={congNumber}
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
            label={t('auxClass')}
            value={tempClassCount}
            defaultValue={1}
            onChange={handleClassChange}
            size="small"
            sx={{ width: '150px' }}
          >
            <MenuItem value={1}>{t('no')}</MenuItem>
            <MenuItem value={2}>{t('yes')}</MenuItem>
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
            onChange={(e) => handleChangeCODispName(e.target.value)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BasicSettings;
