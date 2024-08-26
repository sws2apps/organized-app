import { Box } from '@mui/material';
import AssignmentPreferences from './assignment_preferences';
import DayTime from './day_time';
import AuxiliaryClassroom from './auxiliary_classroom';

const MidweekSettings = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DayTime />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <AssignmentPreferences />

        <AuxiliaryClassroom />
      </Box>
    </Box>
  );
};

export default MidweekSettings;
