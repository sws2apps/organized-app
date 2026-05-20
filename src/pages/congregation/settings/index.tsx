import { useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { CardSection, CardSectionHeader, CardSectionContent } from '@features/congregation/settings/shared_styles';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useCongregationSettings from './useCongregationSettings';
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
import CongregationPersons from '@features/congregation/app_access/congregation_persons';
import CongregationVIP from '@features/congregation/app_access/congregation_vip';
import UserAdd from '@features/congregation/app_access/user_add';
import useAllUsers from '../manage_access/all_users/useAllUsers';
import NavBarButton from '@components/nav_bar_button';
import { IconAddPerson } from '@components/icons';
import useLanguageGroups from '@features/congregation/settings/language_groups/useLanguageGroups';
import GroupInfo from '@features/congregation/settings/language_groups/group_info';
import GroupDelete from '@features/congregation/settings/language_groups/group_delete';
import AppConfig from '@features/congregation/settings/app_config';

const CongregationSettings = () => {
  const { t } = useAppTranslation();

  const { tabletLandscapeUp, tablet688Up } = useBreakpoints();

  const { isGroup } = useCurrentUser();

  const { activeTab, handleTabChange, mobileView, setMobileView, handleMobileTabSelect } =
    useCongregationSettings();

  const { userAddOpen, handleCloseUserAdd, isLoading, handleOpenUserAdd } =
    useAllUsers();

  const { languageGroups, fullAccess } = useLanguageGroups();

  const activeTabLabel = useSettingsTabLabel(activeTab);

  // Reset to general tab when a language group is deleted while selected (#3)
  useEffect(() => {
    if (activeTab.startsWith('language-group-')) {
      const groupId = activeTab.replace('language-group-', '');
      const exists = languageGroups.some((g) => g.group_id === groupId);
      if (!exists) {
        handleTabChange('general');
        if (mobileView === 'detail') setMobileView('list');
      }
    }
  }, [languageGroups, activeTab, handleTabChange, mobileView, setMobileView]);

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
    if (activeTab.startsWith('language-group-')) {
      const groupId = activeTab.replace('language-group-', '');
      const group = languageGroups.find((g) => g.group_id === groupId);
      if (group) {
        return (
          <Stack spacing="16px">
            <GroupInfo open={true} onClose={() => handleTabChange('general')} group={group} inline />
            {fullAccess && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: '8px',
                }}
              >
                <GroupDelete group={group} />
              </Box>
            )}
          </Stack>
        );
      }
      return (
        <Stack spacing="16px">
          <CongregationBasic />
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
        return (
          <Stack spacing="16px">
            <CongregationPersons isLoading={isLoading} />
            <CongregationVIP isLoading={isLoading} />
          </Stack>
        );
      case 'meetings':
        return (
          <Stack spacing="16px">
            <MeetingSettings />
            <MeetingForms />
            
            <CardSection>
              <CardSectionHeader
                title={t('tr_meetingReports')}
              />
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
        return <ImportExport open={true} onClose={() => handleTabChange('general')} inline />;
      default:
        return null;
    }
  };

  // ─── Desktop / Landscape Tablet layout ──────────────────────────────────────
  if (tabletLandscapeUp) {
    return (
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle
          title={pageTitle}
          buttons={
            activeTab === 'user-accounts' ? addUserButton : undefined
          }
        />

        {userAddOpen && (
          <UserAdd open={userAddOpen} onClose={handleCloseUserAdd} />
        )}

        <Box sx={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flexShrink: 0,
              width: { tablet: '300px', desktop: '360px', desktopLarge: '400px' },
            }}
          >
            <SettingsSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            <LanguageGroups
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              minWidth: 0,
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </Box>
    );
  }

  // ─── Mobile / Tablet layout ──────────────────────────────────────────────────

  // List view — categories + language groups
  if (mobileView === 'list') {
    return (
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle title={pageTitle} />

        {userAddOpen && (
          <UserAdd open={userAddOpen} onClose={handleCloseUserAdd} />
        )}

        <Stack spacing="16px">
          <SettingsSidebar
            activeTab={activeTab}
            onTabChange={handleMobileTabSelect}
          />
          <LanguageGroups
            activeTab={activeTab}
            onTabChange={handleMobileTabSelect}
          />
        </Stack>
      </Box>
    );
  }

  // Detail view — fullscreen sub-page with back navigation
  // Only add bottom padding when the BottomMenu will render (user-accounts has an Add button)
  const hasBottomActions =
    !tablet688Up && activeTab === 'user-accounts';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: hasBottomActions ? '120px' : '0px',
      }}
    >
      {/* Navbar: title = current tab, secondaryTitle = parent → activates back arrow */}
      <PageTitle
        title={activeTabLabel}
        secondaryTitle={pageTitle}
        buttons={activeTab === 'user-accounts' ? addUserButton : undefined}
      />

      {userAddOpen && (
        <UserAdd open={userAddOpen} onClose={handleCloseUserAdd} />
      )}

      {renderContent()}
    </Box>
  );
};

export default CongregationSettings;
