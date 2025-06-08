import { Grid, Stack } from '@mui/material';
import { IconHallOverseer } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useAuditoriumAttendant from './useAuditoriumAttendant';
import DutyName from '../duty_name';
import PersonSelector from '@features/meetings/person_selector';
import { AssignmentCode } from '@definition/assignment';

const AuditoriumAttendant = () => {
  const { t } = useAppTranslation();

  const { laptopDown } = useBreakpoints();

  const { week } = useAuditoriumAttendant();

  return (
    <Stack
      spacing={laptopDown ? '24px' : '8px'}
      direction={laptopDown ? 'column' : 'row'}
      alignItems="flex-start"
    >
      <DutyName
        duty={t('tr_dutiesAuditoriumAttendant')}
        icon={<IconHallOverseer color="var(--accent-dark)" />}
      />

      <Stack spacing="8px" flex={1} width="100%">
        <Grid container spacing={2}>
          <Grid size={{ mobile: 12, laptop: 6 }}>
            <PersonSelector
              label={t('tr_brother')}
              week={week}
              assignment="DUTIES_AuditoriumAttendant"
              type={AssignmentCode.DUTIES_AuditoriumAttendant}
            />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default AuditoriumAttendant;
