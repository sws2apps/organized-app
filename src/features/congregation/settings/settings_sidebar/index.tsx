import { Fragment, ReactNode } from 'react';
import { Divider } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  IconCongregation,
  IconLock,
  IconDoor,
  IconApplications,
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

type SettingsSidebarProps = {
  activeTab: SettingsTabId | string;
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

  const tabs: TabConfig[] = [
    {
      id: 'general',
      renderIcon: (color) => <IconCongregation color={color} />,
      label: t('tr_general'),
      description: t('tr_generalSidebarDesc'),
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
      id: 'privacy',
      renderIcon: (color) => <IconLock color={color} />,
      label: t('tr_securityAndPrivacy'),
      description: t('tr_privacySidebarDesc'),
      visible: !isGroup,
    },
    {
      id: 'ministry',
      renderIcon: (color) => <IconDoor color={color} />,
      label: t('tr_ministry'),
      description: t('tr_ministrySidebarDesc'),
      visible: !isGroup,
    },
    {
      id: 'app-config',
      renderIcon: (color) => <IconApplications color={color} />,
      label: t('tr_appConfiguration'),
      description: t('tr_appConfigSidebarDesc'),
      visible: !isGroup,
    },
    {
      id: 'user-accounts',
      renderIcon: (color) => <IconManageAccess color={color} />,
      label: t('tr_manageAccessFullTitle'),
      description: t('tr_manageAccessSidebarDesc'),
      visible: isAdmin && !isGroup,
    },
    {
      id: 'import-export',
      renderIcon: (color) => <IconImportExport color={color} />,
      label: t('tr_importExport'),
      description: t('tr_importExportSidebarDesc'),
      visible: isAdmin && !isGroup,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);

  return (
    <SidebarContainer>
      <Typography className="h2">{t('tr_categories')}</Typography>

      <TabList>
        {visibleTabs.map((tab, index) => (
          <Fragment key={tab.id}>
            <SettingsTab
              renderIcon={tab.renderIcon}
              label={tab.label}
              description={tab.description}
              active={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
            {index < visibleTabs.length - 1 && (
              <Divider sx={{ borderColor: 'var(--accent-200)' }} />
            )}
          </Fragment>
        ))}
      </TabList>
    </SidebarContainer>
  );
};

export default SettingsSidebar;
