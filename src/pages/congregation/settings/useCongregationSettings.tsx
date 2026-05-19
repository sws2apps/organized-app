import { useCallback, useEffect, useRef, useState } from 'react';
import { SettingsTabId } from '@features/congregation/settings/settings_sidebar';

type MobileView = 'list' | 'detail';

const useCongregationSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabId | string>('general');
  const [mobileView, setMobileView] = useState<MobileView>('list');

  const mobileViewRef = useRef(mobileView);
  mobileViewRef.current = mobileView;

  const handleTabChange = useCallback((tab: SettingsTabId | string) => {
    setActiveTab(tab);
  }, []);

  /** Called by the mobile list when a category is tapped. */
  const handleMobileTabSelect = useCallback(
    (tab: SettingsTabId | string) => {
      setActiveTab(tab);
      setMobileView('detail');
      // Push a history entry so the navbar's navigate(-1) pops us back
      // to the list view instead of navigating away from the page.
      window.history.pushState({ settingsDetailView: true }, '');
    },
    []
  );

  // Listen for popstate to intercept the browser/system back button.
  // Uses a ref so the listener is only registered once.
  useEffect(() => {
    const onPopState = () => {
      if (mobileViewRef.current === 'detail') {
        setMobileView('list');
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return {
    activeTab,
    handleTabChange,
    mobileView,
    handleMobileTabSelect,
  };
};

export default useCongregationSettings;
