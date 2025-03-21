import { Box, Stack } from '@mui/material';
import Typography from '@components/typography';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import AssignmentPreferences from './assignment_preferences';
import AuxiliaryClassroom from './auxiliary_classroom';
import DayTime from './day_time';
import LinkedParts from './linked_parts';

const MidweekSettings = () => {
  const { t } = useAppTranslation();
  const { isGroup } = useCurrentUser();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DayTime />

      <Stack spacing="16px">
        <AssignmentPreferences />

        {!isGroup && <AuxiliaryClassroom />}

        <Stack spacing="16px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_linkedParts')}
          </Typography>
          <LinkedParts />
        </Stack>
      </Stack>
    </Box>
  );
};

export default MidweekSettings;
