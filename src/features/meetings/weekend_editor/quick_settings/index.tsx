import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { QuickSettingsWeekendMeetingProps } from './index.types';
import DayTime from '@features/congregation/settings/meeting_settings/weekend/day_time';
import AssignmentPreferences from '@features/congregation/settings/meeting_settings/weekend/assignment_preferences';
import DisplayName from '@features/congregation/settings/meeting_forms/display_name';
import Divider from '@components/divider';
import MonthlyWarning from '@features/congregation/settings/meeting_settings/weekend/monthly_warning';
import OutgoingTalkAccess from '@features/congregation/settings/congregation_privacy/outgoing_talk_access';
import QuickSettings from '@features/quick_settings';
import StudyConductor from '@features/congregation/settings/meeting_settings/weekend/study_conductor';
import Typography from '@components/typography';

const QuickSettingsWeekendMeeting = ({
  onClose,
  open,
}: QuickSettingsWeekendMeetingProps) => {
  const { t } = useAppTranslation();

  return (
    <QuickSettings title={t('tr_weekendMeeting')} open={open} onClose={onClose}>
      <Stack
        spacing="16px"
        width="100%"
        divider={<Divider color="var(--accent-200)" />}
      >
        <Stack spacing="16px">
          <DayTime />

          <StudyConductor />

          <DisplayName />
        </Stack>

        <Stack spacing="16px">
          <MonthlyWarning />

          <OutgoingTalkAccess />
        </Stack>

        <Stack spacing="16px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_assignmentPreferences')}
          </Typography>
          <AssignmentPreferences />
        </Stack>
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsWeekendMeeting;
