import { useEffect, useRef, useState } from 'react';
import dateFormat from 'dateformat';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import Typography from '@mui/material/Typography';
import { UserS4Records } from '../../classes/UserS4Records';
import { refreshReportState } from '../../states/report';

const S4HourField = ({ month, currentDate, value, setValue, timeStart, setTimeStart }) => {
  const { t } = useTranslation('ui');

  let runClock = useRef(null);

  const setRefreshScreen = useSetRecoilState(refreshReportState);

  const [isStart, setIsStart] = useState(false);
  const [hourValue, setHourValue] = useState(null);

  const handleStartTimer = async () => {
    let newTimer = new Date();

    if (value && value !== 0 && value.indexOf(':')) {
      const hours = +value.split(':')[0];
      const minutes = +value.split(':')[1];
      const seconds = +value.split(':')[2];

      const totalMs = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
      newTimer.setMilliseconds(newTimer.getMilliseconds() - totalMs);
      newTimer = new Date(newTimer);
    }

    const tmpDate = dateFormat(new Date(currentDate), 'yyyy/mm/dd');
    const durationStart = newTimer;
    const currentReport = await UserS4Records.get(tmpDate);
    currentReport.duration_start = durationStart;
    await currentReport.save();

    setTimeStart(durationStart);
  };

  const handlePauseTimer = async () => {
    clearInterval(runClock.current);

    const tmpDate = dateFormat(new Date(currentDate), 'yyyy/mm/dd');

    const currentReport = await UserS4Records.get(tmpDate);
    currentReport.duration = value;
    currentReport.duration_start = undefined;
    currentReport.changes = currentReport.changes.filter((record) => record.field !== 'duration');
    currentReport.changes.push({ date: new Date(), field: 'duration', value });
    await currentReport.save();

    setTimeStart(undefined);
    runClock.current = undefined;
    setIsStart(false);

    setRefreshScreen((prev) => !prev);
  };

  const handleChangeDuration = async (value) => {
    const timestamp = Date.parse(value);
    const isValid = value === null || !isNaN(timestamp);

    if (isValid) {
      const durationValue = dateFormat(new Date(value), 'HH:MM:ss');

      const tmpDate = dateFormat(new Date(currentDate), 'yyyy/mm/dd');

      const currentReport = await UserS4Records.get(tmpDate);
      currentReport.duration = durationValue;
      currentReport.changes = currentReport.changes.filter((record) => record.field !== 'duration');
      currentReport.changes.push({ date: new Date(), field: 'duration', durationValue });
      await currentReport.save();

      setRefreshScreen((prev) => !prev);
    }

    setHourValue(value);
  };

  useEffect(() => {
    if (timeStart) {
      runClock.current = setInterval(() => {
        const startTime = new Date(timeStart).getTime();
        const endTime = new Date().getTime();
        const diff = endTime - startTime;

        const totalSecs = Math.floor(Math.abs(diff) / 1000);
        const totalMins = Math.floor(totalSecs / 60);
        const totalHours = Math.floor(totalMins / 60);

        const hours = totalHours % 24;
        const minutes = totalMins % 60;
        const seconds = totalSecs % 60;

        const finalValue = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
          seconds
        ).padStart(2, '0')}`;

        setValue(finalValue);
        setIsStart(true);
      }, [500]);
    }

    return () => {
      clearInterval(runClock.current);
    };
  }, [setValue, timeStart]);

  useEffect(() => {
    setIsStart(false);
  }, [currentDate]);

  useEffect(() => {
    setHourValue(null);

    if (value && value !== '') {
      const date = new Date();
      date.setSeconds(+value.split(':')[2]);
      date.setMinutes(+value.split(':')[1]);
      date.setHours(+value.split(':')[0]);
      setHourValue(date);
    }
  }, [value, currentDate]);

  return (
    <Box sx={{ margin: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '280px' }}>
      <Typography sx={{ lineHeight: 1.2, textAlign: 'center', fontSize: '13px', width: '200px', marginBottom: '5px' }}>
        {t('S4Hours')}
      </Typography>

      <Box sx={{ display: 'flex', falignItems: 'center' }}>
        <IconButton aria-label="stop" color="warning" onClick={handlePauseTimer}>
          <StopCircleIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimeField
              value={hourValue}
              onChange={(newValue) => handleChangeDuration(newValue)}
              format="HH:mm:ss"
              sx={{ '.MuiOutlinedInput-input': { textAlign: 'center', fontSize: '18px' } }}
            />
          </LocalizationProvider>
        </Box>
        <IconButton aria-label="start" color="secondary" onClick={isStart ? handlePauseTimer : handleStartTimer}>
          {isStart && <PauseIcon sx={{ fontSize: '30px' }} />}
          {!isStart && <PlayCircleFilledWhiteIcon sx={{ fontSize: '30px' }} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default S4HourField;
