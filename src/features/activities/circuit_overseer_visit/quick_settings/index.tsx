import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { QuickSettingsCircuitOverseerVisitProps } from './index.types';
import COMidweekMeetingDay from '@features/congregation/settings/circuit_overseer/co_midweek_meeting_day';
import CONames from '@features/congregation/settings/circuit_overseer/co_names';
import COWife from '@features/congregation/settings/circuit_overseer/co_wife';
import QuickSettings from '@features/quick_settings';

const QuickSettingsCircuitOverseerVisit = ({
  open,
  onClose,
}: QuickSettingsCircuitOverseerVisitProps) => {
  const { t } = useAppTranslation();

  return (
    <QuickSettings
      title={t('tr_COVisitSchedule')}
      open={open}
      onClose={onClose}
    >
      <Stack spacing="16px" sx={{ width: '100%' }}>
        <CONames />
        <COWife />
        <COMidweekMeetingDay />
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsCircuitOverseerVisit;
