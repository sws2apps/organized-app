import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { QuickSettingsFieldServiceGroupsProps } from './index.types';
import PublishersSort from '@features/congregation/settings/congregation_privacy/publishers_sort';
import QuickSettings from '@features/quick_settings';
import TimeAwayVisibility from '@features/congregation/settings/congregation_privacy/time_away_visibility';

const QuickSettingsFieldServiceGroups = ({
  onClose,
  open,
}: QuickSettingsFieldServiceGroupsProps) => {
  const { t } = useAppTranslation();

  return (
    <QuickSettings
      title={t('tr_fieldServiceGroups')}
      open={open}
      onClose={onClose}
    >
      <Stack spacing="16px" width="100%">
        <Stack spacing="16px">
          <TimeAwayVisibility />
          <PublishersSort />
        </Stack>
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsFieldServiceGroups;
