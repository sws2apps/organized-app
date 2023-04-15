import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ServiceYear } from '../classes/ServiceYear';
import { S88s } from '../classes/S88s';
import { S3 } from '../features/meetingAttendance';

const MeetingAttendance = () => {
  const { t } = useTranslation('ui');

  const [allMonths, setAllMonths] = useState([]);
  const [currentServiceYear, setCurrentServiceYear] = useState(ServiceYear.list[0].uid);
  const [currentMonth, setCurrentMonth] = useState('');
  const [masterRefresh, setMasterRefresh] = useState(false);

  useEffect(() => {
    if (currentServiceYear !== '') {
      const S88 = S88s.get(currentServiceYear);
      const options = S88.getServiceYearMonths();
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
    const handleInitialize = async () => {
      const S88 = S88s.list.find((S88) => S88.uid === currentServiceYear);
      await S88.initializeMonth(currentMonth);
      setMasterRefresh((prev) => !prev);
    };

    if (currentMonth !== '') handleInitialize();
  }, [currentMonth, currentServiceYear]);

  return (
    <Box>
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
        onChange={(e) => setCurrentServiceYear(e.target.value)}
      >
        {ServiceYear.list.map((year) => (
          <MenuItem key={year.uid} value={year.uid}>
            {year.value}
          </MenuItem>
        ))}
      </TextField>
      <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', margin: '20px 0' }}>
        {t('formS3')} (S-3)
      </Typography>
      <TextField
        id="outlined-select-month"
        select
        label={t('selectMonth')}
        size="small"
        sx={{ minWidth: '250px' }}
        value={currentMonth}
        onChange={(e) => setCurrentMonth(e.target.value)}
      >
        {allMonths.map((month) => (
          <MenuItem key={month.value} value={month.value}>
            {month.label}
          </MenuItem>
        ))}
      </TextField>
      {currentMonth !== '' && (
        <S3 serviceYear={currentServiceYear} month={currentMonth} masterRefresh={masterRefresh} />
      )}
      <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', margin: '20px 0' }}>
        {t('formS88')} (S-88)
      </Typography>
    </Box>
  );
};

export default MeetingAttendance;
