import React, { Fragment, useCallback } from 'react';
import { Divider } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import SettingsTab from '@components/settings_tab';
import Typography from '@components/typography';
import { SidebarContainer, TabList } from './index.styles';
import { SettingsTabId, TabId } from './index.types';
import useSettingsTabs from './useSettingsTabs';

type SettingsSidebarProps = {
  activeTab?: TabId;
  onTabChange: (tab: SettingsTabId) => void;
  enableKeyboardNavigation?: boolean;
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
  enableKeyboardNavigation = false,
}: SettingsSidebarProps) => {
  const { t } = useAppTranslation();

  const visibleTabs = useSettingsTabs();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enableKeyboardNavigation) return;

      const currentIndex = visibleTabs.findIndex((tab) => tab.id === activeTab);

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
    [activeTab, enableKeyboardNavigation, visibleTabs, onTabChange]
  );

  return (
    <SidebarContainer>
      <Typography className="h2">{t('tr_settings')}</Typography>

      <TabList
        role="tablist"
        aria-label={t('tr_settings')}
        onKeyDown={handleKeyDown}
      >
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
              tabIndex={!activeTab || activeTab === tab.id ? 0 : -1}
            />
            {index < visibleTabs.length - 1 && (
              <Divider
                key={`divider-${tab.id}`}
                sx={{ borderColor: 'var(--accent-200)' }}
              />
            )}
          </Fragment>
        ))}
      </TabList>
    </SidebarContainer>
  );
};

export default SettingsSidebar;
