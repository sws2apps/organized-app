import { Stack } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { QuickSettingsWeekendMeetingProps } from './index.types';
import DayTime from '@features/congregation/settings/meeting_settings/weekend/day_time';
import AssignmentPreferences from '@features/congregation/settings/meeting_settings/weekend/assignment_preferences';
import DisplayName from '@features/congregation/settings/meeting_forms/display_name';
import Divider from '@components/divider';
import MonthlyWarning from '@features/congregation/settings/meeting_settings/weekend/monthly_warning';
import OutgoingTalkAccess from '@features/congregation/settings/congregation_privacy/outgoing_talk_access';
import QuickSettings from '@features/quick_settings';
import SongsWeekend from '@features/congregation/settings/meeting_forms/songs_weekend';
import StudyConductor from '@features/congregation/settings/meeting_settings/weekend/study_conductor';
import Typography from '@components/typography';

const QuickSettingsWeekendMeeting = ({
  onClose,
  open,
}: QuickSettingsWeekendMeetingProps) => {
  const { t } = useAppTranslation();

  const { isWeekendEditor, isPublicTalkCoordinator } = useCurrentUser();

  return (
    <QuickSettings title={t('tr_weekendMeeting')} open={open} onClose={onClose}>
      <Stack
        spacing="16px"
        width="100%"
        divider={<Divider color="var(--accent-200)" />}
      >
        <Stack spacing="16px">
          <DayTime />

          {isWeekendEditor && <StudyConductor />}

          <SongsWeekend />

          <DisplayName />
        </Stack>

        <Stack spacing="16px">
          <MonthlyWarning />

          {isPublicTalkCoordinator && <OutgoingTalkAccess />}
        </Stack>

        <Stack spacing="16px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_assignmentPreferences')}
          </Typography>
          <AssignmentPreferences quickSettings={true} />
        </Stack>
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsWeekendMeeting;
