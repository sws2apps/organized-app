import { useCallback, useEffect, useRef, useState } from 'react';
import { SettingsTabId } from '@features/congregation/settings/settings_sidebar';

export type TabId = SettingsTabId | `language-group-${string}`;
type MobileView = 'list' | 'detail';

const useCongregationSettings = () => {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [mobileView, setMobileView] = useState<MobileView>('list');

  const mobileViewRef = useRef(mobileView);
  mobileViewRef.current = mobileView;

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, []);

  /** Called by the mobile list when a category is tapped. */
  const handleMobileTabSelect = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      if (mobileViewRef.current !== 'detail') {
        // Only push one entry when transitioning from list → detail
        setMobileView('detail');
        window.history.pushState({ settingsDetailView: true }, '');
      } else {
        // Already in detail view — replace, don't push another entry
        window.history.replaceState({ settingsDetailView: true }, '');
      }
    },
    []
  );

  // Listen for popstate to intercept the browser/system back button.
  // Only intercept events for our own synthetic history entries.
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (
        mobileViewRef.current === 'detail' &&
        event.state?.settingsDetailView
      ) {
        setMobileView('list');
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      // Clean up the synthetic history entry if we unmount while in detail view
      if (mobileViewRef.current === 'detail') {
        window.history.back();
      }
    };
  }, []);

  return {
    activeTab,
    handleTabChange,
    mobileView,
    setMobileView,
    handleMobileTabSelect,
  };
};

export default useCongregationSettings;

