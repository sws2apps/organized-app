import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import Typography from '@mui/material/Typography';
import { ScheduleAssignment } from '../features/schedules';
import { dbGetScheduleData } from '../indexedDb/dbSchedule';
import { monthNamesState, shortDateFormatState } from '../states/main';

const ScheduleWeekDetails = () => {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const { schedule, weekToFormat } = useParams();

  const [noMeeting, setNoMeeting] = useState(false);

  const monthNames = useRecoilValue(monthNamesState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const scheduleFormatted = schedule.replace('-', '/');
  const monthIndex = parseInt(scheduleFormatted.split('/')[0], 10);
  const scheduleName = `${monthNames[monthIndex - 1]} ${scheduleFormatted.split('/')[1]}`;

  const week = weekToFormat.replaceAll('-', '/');
  const weekFormatted = dateFormat(new Date(week), shortDateFormat);

  const handleNavigateSchedule = () => {
    navigate(`/schedules/${schedule}`);
  };

  useEffect(() => {
    const loadCurrentWeekData = async () => {
      const scheduleData = await dbGetScheduleData(week);
      setNoMeeting(scheduleData.noMeeting);
    };

    if (week !== '') {
      loadCurrentWeekData();
    }
  }, [t, week]);

  if (noMeeting) {
    return (
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
        }}
      >
        <NoMeetingRoomIcon color="error" sx={{ fontSize: '150px' }} />
        <Typography variant="body1" align="center">
          {t('noMidweekMeeting')}
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton onClick={handleNavigateSchedule}>
          <ArrowBackIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          {`${t('schedule')} > ${scheduleName} > ${weekFormatted}`}
        </Typography>
      </Box>

      <ScheduleAssignment edit={true} />
    </Box>
  );
};

export default ScheduleWeekDetails;
