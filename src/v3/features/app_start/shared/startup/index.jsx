import { Box } from '@mui/material';
import useStartup from './useStartup';
import { Typography, WaitingCircular } from '@components';
import StartupIllustration from '../illustration';

const Startup = () => {
  const { isSetup, isAuth } = useStartup();

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
              height: { tablet: 'auto', laptop: 'calc(100vh - 112px)' },
            }}
          >
            <Box sx={{ maxWidth: { mobile: '100%', laptop: '552px' }, flex: 1 }}>
              <Typography>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste ullam odit qui aspernatur labore
                inventore, blanditiis ducimus alias minus sint sunt hic culpa animi fugiat aut quas quia illo magni.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste ullam odit qui aspernatur labore
                inventore, blanditiis ducimus alias minus sint sunt hic culpa animi fugiat aut quas quia illo magni.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste ullam odit qui aspernatur labore
                inventore, blanditiis ducimus alias minus sint sunt hic culpa animi fugiat aut quas quia illo magni.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste ullam odit qui aspernatur labore
                inventore, blanditiis ducimus alias minus sint sunt hic culpa animi fugiat aut quas quia illo magni.
              </Typography>
            </Box>
            {/* {isAccountChoose && <AccountChooser />}
            {!isAccountChoose && (
              <>
                {accountType === 'vip' && <VipStartup />}
                {accountType === 'pocket' && <PocketStartup />}
                {isUnauthorizedRole && <UnauthorizedRole />}
              </>
            )} */}
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
