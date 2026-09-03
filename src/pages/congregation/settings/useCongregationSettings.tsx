import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  DEFAULT_SETTINGS_TAB,
  TabId,
  isSettingsTab,
} from '@features/congregation/settings/settings_sidebar/index.types';

type MobileView = 'list' | 'detail';

export type NavigationDirection = 'forward' | 'backward' | 'none';

const useCongregationSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tab } = useParams();

  const basePath = useMemo(
    () => `/${location.pathname.split('/').filter(Boolean)[0] ?? ''}`,
    [location.pathname]
  );

  const selectedTab: TabId | undefined =
    tab && isSettingsTab(tab) ? tab : undefined;

  const activeTab = selectedTab ?? DEFAULT_SETTINGS_TAB;

  const mobileView: MobileView = selectedTab ? 'detail' : 'list';

  const isUnknownTab = tab !== undefined && selectedTab === undefined;

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
    basePath,
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
