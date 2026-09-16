import { useAtomValue } from 'jotai';
import { groupBadgesEnabledState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import SwitchWithLabel from '@components/switch_with_label';
import useAppTranslation from '@hooks/useAppTranslation';

const GroupBadgesVisibility = () => {
  const { t } = useAppTranslation();

  const badgesEnabled = useAtomValue(groupBadgesEnabledState);

  const handleToggle = async (value: boolean) => {
    await dbAppSettingsUpdate({
      'user_settings.group_badges_enabled': {
        value,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <SwitchWithLabel
      label={t('tr_showGroupBadges')}
      helper={t('tr_showGroupBadgesDesc')}
      checked={badgesEnabled}
      onChange={handleToggle}
    />
  );
};

export default GroupBadgesVisibility;
