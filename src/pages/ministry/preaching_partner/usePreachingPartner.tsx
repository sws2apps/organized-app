import { useAtomValue } from 'jotai';
import { partnerCanCreateState } from '@states/preaching_partner';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  PREACHING_PARTNER_TABS,
  PreachingPartnerTab,
} from '@definition/preaching_partner';

export const PREACHING_PARTNER_PATH = '/find-a-preaching-partner';

type MobileView = 'list' | 'detail';

export type NavigationDirection = 'forward' | 'backward' | 'none';

const usePreachingPartner = () => {
  const canCreate = useAtomValue(partnerCanCreateState);
  const navigate = useNavigate();
  const location = useLocation();
  const { tab } = useParams();

  const selectedTab = PREACHING_PARTNER_TABS.find((record) => record === tab);

  const activeTab: PreachingPartnerTab = selectedTab ?? 'my-requests';

  const mobileView: MobileView = selectedTab ? 'detail' : 'list';

  const isUnknownTab = tab !== undefined && selectedTab === undefined;

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // derived during render rather than in an effect, so the new view never
  // paints first with the old animation
  const [renderedView, setRenderedView] = useState(mobileView);
  const [navigationDirection, setNavigationDirection] =
    useState<NavigationDirection>('none');

  if (renderedView !== mobileView) {
    setRenderedView(mobileView);
    setNavigationDirection(mobileView === 'detail' ? 'forward' : 'backward');
  }

  const openTab = useCallback(
    (next: PreachingPartnerTab, replace: boolean) => {
      navigate(`${PREACHING_PARTNER_PATH}/${next}`, {
        replace,
        state: replace ? undefined : { fromPartnerList: true },
      });
    },
    [navigate]
  );

  // side by side the tabs swap in place; on a phone each opens a subpage
  const handleTabChange = useCallback(
    (next: PreachingPartnerTab) => openTab(next, true),
    [openTab]
  );

  const handleMobileTabSelect = useCallback(
    (next: PreachingPartnerTab) => openTab(next, false),
    [openTab]
  );

  const handleBackToList = useCallback(() => {
    if (location.state?.fromPartnerList) {
      navigate(-1);
      return;
    }

    navigate(PREACHING_PARTNER_PATH, { replace: true });
  }, [location.state, navigate]);

  const handleLeave = useCallback(() => navigate('/'), [navigate]);

  const handleOpenEditor = () => setIsEditorOpen(true);

  const handleCloseEditor = () => setIsEditorOpen(false);

  return {
    canCreate,
    activeTab,
    mobileView,
    isUnknownTab,
    navigationDirection,
    isEditorOpen,
    handleTabChange,
    handleMobileTabSelect,
    handleBackToList,
    handleLeave,
    handleOpenEditor,
    handleCloseEditor,
  };
};

export default usePreachingPartner;
