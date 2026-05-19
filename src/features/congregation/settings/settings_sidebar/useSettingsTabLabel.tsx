import { useAppTranslation, useCurrentUser } from '@hooks/index';

/**
 * Hook that returns the display label for a given settings tab id.
 * Used by the mobile sub-page to populate the navbar title.
 */
const useSettingsTabLabel = (tabId: string): string => {
  const { t } = useAppTranslation();
  const { isGroup } = useCurrentUser();

  const labelMap: Record<string, string> = {
    general: t('tr_general'),
    meetings: t('tr_meetingsAndMaterials'),
    privacy: t('tr_securityAndPrivacy'),
    ministry: t('tr_ministry'),
    'app-config': t('tr_appConfiguration'),
    'user-accounts': t('tr_manageAccessFullTitle'),
    'import-export': t('tr_importExport'),
  };

  if (tabId.startsWith('language-group-')) {
    return isGroup ? t('tr_groupSettings') : t('tr_languageGroup');
  }

  return labelMap[tabId] ?? '';
};

export default useSettingsTabLabel;
