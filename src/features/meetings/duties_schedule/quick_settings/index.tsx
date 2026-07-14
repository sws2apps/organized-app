import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { QuickSettingsMidweekMeetingProps } from './index.types';
import CustomDuties from '@features/congregation/settings/meeting_duties/custom_duties';
import Divider from '@components/divider';
import DutiesPreventConflict from '@features/congregation/settings/meeting_duties/prevent_conflict';
import MicrophoneSections from '@features/congregation/settings/meeting_duties/microphone_sections';
import QuickSettings from '@features/quick_settings';
import StandardDuties from '@features/congregation/settings/meeting_duties/standard_duties';
import Typography from '@components/typography';

const QuickSettingsMeetingDuties = ({
  onClose,
  open,
}: QuickSettingsMidweekMeetingProps) => {
  const { t } = useAppTranslation();

  return (
    <QuickSettings
      title={t('tr_meetingDutiesSchedules')}
      open={open}
      onClose={onClose}
    >
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
    </QuickSettings>
  );
};

export default QuickSettingsMeetingDuties;
