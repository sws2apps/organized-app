import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { CardSection, CardSectionHeader } from '../shared_styles';
import CustomDuties from './custom_duties';
import Divider from '@components/divider';
import DutiesPreventConflict from './prevent_conflict';
import MicrophoneSections from './microphone_sections';
import StandardDuties from './standard_duties';
import Typography from '@components/typography';

const MeetingDutiesSettings = () => {
  const { t } = useAppTranslation();

  return (
    <CardSection>
      <CardSectionHeader title={t('tr_meetingDutiesSchedules')} />

      <Stack
        spacing="16px"
        width="100%"
        divider={<Divider color="var(--accent-200)" />}
      >
        <Stack spacing="16px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_assignmentPreferences')}
          </Typography>

          <DutiesPreventConflict />
        </Stack>

        <Stack spacing="16px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_dutiesConfiguration')}
          </Typography>

          <MicrophoneSections />

          <StandardDuties />
        </Stack>

        <Stack spacing="16px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_dutiesCustom')}
          </Typography>

          <CustomDuties />
        </Stack>
      </Stack>
    </CardSection>
  );
};

export default MeetingDutiesSettings;
