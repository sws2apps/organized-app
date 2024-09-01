import { Box } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconLogout } from '@icons/index';
import {
  MinistryPreferences,
  UserAccountSecurity,
  UserAppSettings,
  UserLogoutConfirm,
  UserProfileDetails,
  UserSessions,
  UserTimeAway,
} from '@features/index';
import useMyProfile from './useMyProfile';

const MyProfile = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    isLogoutConfirm,
    handleCloseConfirm,
    handleOpenLogoutConfirm,
    isConnected,
    hoursCreditEnabled,
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
        <UserLogoutConfirm
          open={isLogoutConfirm}
          onClose={handleCloseConfirm}
        />
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

          <UserTimeAway />
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
          <UserAppSettings />
          {isConnected && (
            <>
              <UserAccountSecurity />
              <UserSessions />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MyProfile;
