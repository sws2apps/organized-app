import React, { Fragment, ReactNode, useCallback, useMemo } from 'react';
import { Divider } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  IconCongregation,
  IconLock,
  IconDoor,
  IconCustomSchedule,
  IconImportExport,
  IconManageAccess,
  IconPodium,
} from '@components/icons';
import SettingsTab from '@components/settings_tab';
import Typography from '@components/typography';
import { SidebarContainer, TabList } from './index.styles';

export type SettingsTabId =
  | 'general'
  | 'meetings'
  | 'privacy'
  | 'ministry'
  | 'app-config'
  | 'user-accounts'
  | 'import-export';

import { TabId } from '@pages/congregation/settings/useCongregationSettings';

type SettingsSidebarProps = {
  activeTab: TabId;
  onTabChange: (tab: SettingsTabId) => void;
};

type TabConfig = {
  id: SettingsTabId;
  renderIcon: (color: string) => ReactNode;
  label: string;
  description: string;
  visible: boolean;
};

/**
 * Categories sidebar for the Settings redesign.
 * Penpot specs:
 * - Card: white bg, 1px accent-300 border, 12px radius, 16px padding
 * - Width: 400px (fixed, flex-shrink: 0) — desktop; 100% on mobile
 * - Internal gap: dividers between tab items
 * - "Categories" title: h2 typography
 */
const SettingsSidebar = ({
  activeTab,
  onTabChange,
}: SettingsSidebarProps) => {
  const { t } = useAppTranslation();
  const { isGroup, isAdmin } = useCurrentUser();

  const visibleTabs = useMemo<TabConfig[]>(
    () =>
      [
        {
          id: 'general' as SettingsTabId,
          renderIcon: (color) => <IconCongregation color={color} />,
          label: t('tr_general'),
          description: t('tr_basicCongregationInformation'),
          visible: true,
        },
        {
          id: 'meetings' as SettingsTabId,
          renderIcon: (color) => <IconPodium color={color} />,
          label: t('tr_meetingsAndMaterials'),
          description: t('tr_meetingSettingsSidebarDesc'),
          visible: true,
        },
        {
          id: 'ministry' as SettingsTabId,
          renderIcon: (color) => <IconDoor color={color} />,
          label: t('tr_ministry'),
          description: t('tr_ministrySidebarDesc'),
          visible: !isGroup,
        },
        {
          id: 'user-accounts' as SettingsTabId,
          renderIcon: (color) => <IconManageAccess color={color} />,
          label: t('tr_manageAccessFullTitle'),
          description: t('tr_manageAccessSidebarDesc'),
          visible: isAdmin && !isGroup,
        },
        {
          id: 'privacy' as SettingsTabId,
          renderIcon: (color) => <IconLock color={color} />,
          label: t('tr_securityAndPrivacy'),
          description: t('tr_privacySidebarDesc'),
          visible: !isGroup,
        },
        {
          id: 'app-config' as SettingsTabId,
          renderIcon: (color) => <IconCustomSchedule color={color} />,
          label: t('tr_appConfiguration'),
          description: t('tr_appConfigSidebarDesc'),
          visible: !isGroup,
        },
        {
          id: 'import-export' as SettingsTabId,
          renderIcon: (color) => <IconImportExport color={color} />,
          label: t('tr_importExport'),
          description: t('tr_importExportSidebarDesc'),
          visible: isAdmin && !isGroup,
        },
      ].filter((tab) => tab.visible),
    [t, isGroup, isAdmin]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = visibleTabs.findIndex(
        (tab) => tab.id === activeTab
      );

      let nextIndex: number | undefined;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % visibleTabs.length;
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextIndex =
            (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = visibleTabs.length - 1;
          break;
      }

      if (nextIndex !== undefined) {
        onTabChange(visibleTabs[nextIndex].id);
      }
    },
    [activeTab, visibleTabs, onTabChange]
  );

  return (
    <SidebarContainer>
      <Typography className="h2">{t('tr_settings')}</Typography>

      <TabList role="tablist" aria-label={t('tr_settings')} onKeyDown={handleKeyDown}>
        {visibleTabs.map((tab, index) => (
          <Fragment key={tab.id}>
            <SettingsTab
              renderIcon={tab.renderIcon}
              label={tab.label}
              description={tab.description}
              active={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`settings-tabpanel-${tab.id}`}
              id={`settings-tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            />
            {index < visibleTabs.length - 1 && (
              <Divider key={`divider-${tab.id}`} sx={{ borderColor: 'var(--accent-200)' }} />
            )}
          </Fragment>
        ))}
      </TabList>
    </SidebarContainer>
  );
};

export default SettingsSidebar;
