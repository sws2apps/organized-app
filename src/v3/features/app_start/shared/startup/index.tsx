import { Box } from '@mui/material';
import { WaitingCircular } from '@components';
import { AccountChooser, PocketStartup, VipStartup } from '@features/app_start';
import StartupIllustration from '../illustration';
import UnauthorizedRole from '../unauthorized_role';
import useStartup from './useStartup';
import { IconLogo } from '@icons';

const Startup = () => {
  const { isSetup, isAuth, isAccountChoose, accountType, isUnauthorizedRole } = useStartup();

  if (isSetup) {
    return (
      <>
        {isAuth && <WaitingCircular />}
        {!isAuth && (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: { mobile: 'column', laptop: isUnauthorizedRole ? 'column' : 'row' },
              gap: { mobile: '16px', laptop: '24px' },
              marginBottom: '32px',
              overflow: 'auto',
            }}
          >
            {!isUnauthorizedRole && (
              <>
                <Box
                  sx={{
                    maxWidth: { mobile: '100%', laptop: '552px' },
                    padding: { mobile: '16px', laptop: '32px' },
                    borderRadius: 'var(--radius-xxl)',
                    border: '1px solid var(--accent-300)',
                    background: 'var(--white)',
                    display: 'flex',
                    flex: { mobile: '1 0 250px', laptop: '1 0 0' },
                  }}
                >
                  {isAccountChoose && <AccountChooser />}
                  {!isAccountChoose && (
                    <>
                      {accountType === 'vip' && <VipStartup />}
                      {accountType === 'pocket' && <PocketStartup />}
                    </>
                  )}
                </Box>

                <StartupIllustration />
              </>
            )}
            {isUnauthorizedRole && <UnauthorizedRole />}
          </Box>
        )}
      </>
    );
  }

  return (
    <Box className="loader-waiting-js">
      <IconLogo />
      <Box className="progress-bar">
        <Box className="progress-bar-value" />
      </Box>
    </Box>
  );
};

export default Startup;
