import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ServiceYear } from '../classes/ServiceYear';
import { S88s } from '../classes/S88s';
import { S3, S88 } from '../features/meetingAttendance';
import { refreshReportState } from '../states/report';

const MeetingAttendance = () => {
  const { t } = useTranslation('ui');

  const setRefresh = useSetRecoilState(refreshReportState);

  const [allMonths, setAllMonths] = useState([]);
  const [currentServiceYear, setCurrentServiceYear] = useState(ServiceYear.getCurrent().uid);
  const [currentMonth, setCurrentMonth] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleServiceYearChange = (value) => {
    setCurrentServiceYear(value);
    setIsLoading(true);
    setRefresh((prev) => !prev);
  };

  const handleMonthChange = (value) => {
    setCurrentMonth(value);
    setIsLoading(true);
  };

  useEffect(() => {
    if (currentServiceYear !== '') {
      const options = ServiceYear.getMonths(currentServiceYear);
      setAllMonths(options);

      if (currentServiceYear === ServiceYear.getCurrent().uid) {
        const currentMonth = new Date().getMonth();
        const selected = options.find((option) => option.index === currentMonth);

        setCurrentMonth(selected.value);
      } else {
        setCurrentMonth(options[0].value);
      }
    }
  }, [currentServiceYear]);

  useEffect(() => {
    let fetchTimer;

    const handleInitialize = async () => {
      const S88 = S88s.list.find((S88) => S88.uid === currentServiceYear);
      if (S88) {
        await S88.initializeMonth(currentMonth);
        setRefresh((prev) => !prev);
      }
      setIsLoading(false);
    };

    if (currentMonth !== '') {
      fetchTimer = setTimeout(() => {
        setIsLoading(true);
        handleInitialize();
      }, 1500);
    }

    return () => {
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [currentMonth, currentServiceYear, setRefresh]);

  return (
    <Box sx={{ marginBottom: '30px' }}>
      <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px' }}>
        {t('meetingAttendanceRecord')}
      </Typography>
      <TextField
        id="outlined-select-service-year"
        select
        label={t('serviceYear')}
        size="small"
        sx={{ minWidth: '250px' }}
        value={currentServiceYear}
        onChange={(e) => handleServiceYearChange(e.target.value)}
      >
        {ServiceYear.list.map((year) => (
          <MenuItem key={year.uid} value={year.uid}>
            {year.value}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <EditCalendarIcon fontSize="large" color="primary" />
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', margin: '20px 0' }}>
          {t('formS3')} (S-3)
        </Typography>
      </Box>

      <TextField
        id="outlined-select-month"
        select
        label={t('selectMonth')}
        size="small"
        sx={{ minWidth: '250px' }}
        value={currentMonth}
        onChange={(e) => handleMonthChange(e.target.value)}
      >
        {allMonths.map((month) => (
          <MenuItem key={month.value} value={month.value}>
            {month.label}
          </MenuItem>
        ))}
      </TextField>
      {!isLoading && currentMonth !== '' && <S3 serviceYear={currentServiceYear} month={currentMonth} />}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
        <EditCalendarIcon fontSize="large" color="success" />
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t('formS88')} (S-88)</Typography>
      </Box>

      {!isLoading && currentServiceYear !== '' && <S88 serviceYear={currentServiceYear} />}
    </Box>
  );
};

export default MeetingAttendance;
