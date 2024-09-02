import { Box } from '@mui/material';
import useMinistryTimer from './useMinistryTimer';
import Duration from './duration';
import LeftButton from './left_button';
import RightButton from './right_button';

const MinistryTimer = () => {
  const { duration, handlePause, handleStart, timerState } = useMinistryTimer();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '4px 8px 12px 8px',
        gap: '12px',
      }}
    >
      <LeftButton state={timerState} onClick={handlePause} />
      <Duration value={duration} />
      <RightButton state={timerState} onClick={handleStart} />
    </Box>
  );
};

export default MinistryTimer;
