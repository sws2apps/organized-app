import useAppTranslation from '@hooks/useAppTranslation';
import { QuickSettingsFieldServiceGroupsProps } from './index.types';
import QuickSettings from '@features/quick_settings';
import { Stack } from '@mui/material';
import SwitchWithLabel from '@components/switch_with_label';
import useCongregationPrivacy from '@features/congregation/settings/congregation_privacy/useCongregationPrivacy';
import useCurrentUser from '@hooks/useCurrentUser';

const QuickSettingsFieldServiceGroups = ({
  onClose,
  open,
}: QuickSettingsFieldServiceGroupsProps) => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();
  const { timeAwayPublic, handleTimeAwayPublicToggle } =
    useCongregationPrivacy();

  return (
    <QuickSettings
      title={t('tr_fieldServiceGroups')}
      open={open}
      onClose={onClose}
    >
      <Stack spacing="16px" width="100%">
        <Stack spacing="16px">
          <SwitchWithLabel
            label={t('tr_showAwayToAll')}
            helper={t('tr_showAwayToAllDesc')}
            checked={timeAwayPublic}
            onChange={handleTimeAwayPublicToggle}
            readOnly={!isAdmin}
          />
        </Stack>
      </Stack>
    </QuickSettings>
  );
};

export default QuickSettingsFieldServiceGroups;
