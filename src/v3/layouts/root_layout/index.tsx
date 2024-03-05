import { Outlet } from 'react-router-dom';
import NavBar from '@layouts/navbar';
import { AppModalWrapper } from '@wrapper/index';
import { Box, Container } from '@mui/material';
import { About, AppFeedback, AppUpdater, Startup, Support } from '@features/index';
import useRootLayout from './useRootLayout';

const RootLayout = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const { isAppLoad, isOpenAbout, isOpenSupport, appSnackOpen } = useRootLayout();

  return (
    <AppModalWrapper>
      <NavBar />
      <AppUpdater updatePwa={updatePwa} />

      {appSnackOpen && <AppFeedback />}

      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1440px',
          width: '100%',
          paddingLeft: { mobile: '16px', tablet: '24px', desktop: '32px' },
          paddingRight: { mobile: '16px', tablet: '24px', desktop: '32px' },
          marginTop: '80px', // header 56px + 24px
        }}
      >
        {isOpenAbout && <About />}
        {isOpenSupport && <Support />}

        {isAppLoad && <Startup />}

        {!isAppLoad && (
          <Box sx={{ marginBottom: '32px' }}>
            <Outlet />
          </Box>
        )}
      </Container>
    </AppModalWrapper>
  );
};

export default RootLayout;
