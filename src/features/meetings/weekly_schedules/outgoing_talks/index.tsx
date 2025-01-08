import { Box } from '@mui/material';
import useOutgoingTalks from './useOutgoingTalks';
import ScheduleHeader from './schedule_header';
import WeekContainer from './week_container';

const OutgoingTalks = () => {
  const { weeks } = useOutgoingTalks();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '8px',
      }}
    >
      <ScheduleHeader />

      {weeks.map((week) => (
        <WeekContainer key={week} week={week} />
      ))}
    </Box>
  );
};

export default OutgoingTalks;
