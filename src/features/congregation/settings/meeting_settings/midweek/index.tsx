import { Box, Stack } from '@mui/material';
import AssignmentPreferences from './assignment_preferences';
import AuxiliaryClassroom from './auxiliary_classroom';
import DayTime from './day_time';

const MidweekSettings = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DayTime />

      <Stack spacing="16px">
        <AssignmentPreferences />
        <AuxiliaryClassroom />
      </Stack>
    </Box>
  );
};

export default MidweekSettings;
