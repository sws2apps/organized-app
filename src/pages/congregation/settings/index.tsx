import { Box, Stack } from '@mui/material';
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
import MinistrySettings from '@features/congregation/settings/ministry_settings';
import PageTitle from '@components/page_title';
import SettingsSidebar from '@features/congregation/settings/settings_sidebar';
import CongregationPersons from '@features/congregation/app_access/congregation_persons';
import CongregationVIP from '@features/congregation/app_access/congregation_vip';
import UserAdd from '@features/congregation/app_access/user_add';
import useAllUsers from '../manage_access/all_users/useAllUsers';
import NavBarButton from '@components/nav_bar_button';
import { IconAddPerson } from '@components/icons';
import useLanguageGroups from '@features/congregation/settings/language_groups/useLanguageGroups';
import GroupInfo from '@features/congregation/settings/language_groups/group_info';
import GroupFormat from '@features/congregation/settings/language_groups/group_format';
import GroupDelete from '@features/congregation/settings/language_groups/group_delete';
import AppConfig from '@features/congregation/settings/app_config';

const CongregationSettings = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

  const { isGroup } = useCurrentUser();

  const { activeTab, handleTabChange } = useCongregationSettings();

  const { userAddOpen, handleCloseUserAdd, isLoading, handleOpenUserAdd } =
    useAllUsers();

  const { languageGroups, fullAccess } = useLanguageGroups();

  const renderContent = () => {
    if (activeTab.startsWith('language-group-')) {
      const groupId = activeTab.replace('language-group-', '');
      const group = languageGroups.find((g) => g.group_id === groupId);
      if (group) {
        return (
          <Stack spacing="16px">
            <GroupInfo open={true} onClose={() => {}} group={group} inline />
            <GroupFormat groupId={groupId} />
            {fullAccess && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: '8px' }}>
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: desktopUp ? 'row' : 'column',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <CongregationPersons isLoading={isLoading} />
            <CongregationVIP isLoading={isLoading} />
          </Box>
        );
      case 'meetings':
        return (
          <Stack spacing="16px">
            <MeetingForms />
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
        return <ImportExport open={true} onClose={() => {}} inline />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle
        title={isGroup ? t('tr_groupSettings') : t('tr_congregationSettings')}
        buttons={
          activeTab === 'user-accounts' ? (
            <NavBarButton
              text={t('tr_btnAdd')}
              main
              icon={<IconAddPerson />}
              onClick={handleOpenUserAdd}
            ></NavBarButton>
          ) : undefined
        }
      />

      {userAddOpen && (
        <UserAdd open={userAddOpen} onClose={handleCloseUserAdd} />
      )}

      {desktopUp && (
        <Box
          sx={{
            display: 'flex',
            gap: '24px',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
            <SettingsSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            <LanguageGroups activeTab={activeTab} onTabChange={handleTabChange} />
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
      )}

      {!desktopUp && (
        <Stack spacing="16px">
          {activeTab.startsWith('language-group-') && (
            <GroupInfo
              open={true}
              onClose={() => handleTabChange('general')}
              group={languageGroups.find((g) => g.group_id === activeTab.replace('language-group-', ''))!}
              inline={false}
            />
          )}

          {isGroup && <LanguageGroups activeTab={activeTab} onTabChange={handleTabChange} />}

          <CongregationBasic />
          <MeetingForms />

          {!isGroup && (
            <>
              <MinistrySettings />
              <AppConfig />
              <CircuitOverseer />
              <LanguageGroups activeTab={activeTab} onTabChange={handleTabChange} />
              <CongregationPrivacy />
            </>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default CongregationSettings;
