import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { TabId, isLanguageGroupTab } from './index.types';
import useSettingsTabs from './useSettingsTabs';

/**
 * Hook that returns the display label for a given settings tab id.
 * Used by the mobile sub-page to populate the navbar title.
 */
const useSettingsTabLabel = (tabId: TabId): string => {
  const { t } = useAppTranslation();
  const { isGroup } = useCurrentUser();

  const tabs = useSettingsTabs();

  if (isLanguageGroupTab(tabId)) {
    return isGroup ? t('tr_groupSettings') : t('tr_languageGroup');
  }

  return tabs.find((tab) => tab.id === tabId)?.label ?? '';
};

export default useSettingsTabLabel;
