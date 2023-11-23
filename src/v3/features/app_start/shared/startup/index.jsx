import { Box } from '@mui/material';
import { WaitingCircular } from '@components';
import { AccountChooser, PocketStartup, VipStartup } from '@features/app_start';
import StartupIllustration from '../illustration';
import UnauthorizedRole from '../unauthorized_role';
import useStartup from './useStartup';

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
              height: {
                mobile: isUnauthorizedRole ? '100%' : 'auto',
                tablet: isUnauthorizedRole ? '100%' : 'auto',
                laptop: 'calc(100vh - 104px)',
                desktop: 'calc(100vh - 112px)',
              },
            }}
          >
            {!isUnauthorizedRole && (
              <>
                <Box
                  sx={{
                    maxWidth: { mobile: '100%', laptop: '552px' },
                    flex: '1 0 0',
                    padding: { mobile: '16px', laptop: '32px' },
                    borderRadius: 'var(--radius-xxl)',
                    border: '1px solid var(--accent-300)',
                    background: 'var(--white)',
                    height: '100%',
                    display: 'flex',
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
      <img src="/img/logo.svg" />
      <Box className="progress-bar">
        <Box className="progress-bar-value" />
      </Box>
    </Box>
  );
};

export default Startup;
