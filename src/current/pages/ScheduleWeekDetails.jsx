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
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Typography from '@mui/material/Typography';
import { ScheduleAssignment } from '../features/schedules';
import { shortDateFormatState } from '../states/main';
import { Setting } from '../classes/Setting';
import { Schedules } from '../classes/Schedules';
import { Sources } from '../classes/Sources';

const iconButtonStyles = {
  fontSize: '30px',
  borderRadius: '8px',
  '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
    borderRadius: 0,
    backgroundColor: 'rgba(23, 32, 42, .3)',
  },
  border: '1px outset',
  width: '60px',
};

const ScheduleWeekDetails = () => {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const { schedule, weekToFormat } = useParams();

  const [noMMeeting, setNoMeeting] = useState(false);

  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const scheduleFormatted = schedule.replace('-', '/');
  const monthIndex = parseInt(scheduleFormatted.split('/')[0], 10);
  const scheduleName = `${Setting.monthNames()[monthIndex - 1]} ${scheduleFormatted.split('/')[1]}`;

  const week = weekToFormat.replaceAll('-', '/');
  const weekFormatted = dateFormat(new Date(week), shortDateFormat);

  const handleNavigateSchedule = () => {
    navigate(`/schedules/${schedule}`);
  };

  const handleWeekTimeline = (type) => {
    const currentDate = new Date(week);
    if (type === 'forward') {
      currentDate.setDate(currentDate.getDate() + 7);
    }
    if (type === 'backward') {
      currentDate.setDate(currentDate.getDate() - 7);
    }

    const dateFormatted = dateFormat(currentDate, 'yyyy/mm/dd');
    if (Sources.get(dateFormatted)) {
      const newUrl = `/schedules/${schedule}/${dateFormatted.replaceAll('/', '-')}`;
      navigate(newUrl);
    }
  };

  const handleMoveNext = () => {
    handleWeekTimeline('forward');
  };

  const handleMovePrevious = () => {
    handleWeekTimeline('backward');
  };

  useEffect(() => {
    if (week !== '') {
      const scheduleData = Schedules.get(week);
      setNoMeeting(scheduleData.noMMeeting);
    }
  }, [t, week]);

  if (noMMeeting) {
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
          {t('noMMeeting')}
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          width: { xs: '100%', lg: 'calc(100% - 530px)' },
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <IconButton onClick={handleNavigateSchedule}>
            <ArrowBackIcon sx={{ fontSize: '30px' }} />
          </IconButton>
          <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
            {`${t('schedule')} > ${scheduleName} > ${weekFormatted}`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <IconButton sx={iconButtonStyles} onClick={handleMovePrevious}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton sx={iconButtonStyles} onClick={handleMoveNext}>
            <SkipNextIcon />
          </IconButton>
        </Box>
      </Box>

      <ScheduleAssignment edit={true} />
    </Box>
  );
};

export default ScheduleWeekDetails;
