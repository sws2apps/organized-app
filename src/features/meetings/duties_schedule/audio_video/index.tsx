import { Grid, Stack } from '@mui/material';
import { IconComputerVideo } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import useAudioVideo from './useAudioVideo';
import DutyName from '../duty_name';
import PersonSelector from '@features/meetings/person_selector';

const AudioVideo = () => {
  const { t } = useAppTranslation();

  const { laptopDown } = useBreakpoints();

  const { week } = useAudioVideo();

  return (
    <Stack
      spacing={laptopDown ? '24px' : '8px'}
      direction={laptopDown ? 'column' : 'row'}
      alignItems="flex-start"
    >
      <DutyName
        duty={t('tr_audioVideo')}
        icon={<IconComputerVideo color="var(--accent-dark)" />}
      />

      <Stack spacing="8px" flex={1} width="100%">
        <Grid container spacing="8px">
          <Grid size={{ mobile: 12, laptop: 6 }}>
            <PersonSelector
              label={t('tr_brother')}
              week={week}
              assignment="DUTIES_Audio"
              type={AssignmentCode.DUTIES_Audio}
            />
          </Grid>
          <Grid size={{ mobile: 12, laptop: 6 }}>
            <PersonSelector
              label={t('tr_brother')}
              week={week}
              assignment="DUTIES_Video"
              type={AssignmentCode.DUTIES_Video}
            />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default AudioVideo;
