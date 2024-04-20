import { Outlet } from 'react-router-dom';
import { Box, Container, Toolbar } from '@mui/material';
import { IconClose } from '@components/icons';
import NavBar from '@layouts/navbar';
import { AppModalWrapper } from '@wrapper/index';
import {
  About,
  AppFeedback,
  AppUpdater,
  Contact,
  DemoStartup,
  EPUBMaterialsImport,
  JWMaterialsImport,
  MyAssignments,
  Startup,
  Support,
  WorkInProgressNotif,
} from '@features/index';
import useRootLayout from './useRootLayout';
import { isDemo } from '@constants/index';

const RootLayout = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const { isAppLoad, isOpenAbout, isOpenContact, isOpenSupport, isImportJWOrg, isImportEPUB } = useRootLayout();

  return (
    <AppModalWrapper>
      <NavBar />
      <AppUpdater updatePwa={updatePwa} />

      <AppFeedback />

      <WorkInProgressNotif />
      {isImportJWOrg && <JWMaterialsImport />}
      {isImportEPUB && <EPUBMaterialsImport />}

      <Toolbar sx={{ padding: 0 }}>
        {/* temporary workaround while page components are being built */}
        <IconClose sx={{ opacity: 0 }} />
      </Toolbar>

      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1440px',
          width: '100%',
          paddingLeft: { mobile: '16px', tablet: '24px', desktop: '32px' },
          paddingRight: { mobile: '16px', tablet: '24px', desktop: '32px' },
          marginTop: '24px',
        }}
      >
        {isOpenContact && <Contact />}
        {isOpenAbout && <About />}
        {isOpenSupport && <Support />}

        {isAppLoad && !isDemo && <Startup />}

        {isAppLoad && isDemo && <DemoStartup />}

        {!isAppLoad && (
          <Box sx={{ marginBottom: '32px' }}>
            <MyAssignments />
            <Outlet />
          </Box>
        )}
      </Container>
    </AppModalWrapper>
  );
};

export default RootLayout;
