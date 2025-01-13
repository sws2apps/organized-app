import { Box } from '@mui/material';
import useOutgoingTalks from './useOutgoingTalks';
import ScheduleHeader from './schedule_header';
import WeekContainer from './week_container';
import NoSchedule from '../no_schedule';

const OutgoingTalks = () => {
  const { weeks, noSchedule } = useOutgoingTalks();

  return noSchedule ? (
    <NoSchedule />
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '8px',
      }}
    >
      {weeks.length !== 0 && <ScheduleHeader />}

      {weeks.map((week) => (
        <WeekContainer key={week} week={week} />
      ))}
    </Box>
  );
};

export default OutgoingTalks;
