import { useState } from 'react';
import { SettingsTabId } from '@features/congregation/settings/settings_sidebar';

const useCongregationSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabId | string>('general');

  const handleTabChange = (tab: SettingsTabId | string) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    handleTabChange,
  };
};

export default useCongregationSettings;
