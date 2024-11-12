import { Box } from '@mui/material';
import useOutgoingTalks from './useOutgoingTalks';
import ScheduleHeader from './schedule_header';
import WeekContainer from './week_container';
import NoSchedule from '@features/meetings/weekly_schedules/no_schedule';

const OutgoingTalks = () => {
  const { weeks } = useOutgoingTalks();

  const noSchedule = true;

  return (
    <>
      {noSchedule && <NoSchedule />}
      {!noSchedule && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <ScheduleHeader />

          {weeks.map((week) => (
            <WeekContainer key={week} week={week} />
          ))}
        </Box>
      )}
    </>
  );
};

export default OutgoingTalks;
