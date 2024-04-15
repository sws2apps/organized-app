import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WeekendMeetingContainer } from '../features/schedules';

const WeekendMeetingSchedule = () => {
  const { t } = useTranslation('ui');

  return (
    <Box>
      <Typography sx={{ margin: '0px 0px 10px 0px', textTransform: 'uppercase', fontWeight: 'bold' }}>
        {t('weekendMeeting')}
      </Typography>

      <WeekendMeetingContainer />
    </Box>
  );
};

export default WeekendMeetingSchedule;
