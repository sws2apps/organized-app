import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { QuickSettingsMidweekMeetingProps } from './index.types';
import AuxiliaryClassroom from '@features/congregation/settings/meeting_settings/midweek/auxiliary_classroom';
import DayTime from '@features/congregation/settings/meeting_settings/midweek/day_time';
import DisplayName from '@features/congregation/settings/meeting_forms/display_name';
import Divider from '@components/divider';
import LinkedParts from '@features/congregation/settings/meeting_settings/midweek/linked_parts';
import MidweekExactDate from '@features/congregation/settings/meeting_forms/midweek_exact_date';
import QuickSettings from '@features/quick_settings';
import Typography from '@components/typography';

const QuickSettingsMidweekMeeting = ({
  onClose,
  open,
}: QuickSettingsMidweekMeetingProps) => {
  const { t } = useAppTranslation();

  return (
    <QuickSettings title={t('tr_midweekMeeting')} open={open} onClose={onClose}>
      <Stack
        spacing="16px"
        width="100%"
        divider={<Divider color="var(--accent-200)" />}
      >
        <Stack spacing="16px">
          <DayTime />

          <MidweekExactDate />

          <DisplayName />
        </Stack>

        <Stack spacing="16px">
          <AuxiliaryClassroom />
        </Stack>

        <Stack spacing="16px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_linkedParts')}
          </Typography>
          <LinkedParts />
        </Stack>
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsMidweekMeeting;
