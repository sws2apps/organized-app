import { Box } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import { IconLogout } from '@icons/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMyProfile from './useMyProfile';
import AppSettings from '@features/my_profile/app_settings';
import LogoutConfirm from '@features/my_profile/logout_confirm';
import MinistryPreferences from '@features/my_profile/ministry_preferences';
import Security from '@features/my_profile/security';
import UserProfileDetails from '@features/my_profile/user_profile_details';
import UserSessions from '@features/my_profile/sessions';
import UserTimeAway from '@features/my_profile/user_time_away';

const MyProfile = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    isLogoutConfirm,
    handleCloseConfirm,
    handleOpenLogoutConfirm,
    isConnected,
    hoursCreditEnabled,
    showTimeAway,
  } = useMyProfile();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_myProfile')}
        buttons={
          <Button
            variant="main"
            color="red"
            startIcon={<IconLogout />}
            onClick={handleOpenLogoutConfirm}
          >
            {t('tr_logOut')}
          </Button>
        }
      />

      {isLogoutConfirm && (
        <LogoutConfirm open={isLogoutConfirm} onClose={handleCloseConfirm} />
      )}

      {/* container */}
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexWrap: desktopUp ? 'nowrap' : 'wrap',
        }}
      >
        {/* left-column */}
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
            width: '100%',
            flexGrow: 1,
          }}
        >
          <UserProfileDetails />

          {hoursCreditEnabled && <MinistryPreferences />}

          {showTimeAway && <UserTimeAway />}
        </Box>

        {/* right-column */}
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
            width: '100%',
            flexGrow: 1,
          }}
        >
          <AppSettings />

          {isConnected && <Security />}

          {isConnected && <UserSessions />}
        </Box>
      </Box>
    </Box>
  );
};

export default MyProfile;
