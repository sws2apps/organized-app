import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  DEFAULT_SETTINGS_TAB,
  TabId,
  isLanguageGroupTab,
} from '@features/congregation/settings/settings_sidebar/index.types';
import useSettingsTabs from '@features/congregation/settings/settings_sidebar/useSettingsTabs';

type MobileView = 'list' | 'detail';

export type NavigationDirection = 'forward' | 'backward' | 'none';

const useCongregationSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tab } = useParams();

  const tabs = useSettingsTabs();

  const basePath = useMemo(
    () => `/${location.pathname.split('/').filter(Boolean)[0] ?? ''}`,
    [location.pathname]
  );

  // a tab the user may not open (unknown, or not offered to them) is treated
  // as no tab at all, so its content is never rendered
  const selectedTab = useMemo<TabId | undefined>(() => {
    if (!tab) return undefined;

    if (isLanguageGroupTab(tab)) return tab;

    return tabs.find((record) => record.id === tab)?.id;
  }, [tab, tabs]);

  const activeTab = selectedTab ?? DEFAULT_SETTINGS_TAB;

  const mobileView: MobileView = selectedTab ? 'detail' : 'list';

  const isUnknownTab = tab !== undefined && selectedTab === undefined;

  // the direction only changes when the view does, so it is derived from the
  // previous render here rather than in an effect (which would first paint the
  // new view with the old animation)
  const [renderedView, setRenderedView] = useState(mobileView);
  const [navigationDirection, setNavigationDirection] =
    useState<NavigationDirection>('none');

  if (renderedView !== mobileView) {
    setRenderedView(mobileView);
    setNavigationDirection(mobileView === 'detail' ? 'forward' : 'backward');
  }

  const openTab = useCallback(
    (next: TabId, replace: boolean) => {
      navigate(`${basePath}/${next}`, {
        replace,
        state: replace ? undefined : { fromSettingsList: true },
      });
    },
    [basePath, navigate]
  );

  const handleTabChange = useCallback(
    (next: TabId) => openTab(next, true),
    [openTab]
  );

  const handleMobileTabSelect = useCallback(
    (next: TabId) => openTab(next, false),
    [openTab]
  );

  const handleBackToList = useCallback(() => {
    if (location.state?.fromSettingsList) {
      navigate(-1);
      return;
    }

    navigate(basePath, { replace: true });
  }, [basePath, location.state, navigate]);

  const handleLeaveSettings = useCallback(() => navigate('/'), [navigate]);

  return {
    activeTab,
    selectedTab,
    handleBackToList,
    handleLeaveSettings,
    handleMobileTabSelect,
    handleTabChange,
    isUnknownTab,
    mobileView,
    navigationDirection,
  };
};

export default useCongregationSettings;
