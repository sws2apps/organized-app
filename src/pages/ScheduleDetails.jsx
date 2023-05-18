import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { WeekSummaryItem } from '../features/schedules';
import { Setting } from '../classes/Setting';
import { Sources } from '../classes/Sources';

const ScheduleDetails = () => {
  const { schedule } = useParams();
  const navigate = useNavigate();

  const { t } = useTranslation('ui');

  const [weeks, setWeeks] = useState([]);

  const scheduleFormatted = schedule.replace('-', '/');
  const monthIndex = parseInt(scheduleFormatted.split('/')[0], 10);
  const scheduleName = `${Setting.monthNames()[monthIndex - 1]} ${scheduleFormatted.split('/')[1]}`;

  const handleNavigateSchedule = () => {
    navigate('/schedules');
  };

  useEffect(() => {
    const data = Sources.weekListByScheduleLocal(scheduleFormatted);
    setWeeks(data);
  }, [scheduleFormatted]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <IconButton onClick={handleNavigateSchedule}>
          <ArrowBackIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          {`${t('schedule')} > ${scheduleName}`}
        </Typography>
      </Box>

      <Typography variant="h4">{t('weeksList')}</Typography>

      <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', marginTop: '25px' }}>
        {weeks.map((week) => (
          <WeekSummaryItem key={week.value} week={week} schedule={schedule} />
        ))}
      </Box>
    </Box>
  );
};

export default ScheduleDetails;
