import { useAtomValue } from 'jotai';
import { groupBadgesEnabledState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useGroupBadgesVisibility = () => {
  const badgesEnabled = useAtomValue(groupBadgesEnabledState);

  const handleBadgesToggle = async (value: boolean) => {
    await dbAppSettingsUpdate({
      'user_settings.group_badges_enabled': {
        value,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return { badgesEnabled, handleBadgesToggle };
};

export default useGroupBadgesVisibility;
