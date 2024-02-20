import { Box } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconLogout } from '@icons/index';
import { MinistryPreferences, UserAppSettings, UserProfileDetails, UserTimeAway } from '@features/index';

const MyProfile = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_myProfile')}
        backTo="/"
        buttons={
          <Button variant="main" color="red" startIcon={<IconLogout />}>
            {t('tr_logOut')}
          </Button>
        }
      />

      {/* container */}
      <Box sx={{ display: 'flex', gap: '16px', flexWrap: desktopUp ? 'nowrap' : 'wrap' }}>
        {/* left-column */}
        <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column', width: '100%', flexGrow: 1 }}>
          <UserProfileDetails />
          <MinistryPreferences />
          <UserTimeAway />
        </Box>

        {/* right-column */}
        <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column', width: '100%', flexGrow: 1 }}>
          <UserAppSettings />
        </Box>
      </Box>
    </Box>
  );
};

export default MyProfile;
