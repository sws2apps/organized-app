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
      if (mobileViewRef.current === 'detail') {
        // Already in detail view — replace, don't push another entry
        globalThis.history.replaceState({ settingsDetailView: true }, '');
      } else {
        // Only push one entry when transitioning from list → detail
        setMobileView('detail');
        globalThis.history.pushState({ settingsDetailView: true }, '');
      }
    },
    []
  );

  // Listen for popstate to intercept the browser/system back button.
  // Only intercept events for our own synthetic history entries.
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (mobileViewRef.current === 'detail') {
        if (event.state?.settingsDetailView) {
          // If we are already in detail view, and the new state is ALSO detail view, do nothing.
          // This happens if they navigate forward, or if there's multiple pushed states.
        } else {
          // Navigating back from the detail view pushes us to a state without `settingsDetailView`.
          setMobileView('list');
        }
      } else if (mobileViewRef.current === 'list' && event.state?.settingsDetailView) {
        // Navigating forward from list view into a detail view state.
        setMobileView('detail');
      }
    };

    globalThis.addEventListener('popstate', onPopState);
    return () => {
      globalThis.removeEventListener('popstate', onPopState);
      // Clean up the synthetic history entry if we unmount while in detail view
      if (mobileViewRef.current === 'detail') {
        globalThis.history.back();
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

