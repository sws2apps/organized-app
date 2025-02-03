import useAppTranslation from '@hooks/useAppTranslation';
import { QuickSettingsFieldServiceGroupsProps } from './index.types';
import QuickSettings from '@features/quick_settings';
import { Stack } from '@mui/material';
import ShowAwayToAllChange from '@features/congregation/settings/congregation_privacy/show_away_to_all_change';
import GroupPublishersSortMethodChange from '@features/congregation/settings/meeting_forms/group_publishers_sort_change';

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
          <ShowAwayToAllChange />
          <GroupPublishersSortMethodChange />
        </Stack>
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsFieldServiceGroups;
