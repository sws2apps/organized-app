import { useEffect } from 'react';
import { Box } from '@mui/material';
import { IconAddPerson } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ContentArea, NavigationView, SplitLayout } from './index.styles';
import usePreachingPartner from './usePreachingPartner';
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

  const { laptopUp, tablet688Up } = useBreakpoints();

  const {
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

  const pageTitle = t('tr_findPreachingPartner');

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  useEffect(() => {
    if (isUnknownTab) handleBackToList();
  }, [isUnknownTab, handleBackToList]);

  const newRequestButton = (
    <NavBarButtonGroup>
      <NavBarButton
        text={t('tr_newPartnerRequest')}
        icon={<IconAddPerson />}
        onClick={handleOpenEditor}
      ></NavBarButton>
    </NavBarButtonGroup>
  );

  const content =
    activeTab === 'my-requests' ? <MyRequests /> : <CongregationRequests />;

  const editor = isEditorOpen && (
    <PreachingPartnerEditor open={isEditorOpen} onClose={handleCloseEditor} />
  );

  const pageSx = {
    display: 'flex',
    gap: '16px',
    flexDirection: 'column',
    // the New request button floats over the bottom of a phone screen
    paddingBottom: !tablet688Up ? '120px' : '0px',
  };

  if (laptopUp) {
    return (
      <Box sx={pageSx}>
        <PageTitle title={pageTitle} buttons={newRequestButton} />

        {editor}

        <SplitLayout>
          <Box sx={{ flexShrink: 0, width: '400px' }}>
            <PreachingPartnerNav
              value={activeTab}
              onChange={handleTabChange}
              enableKeyboardNavigation
            />
          </Box>

          <ContentArea
            role="tabpanel"
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

      {editor}

      <NavigationView key={activeTab} direction={navigationDirection}>
        {content}
      </NavigationView>
    </Box>
  );
};

export default PreachingPartner;
