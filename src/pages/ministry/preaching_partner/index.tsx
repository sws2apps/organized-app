import { partnerDemoMode } from '@constants/index';
import { useAtomValue } from 'jotai';
import {
  partnerConnectionState,
  partnerReadyState,
} from '@states/preaching_partner';
import PartnerSyncStatus from '@features/ministry/preaching_partner/sync_status';
import InfoNote from '@components/info_note';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { IconAddPerson } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  ContentArea,
  NavigationView,
  SplitLayout,
} from '@pages/ministry/preaching_partner/index.styles';
import usePreachingPartner from '@pages/ministry/preaching_partner/usePreachingPartner';
import usePreachingPartnerTabs from '@features/ministry/preaching_partner/requests_nav/usePreachingPartnerTabs';
import CongregationRequests from '@features/ministry/preaching_partner/congregation_requests';
import MyRequests from '@features/ministry/preaching_partner/my_requests';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import PreachingPartnerEditor from '@features/ministry/preaching_partner/request_editor';
import PreachingPartnerNav from '@features/ministry/preaching_partner/requests_nav';

const PreachingPartner = () => {
  const { t } = useAppTranslation();
  const connection = useAtomValue(partnerConnectionState);
  const ready = useAtomValue(partnerReadyState);

  const { laptopUp, tablet688Up } = useBreakpoints();

  const {
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
  } = usePreachingPartner();

  const tabs = usePreachingPartnerTabs();

  const pageTitle = t(
    partnerDemoMode ? 'tr_partnerDemoTitle' : 'tr_findPreachingPartner'
  );

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  useEffect(() => {
    if (isUnknownTab) handleBackToList();
  }, [isUnknownTab, handleBackToList]);

  const newRequestButton = canCreate && ready && (
    <NavBarButtonGroup>
      <NavBarButton
        text={t('tr_newPartnerRequest')}
        icon={<IconAddPerson />}
        onClick={handleOpenEditor}
      ></NavBarButton>
    </NavBarButtonGroup>
  );

  const demoNotice = partnerDemoMode ? (
    <InfoNote variant="card" message={t('tr_partnerDemoNotice')} />
  ) : (
    <PartnerSyncStatus />
  );
  const identityNotice = !canCreate && (
    <InfoNote variant="card" message={t('tr_partnerIdentityRequired')} />
  );

  const content =
    activeTab === 'my-requests' ? <MyRequests /> : <CongregationRequests />;

  const editor = isEditorOpen && (
    <PreachingPartnerEditor
      open={isEditorOpen}
      onClose={handleCloseEditor}
      onSaved={() => {
        if (laptopUp) handleTabChange('my-requests');
        else if (mobileView === 'list') handleMobileTabSelect('my-requests');
        else handleTabChange('my-requests');
      }}
    />
  );

  const pageSx = {
    display: 'flex',
    overflowX: 'clip',
    gap: '16px',
    flexDirection: 'column',
    // the New request button floats over the bottom of a phone screen
    paddingBottom: !tablet688Up ? '120px' : '0px',
  };

  if (!partnerDemoMode && !connection)
    return (
      <Box sx={pageSx}>
        <PageTitle title={pageTitle} onBack={handleLeave} />
        <InfoNote message={t('tr_partnerSyncAccess')} />
      </Box>
    );

  if (laptopUp) {
    return (
      <Box sx={pageSx}>
        <PageTitle title={pageTitle} buttons={newRequestButton} />

        {demoNotice}
        {identityNotice}
        {editor}

        <SplitLayout>
          <Box sx={{ flexShrink: 0, width: '30%', minWidth: 0 }}>
            <PreachingPartnerNav
              value={activeTab}
              onChange={handleTabChange}
              enableKeyboardNavigation
            />
          </Box>

          <ContentArea
            role="tabpanel"
            tabIndex={0}
            id={`preaching-partner-tabpanel-${activeTab}`}
            aria-labelledby={`preaching-partner-tab-${activeTab}`}
          >
            {content}
          </ContentArea>
        </SplitLayout>
      </Box>
    );
  }

  if (mobileView === 'list') {
    return (
      <Box sx={pageSx}>
        <PageTitle
          title={pageTitle}
          onBack={handleLeave}
          buttons={newRequestButton}
        />

        {demoNotice}
        {identityNotice}
        {editor}

        <NavigationView direction={navigationDirection}>
          <PreachingPartnerNav onChange={handleMobileTabSelect} />
        </NavigationView>
      </Box>
    );
  }

  // the open tab takes the whole screen, named in the navbar above its parent
  return (
    <Box sx={pageSx}>
      <PageTitle
        title={activeTabLabel}
        secondaryTitle={pageTitle}
        onBack={handleBackToList}
        buttons={newRequestButton}
      />

      {demoNotice}
      {identityNotice}
      {editor}

      <NavigationView key={activeTab} direction={navigationDirection}>
        {content}
      </NavigationView>
    </Box>
  );
};

export default PreachingPartner;
