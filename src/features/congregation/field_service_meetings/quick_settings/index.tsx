import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import QuickSettings from '@features/quick_settings';
import RecurringTimes from '@features/congregation/settings/field_service_meeting_settings/recurring_times';

type QuickSettingsFieldServiceMeetingsProps = {
  open: boolean;
  onClose: () => void;
};

const QuickSettingsFieldServiceMeetings = ({
  open,
  onClose,
}: QuickSettingsFieldServiceMeetingsProps) => {
  const { t } = useAppTranslation();

  return (
    <QuickSettings
      title={t('tr_fieldServiceMeetings')}
      open={open}
      onClose={onClose}
    >
      <Stack spacing="16px" width="100%">
        <Stack spacing="4px">
          <Typography className="h4">
            {t('tr_recurringMeetingTimes')}
          </Typography>
          <Typography className="body-small-regular" color="var(--grey-400)">
            {t('tr_fieldServiceMeetingTimesDesc')}
          </Typography>
        </Stack>
        <RecurringTimes />
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsFieldServiceMeetings;
