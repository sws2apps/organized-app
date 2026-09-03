import { useEffect, useState } from 'react';
import { isTest } from '@constants/index';
import { Box, Stack } from '@mui/material';
import {
  CardSection,
  CardSectionHeader,
  CardSectionContent,
} from '@features/congregation/settings/shared_styles';
import {
  PageContainer,
  SplitLayout,
  ContentArea,
  CenteredAction,
  NavigationView,
} from './index.styles';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useCongregationSettings from './useCongregationSettings';
import {
  isLanguageGroupTab,
  languageGroupIdFromTab,
} from '@features/congregation/settings/settings_sidebar/index.types';
import CircuitOverseer from '@features/congregation/settings/circuit_overseer';
import CongregationBasic from '@features/congregation/settings/congregation_basic';
import CongregationPrivacy from '@features/congregation/settings/congregation_privacy';
import ImportExport from '@features/congregation/settings/import_export';
import LanguageGroups from '@features/congregation/settings/language_groups';
import MeetingForms from '@features/congregation/settings/meeting_forms';
import MeetingSettings from '@features/congregation/settings/meeting_settings';
import MeetingAttendance from '@features/congregation/settings/congregation_basic/meeting_attendance';
import MinistrySettings from '@features/congregation/settings/ministry_settings';
import PageTitle from '@components/page_title';
import SettingsSidebar from '@features/congregation/settings/settings_sidebar';
import useSettingsTabLabel from '@features/congregation/settings/settings_sidebar/useSettingsTabLabel';
import UserAccounts from '@features/congregation/settings/user_accounts';
import UserAdd from '@features/congregation/app_access/user_add';
import NavBarButton from '@components/nav_bar_button';
import { IconAddPerson } from '@components/icons';
import useLanguageGroups from '@features/congregation/settings/language_groups/useLanguageGroups';
import GroupInfo from '@features/congregation/settings/language_groups/group_info';
import GroupDelete from '@features/congregation/settings/language_groups/group_delete';
import AppConfig from '@features/congregation/settings/app_config';

const CongregationSettings = () => {
  const { t } = useAppTranslation();

  const { laptopUp, tablet688Up } = useBreakpoints();

  const isSplitScreen = laptopUp;

  const { isGroup } = useCurrentUser();

  const {
    activeTab,
    handleBackToList,
    handleLeaveSettings,
    handleMobileTabSelect,
    handleTabChange,
    isUnknownTab,
    mobileView,
    navigationDirection,
    selectedTab,
  } = useCongregationSettings();

  // opening the settings must not ask for the accounts: the tab that shows
  // them does that when it is mounted
  const [userAddOpen, setUserAddOpen] = useState(false);

  const handleOpenUserAdd = () => setUserAddOpen(true);

  const handleCloseUserAdd = () => setUserAddOpen(false);

  const { languageGroups, fullAccess } = useLanguageGroups();

  const activeTabLabel = useSettingsTabLabel(activeTab);

  // the accounts are never in play while testing, so nothing about them shows
  const showUserAccounts = activeTab === 'user-accounts' && !isTest;

  useEffect(() => {
    if (isUnknownTab) handleBackToList();
  }, [isUnknownTab, handleBackToList]);

  // a group can be deleted while its own tab is open
  useEffect(() => {
    if (!isLanguageGroupTab(activeTab)) return;

    const groupId = languageGroupIdFromTab(activeTab);
    const exists = languageGroups.some((g) => g.group_id === groupId);

    if (!exists) handleBackToList();
  }, [languageGroups, activeTab, handleBackToList]);

  const pageTitle = isGroup
    ? t('tr_groupSettings')
    : t('tr_congregationSettings');

  const addUserButton = (
    <NavBarButton
      text={t('tr_btnAdd')}
      main
      icon={<IconAddPerson />}
      onClick={handleOpenUserAdd}
    />
  );

  const renderContent = () => {
    if (isLanguageGroupTab(activeTab)) {
      const groupId = languageGroupIdFromTab(activeTab);
      const group = languageGroups.find((g) => g.group_id === groupId);
      if (!group) return null;

      return (
        <Stack spacing="16px">
          <GroupInfo
            open={true}
            onClose={handleBackToList}
            group={group}
            inline
          />
          {fullAccess && (
            <CenteredAction>
              <GroupDelete group={group} />
            </CenteredAction>
          )}
        </Stack>
      );
    }

    switch (activeTab) {
      case 'general':
        return (
          <Stack spacing="16px">
            <CongregationBasic />
          </Stack>
        );
      case 'user-accounts':
        return showUserAccounts ? <UserAccounts /> : null;
      case 'meetings':
        return (
          <Stack spacing="16px">
            <MeetingSettings />
            <MeetingForms />

            <CardSection>
              <CardSectionHeader title={t('tr_meetingReports')} />
              <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
                <MeetingAttendance />
              </CardSectionContent>
            </CardSection>

            {!isGroup && <CircuitOverseer />}
          </Stack>
        );
      case 'privacy':
        return <CongregationPrivacy />;
      case 'ministry':
        return <MinistrySettings />;
      case 'app-config':
        return <AppConfig />;
      case 'import-export':
        return <ImportExport open={true} onClose={handleBackToList} inline />;
      default:
        return null;
    }
  };

  // ─── Desktop / Tablet Split-Screen layout ───────────────────────────────────
  if (isSplitScreen) {
    return (
      <PageContainer>
        <PageTitle
          title={pageTitle}
          onBack={handleLeaveSettings}
          buttons={showUserAccounts ? addUserButton : undefined}
        />

        {userAddOpen && (
          <UserAdd open={userAddOpen} onClose={handleCloseUserAdd} />
        )}

        <SplitLayout>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flexShrink: 0,
              width: { tablet: '300px', desktop: '400px' },
            }}
          >
            <SettingsSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              enableKeyboardNavigation
            />
            <LanguageGroups
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Box>

          <ContentArea>{renderContent()}</ContentArea>
        </SplitLayout>
      </PageContainer>
    );
  }

  // ─── Mobile / Tablet layout ──────────────────────────────────────────────────

  // List view — categories + language groups
  if (mobileView === 'list') {
    return (
      <PageContainer>
        <PageTitle title={pageTitle} onBack={handleLeaveSettings} />

        {userAddOpen && (
          <UserAdd open={userAddOpen} onClose={handleCloseUserAdd} />
        )}

        <NavigationView direction={navigationDirection}>
          <SettingsSidebar
            activeTab={selectedTab}
            onTabChange={handleMobileTabSelect}
          />
          <LanguageGroups
            activeTab={selectedTab}
            onTabChange={handleMobileTabSelect}
          />
        </NavigationView>
      </PageContainer>
    );
  }

  // Detail view — fullscreen sub-page with back navigation
  // Only add bottom padding when the BottomMenu will render (user-accounts has an Add button)
  const hasBottomActions = !tablet688Up && showUserAccounts;

  return (
    <PageContainer
      sx={{
        paddingBottom: hasBottomActions ? '120px' : '0px',
      }}
    >
      {/* Navbar: title = current tab, secondaryTitle = parent → activates back arrow */}
      <PageTitle
        title={activeTabLabel}
        secondaryTitle={pageTitle}
        onBack={handleBackToList}
        buttons={showUserAccounts ? addUserButton : undefined}
      />

      {userAddOpen && (
        <UserAdd open={userAddOpen} onClose={handleCloseUserAdd} />
      )}

      <NavigationView key={activeTab} direction={navigationDirection}>
        {renderContent()}
      </NavigationView>
    </PageContainer>
  );
};

export default CongregationSettings;
