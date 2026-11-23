import { Stack } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { QuickSettingsFieldServiceGroupsProps } from './index.types';
import GroupBadgesVisibility from './group_badges_visibility';
import PublishersSort from '@features/congregation/settings/congregation_privacy/publishers_sort';
import QuickSettings from '@features/quick_settings';
import TimeAwayVisibility from '@features/congregation/settings/congregation_privacy/time_away_visibility';

const QuickSettingsFieldServiceGroups = ({
  onClose,
  open,
}: QuickSettingsFieldServiceGroupsProps) => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  return (
    <QuickSettings
      title={t('tr_fieldServiceGroups')}
      open={open}
      onClose={onClose}
    >
      <Stack
        spacing="16px"
        sx={{
          width: '100%',
        }}
      >
        <Stack spacing="16px">
          {isServiceCommittee && (
            <>
              <PublishersSort />
              <TimeAwayVisibility />
            </>
          )}
          <GroupBadgesVisibility />
        </Stack>
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsFieldServiceGroups;
