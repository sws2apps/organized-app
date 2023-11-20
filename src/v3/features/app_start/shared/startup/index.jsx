import { Box } from '@mui/material';
import { WaitingCircular } from '@components';
import { AccountChooser, PocketStartup } from '@features/app_start';
import StartupIllustration from '../illustration';
import useStartup from './useStartup';

const Startup = () => {
  const { isSetup, isAuth, isAccountChoose, accountType } = useStartup();

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
              flexDirection: { mobile: 'column', laptop: 'row' },
              gap: { mobile: '16px', laptop: '24px' },
              height: { tablet: 'auto', laptop: 'calc(100vh - 104px)', desktop: 'calc(100vh - 112px)' },
            }}
          >
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
                  {/* {accountType === 'vip' && <VipStartup />} */}
                  {accountType === 'pocket' && <PocketStartup />}
                  {/* {isUnauthorizedRole && <UnauthorizedRole />} */}
                </>
              )}
            </Box>

            <StartupIllustration />
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
