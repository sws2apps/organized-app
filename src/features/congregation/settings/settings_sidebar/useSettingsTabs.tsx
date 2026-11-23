import { ReactNode, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { isTest } from '@constants/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { congAccountConnectedState } from '@states/app';
import {
  IconCongregation,
  IconCustomSchedule,
  IconDoor,
  IconImportExport,
  IconLock,
  IconManageAccess,
  IconPodium,
} from '@components/icons';
import { SettingsTabId } from './index.types';

export type SettingsTabConfig = {
  id: SettingsTabId;
  renderIcon: (color: string) => ReactNode;
  label: string;
  description: string;
};

/**
 * The settings tabs the current user may open, in sidebar order.
 *
 * The sidebar, the route validation and the mobile navbar title all read this
 * list, so a tab that is not offered here can neither be selected nor rendered.
 */
const useSettingsTabs = () => {
  const { t } = useAppTranslation();
  const { isGroup, isAdmin } = useCurrentUser();

  const isConnected = useAtomValue(congAccountConnectedState);

  return useMemo<SettingsTabConfig[]>(() => {
    const tabs: (SettingsTabConfig & { visible: boolean })[] = [
      {
        id: 'general',
        renderIcon: (color) => <IconCongregation color={color} />,
        label: t('tr_general'),
        description: t('tr_basicCongregationInformation'),
        visible: true,
      },
      {
        id: 'meetings',
        renderIcon: (color) => <IconPodium color={color} />,
        label: t('tr_meetingsAndMaterials'),
        description: t('tr_meetingSettingsSidebarDesc'),
        visible: true,
      },
      {
        id: 'ministry',
        renderIcon: (color) => <IconDoor color={color} />,
        label: t('tr_ministry'),
        description: t('tr_ministrySidebarDesc'),
        visible: !isGroup,
      },
      {
        id: 'user-accounts',
        renderIcon: (color) => <IconManageAccess color={color} />,
        label: t('tr_manageAccessFullTitle'),
        description: t('tr_manageAccessSidebarDesc'),
        // the accounts live on the server, and no account is fetched while
        // testing, so the tab is only offered when it can actually load
        visible: isConnected && isAdmin && !isGroup && !isTest,
      },
      {
        id: 'privacy',
        renderIcon: (color) => <IconLock color={color} />,
        label: t('tr_securityAndPrivacy'),
        description: t('tr_privacySidebarDesc'),
        visible: !isGroup,
      },
      {
        id: 'app-config',
        renderIcon: (color) => <IconCustomSchedule color={color} />,
        label: t('tr_appConfiguration'),
        description: t('tr_appConfigSidebarDesc'),
        visible: !isGroup,
      },
      {
        id: 'import-export',
        renderIcon: (color) => <IconImportExport color={color} />,
        label: t('tr_importExport'),
        description: t('tr_importExportSidebarDesc'),
        visible: isAdmin && !isGroup,
      },
    ];

    return tabs.filter((tab) => tab.visible);
  }, [t, isGroup, isAdmin, isConnected]);
};

export default useSettingsTabs;
