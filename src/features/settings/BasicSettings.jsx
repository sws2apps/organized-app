import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  classCountState,
  congNameState,
  congNumberState,
  meetingDayState,
  meetingTimeState,
  openingPrayerAutoAssignState,
} from '../../states/congregation';
import { generateDisplayName } from '../../utils/person';
import { Setting } from '../../classes/Setting';

const BasicSettings = () => {
  const { t } = useTranslation('ui');

  const [classCount, setClassCount] = useRecoilState(classCountState);
  const [meetingDay, setMeetingDay] = useRecoilState(meetingDayState);
  const [meetingTime, setMeetingTime] = useRecoilState(meetingTimeState);
  const [autoAssignOpeningPrayer, setAutoAssignOpeningPrayer] = useRecoilState(openingPrayerAutoAssignState);

  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);

  const [tempMeetingDay, setTempMeetingDay] = useState(meetingDay);
  const [tempClassCount, setTempClassCount] = useState(classCount);
  const [tempMeetingTime, setTempMeetingTime] = useState(meetingTime ? new Date(meetingTime) : null);
  const [coName, setCoName] = useState('');
  const [coDisplayName, setCoDisplayName] = useState('');
  const [tmpAutoAssignOpeningPrayer, setTmpAutoAssignOpeningPrayer] = useState(autoAssignOpeningPrayer);

  const roleLMMO = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');

  const handleMeetingDayChange = async (e) => {
    setTempMeetingDay(e.target.value);
    await Setting.update({ meeting_day: e.target.value });
    setMeetingDay(e.target.value);
  };

  const handleClassChange = async (e) => {
    setTempClassCount(e.target.value);
    await Setting.update({ class_count: e.target.value });
    setClassCount(e.target.value);
  };

  const handleMeetingTimeChange = async (value) => {
    setTempMeetingTime(value);
    await Setting.update({ meeting_time: value });
    setMeetingTime(value);
  };

  const handleChangeCOName = async (value) => {
    setCoName(value);

    const dispName = generateDisplayName(value);
    setCoDisplayName(dispName);

    const obj = {};
    obj.co_name = value;
    obj.co_displayName = dispName;
    await Setting.update(obj);
  };

  const handleChangeCODispName = async (value) => {
    setCoDisplayName(value);
    await Setting.update({ co_displayName: value });
  };

  const handleSwitchAutoAssignPrayer = async (value) => {
    setTmpAutoAssignOpeningPrayer(value);
    await Setting.update({ opening_prayer_autoAssign: value });
    setAutoAssignOpeningPrayer(value);
  };

  useEffect(() => {
    setCoName(Setting.co_name || '');
    setCoDisplayName(Setting.co_displayName || '');
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
            InputProps={{ readOnly: !roleLMMO }}
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
              readOnly={!roleLMMO}
              sx={{
                '.MuiInputBase-formControl': {
                  height: '40.5px',
                  width: '180px',
                },
              }}
            />
          </LocalizationProvider>
          <TextField
            id="outlined-select-class"
            select
            label={t('auxClass')}
            value={tempClassCount}
            defaultValue={1}
            onChange={handleClassChange}
            InputProps={{ readOnly: !roleLMMO }}
            size="small"
            sx={{ width: '150px' }}
          >
            <MenuItem value={1}>{t('no')}</MenuItem>
            <MenuItem value={2}>{t('yes')}</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>{t('scheduleSettings')}</Typography>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tmpAutoAssignOpeningPrayer}
                  readOnly={!roleLMMO}
                  onChange={roleLMMO ? (e) => handleSwitchAutoAssignPrayer(e.target.checked) : null}
                />
              }
              label={t('autoAssignOpeningPrayer')}
            />
          </Box>
        </Box>

        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>{t('circuitOverseer')}</Typography>
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
      {!roleLMMO && (
        <Typography sx={{ fontStyle: 'italic', marginTop: '20px' }} color="#FE4119">
          {t('someSettingLockedLMMO')}
        </Typography>
      )}
    </Box>
  );
};

export default BasicSettings;
