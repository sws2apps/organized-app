import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Typography from '@mui/material/Typography';
import { ScheduleAssignment } from '../features/schedules';
import { dbIsWeekExist } from '../indexedDb/dbSourceMaterial';
import { dbGetScheduleData } from '../indexedDb/dbSchedule';
import { shortDateFormatState } from '../states/main';
import { getCurrentWeekDate } from '../utils/app';

const WeeklyAssignments = () => {
  const { t } = useTranslation('ui');

  const navigate = useNavigate();
  const { weekToFormat } = useParams();

  const [noMeeting, setNoMeeting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fCurrentWeek, setFCurrentWeek] = useState('');
  const [previousWeek, setPreviousWeek] = useState('');
  const [nextWeek, setNextWeek] = useState('');
  const [disablePrevious, setDisablePrevious] = useState(false);
  const [disableNext, setDisableNext] = useState(false);

  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const handleActiveWeek = () => {
    const monDay = getCurrentWeekDate();
    const weekDate = dateFormat(monDay, 'mm-dd-yyyy');
    navigate(`/schedules/view/${weekDate}`);
  };

  const handlePreviousWeek = () => {
    const weekDate = dateFormat(previousWeek, 'mm-dd-yyyy');
    navigate(`/schedules/view/${weekDate}`);
  };

  const handleNextWeek = () => {
    const weekDate = dateFormat(nextWeek, 'mm-dd-yyyy');
    navigate(`/schedules/view/${weekDate}`);
  };

  useEffect(() => {
    const loadCurrentWeekData = async () => {
      const week = weekToFormat.replaceAll('-', '/');
      const currentWeek = new Date(week);

      let result = new Date(currentWeek);
      result.setDate(result.getDate() - 7);
      let previousWeek = dateFormat(result, 'mm/dd/yyyy');

      let hasPrevious = await dbIsWeekExist(previousWeek);

      if (!hasPrevious) {
        result.setDate(result.getDate() - 7);
        previousWeek = dateFormat(result, 'mm/dd/yyyy');
        hasPrevious = await dbIsWeekExist(previousWeek);
      }
      setDisablePrevious(!hasPrevious);
      setPreviousWeek(result);

      result = new Date(currentWeek);
      result.setDate(result.getDate() + 7);
      let nextWeek = dateFormat(result, 'mm/dd/yyyy');

      let hasNext = await dbIsWeekExist(nextWeek);
      if (!hasNext) {
        result.setDate(result.getDate() + 7);
        nextWeek = dateFormat(result, 'mm/dd/yyyy');
        hasNext = await dbIsWeekExist(nextWeek);
      }
      setDisableNext(!hasNext);
      setNextWeek(result);

      const weekValue = dateFormat(currentWeek, 'mm/dd/yyyy');
      const weekValueFormatted = dateFormat(weekValue, shortDateFormat);
      setFCurrentWeek(weekValueFormatted);

      const scheduleData = await dbGetScheduleData(weekValue);

      setNoMeeting(scheduleData.noMeeting);
      setIsLoading(false);
    };
    setIsLoading(true);

    loadCurrentWeekData();
  }, [shortDateFormat, weekToFormat]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButton onClick={handlePreviousWeek} disabled={disablePrevious}>
          <SkipPreviousIcon sx={{ fontSize: '40px' }} />
        </IconButton>
        <IconButton onClick={handleActiveWeek}>
          <HomeIcon sx={{ fontSize: '40px' }} />
        </IconButton>
        <IconButton onClick={handleNextWeek} disabled={disableNext}>
          <SkipNextIcon sx={{ fontSize: '40px' }} />
        </IconButton>
      </Box>

      <Typography variant="h6" align="center" sx={{ lineHeight: 1.3, marginBottom: '20px' }}>
        {t('currentSchedule', { currentWeek: fCurrentWeek })}
      </Typography>

      {isLoading && (
        <CircularProgress
          color="secondary"
          size={80}
          disableShrink={true}
          sx={{
            display: 'flex',
            margin: '20vh auto',
          }}
        />
      )}
      {!isLoading && (
        <>
          {noMeeting && (
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
          )}
          {!noMeeting && <ScheduleAssignment edit={false} />}
        </>
      )}
    </Box>
  );
};

export default WeeklyAssignments;
