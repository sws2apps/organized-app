import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { QuickSettingsUpcomingEventsProps } from './index.types';
import MultiDayDisplay from '@features/congregation/settings/meeting_forms/multiday_display';
import QuickSettings from '@features/quick_settings';

const QuickSettingsUpcomingEvents = ({
  onClose,
  open,
}: QuickSettingsUpcomingEventsProps) => {
  const { t } = useAppTranslation();

  return (
    <QuickSettings title={t('tr_upcomingEvents')} open={open} onClose={onClose}>
      <Stack spacing="16px" width="100%">
        <MultiDayDisplay />
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsUpcomingEvents;
