import { Fragment, ReactNode } from 'react';
import { Box, Divider } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  IconCongregation,
  IconLock,
  IconMinistry,
  IconApplications,
  IconImportExport,
  IconManageAccess,
  IconPodium,
} from '@components/icons';
import SettingsTab from '@components/settings_tab';
import Typography from '@components/typography';

export type SettingsTabId =
  | 'general'
  | 'meetings'
  | 'privacy'
  | 'ministry'
  | 'app-config'
  | 'user-accounts'
  | 'import-export';

type SettingsSidebarProps = {
  activeTab: SettingsTabId;
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
 * - Width: 296px (fixed, flex-shrink: 0)
 * - Internal gap: dividers between tab items
 * - "Categories" title: h2 typography
 */
const SettingsSidebar = ({ activeTab, onTabChange }: SettingsSidebarProps) => {
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
      renderIcon: (color) => <IconMinistry color={color} />,
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
    <Box
      sx={{
        width: '400px',
        flexShrink: 0,
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignSelf: 'flex-start',
      }}
    >
      <Typography className="h2">{t('tr_categories')}</Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
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
      </Box>
    </Box>
  );
};

export default SettingsSidebar;
