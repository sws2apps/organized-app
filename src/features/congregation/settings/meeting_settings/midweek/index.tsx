import { Box, Stack } from '@mui/material';
import { useCurrentUser } from '@hooks/index';
import AssignmentPreferences from './assignment_preferences';
import AuxiliaryClassroom from './auxiliary_classroom';
import DayTime from './day_time';

const MidweekSettings = () => {
  const { isGroup } = useCurrentUser();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DayTime />

      <Stack spacing="16px">
        <AssignmentPreferences />

        {!isGroup && <AuxiliaryClassroom />}
      </Stack>
    </Box>
  );
};

export default MidweekSettings;
