import { Box, IconButton } from '@mui/material';
import { Typography } from '@components';
import { useAppTranslation } from '@hooks/index';
import MinistryAssignments from '@assets/illustration_ministryAssignments.svg';
import MultiPlattform from '@assets/illustration_multiPlattform.svg';
import MeetingSchedules from '@assets/illustration_meetingSchedules.svg';
import Secretary from '@assets/illustration_secretary.svg';
import { createArray } from '@utils/common';
import { IconEllipse } from '@icons';
import useIllustration from './useIllustration';

const styles = {
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  gap: '24px',
  opacity: 0,
  display: 'none',
};

const StartupIllustration = () => {
  const { t } = useAppTranslation();

  const { index, dotSize } = useIllustration();

  return (
    <Box
      sx={{
        flex: 1,
        background: '#5065D0',
        borderRadius: 'var(--radius-xxl)',
        padding: { mobile: '24px', laptop: '48px' },
      }}
    >
      <Box sx={{ overflow: 'hidden', display: 'flex', height: 'calc(100% - 34.25px)' }}>
        <Box sx={styles} id="illustration1">
          <Box>
            <Typography variant="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
              {t('illustrationMinistryAssignmentsHeader')}
            </Typography>
            <Typography variant="body-regular" color="var(--always-white)">
              {t('illustrationMinistryAssignmentsDescription')}
            </Typography>
          </Box>
          <img src={MinistryAssignments} alt="Ministry Assignments" style={{ width: '100%' }} />
        </Box>

        <Box sx={styles} id="illustration2">
          <Box>
            <Typography variant="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
              {t('illustrationMultiPlattformHeader')}
            </Typography>
            <Typography variant="body-regular" color="var(--always-white)">
              {t('illustrationMultiPlattformDescription')}
            </Typography>
          </Box>
          <img src={MultiPlattform} alt="Multi Plattform" style={{ width: '100%' }} />
        </Box>

        <Box sx={styles} id="illustration3">
          <Box>
            <Typography variant="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
              {t('illustrationMeetingSchedulesHeader')}
            </Typography>
            <Typography variant="body-regular" color="var(--always-white)">
              {t('illustrationMeetingSchedulesDescription')}
            </Typography>
          </Box>
          <img src={MeetingSchedules} alt="Meeting Schedules" style={{ width: '100%' }} />
        </Box>

        <Box sx={styles} id="illustration4">
          <Box>
            <Typography variant="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
              {t('illustrationSecretaryHeader')}
            </Typography>
            <Typography variant="body-regular" color="var(--always-white)">
              {t('illustrationSecretaryDescription')}
            </Typography>
          </Box>
          <img src={Secretary} alt="Secretary" style={{ width: '100%' }} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '34.25px',
          gap: { mobile: '12px', laptop: '16px' },
        }}
      >
        {createArray(4).map((n) => (
          <IconButton
            key={n}
            disableRipple
            sx={{ opacity: n === index ? 1 : 0.48, padding: 0, margin: 0, cursor: 'unset' }}
          >
            <IconEllipse
              color="var(--always-white)"
              width={n === index ? dotSize.active : dotSize.inactive}
              height={n === index ? dotSize.active : dotSize.inactive}
            />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default StartupIllustration;
