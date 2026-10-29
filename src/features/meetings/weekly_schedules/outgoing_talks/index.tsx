import { Box } from '@mui/material';
import useOutgoingTalks from './useOutgoingTalks';
import ScheduleHeader from './schedule_header';
import WeekContainer from './week_container';
import NoSchedule from '../no_schedule';

const OutgoingTalks = () => {
  const { talkSchedules, noSchedule, targetDate, targetRef } =
    useOutgoingTalks();

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
      {talkSchedules.length !== 0 && <ScheduleHeader />}

      {talkSchedules.map((item) => (
        <WeekContainer
          key={item.date}
          talkSchedules={item}
          ref={item.date === targetDate ? targetRef : undefined}
        />
      ))}
    </Box>
  );
};

export default OutgoingTalks;
