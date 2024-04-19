import { Outlet } from 'react-router-dom';
import NavBar from '@layouts/navbar';
import { AppModalWrapper } from '@wrapper/index';
import { Box, Container, Toolbar } from '@mui/material';
import {
  About,
  AppFeedback,
  AppUpdater,
  EPUBMaterialsImport,
  JWMaterialsImport,
  MyAssignments,
  Startup,
  Support,
} from '@features/index';
import useRootLayout from './useRootLayout';
import { IconClose } from '@components/icons';
import Contact from '@features/contact';


const RootLayout = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const { isAppLoad, isOpenAbout, isOpenContact, isOpenSupport, appSnackOpen, isImportJWOrg, isImportEPUB } =
    useRootLayout();

  return (
    <AppModalWrapper>
      <NavBar />
      <AppUpdater updatePwa={updatePwa} />

      {appSnackOpen && <AppFeedback />}
      {isImportJWOrg && <JWMaterialsImport />}
      {isImportEPUB && <EPUBMaterialsImport />}
      <MyAssignments />

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
