import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Link, Toolbar } from '@mui/material';
import { IconClose } from '@components/icons';
import { AppModalWrapper } from '@wrapper/index';
import { Startup } from '@features/app_start';
import { isDemo } from '@constants/index';
import useGlobal from '@hooks/useGlobal';
import useRootLayout from './useRootLayout';
import About from '@features/about';
import AppFeedback from '@features/app_feedback';
import AppReminders from '@features/reminders';
import AppUpdater from '@features/app_updater';
import Contact from '@features/contact';
import DashboardSkeletonLoader from '@features/dashboard/skeleton_loader';
import DemoNotice from '@features/demo/notice';
import DemoStartup from '@features/demo/start';
import EPUBMaterialsImport from '@features/meeting_materials/epub_import';
import InitialSetup from '@features/dashboard/initial_setup';
import JWAutoImport from '@features/meeting_materials/jw_auto_import';
import JWMaterialsImport from '@features/meeting_materials/jw_import';
import MigrationNotice from '@features/migration';
import MyAssignments from '@features/meetings/my_assignments';
import NavBar from '@layouts/navbar';
import Support from '@features/support';
import UnsupportedBrowser from '@features/app_start/shared/unsupported_browser';
import WaitingLoader from '@components/waiting_loader';
import WhatsNew from '@features/whats_new';
import Typography from '@components/typography';
import NetlifyLight from '@assets/img/netlify_lightmode.png';
import NetlifyDark from '@assets/img/netlify_darkmode.png';
import useConsoleWarning from '@hooks/useConsoleWarning';

const RootLayout = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const { isSupported } = useGlobal();

  useConsoleWarning();

  const {
    isAppLoad,
    isOpenAbout,
    isOpenContact,
    isOpenSupport,
    isImportJWOrg,
    isImportEPUB,
    isDashboard,
    isDemoNoticeOpen,
    migrationOpen,
    initialSetupOpen,
    isDarkTheme,
  } = useRootLayout();

  return (
    <AppModalWrapper>
      <NavBar isSupported={isSupported} />
      <AppUpdater updatePwa={updatePwa} />

      <AppFeedback />

      {isImportJWOrg && <JWMaterialsImport />}
      {isImportEPUB && <EPUBMaterialsImport />}

      <JWAutoImport />

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
          marginBottom: import.meta.env.VITE_APP_ON_NETLIFY ? '70px' : 'unset',
        }}
      >
        {!isSupported && <UnsupportedBrowser />}

        {isSupported && (
          <>
            {isOpenContact && <Contact />}
            {isOpenAbout && <About updatePwa={updatePwa} />}
            {isOpenSupport && <Support />}

            {isAppLoad && !isDemo && <Startup />}

            {isAppLoad && isDemo && <DemoStartup />}

            {!isAppLoad && (
              <Suspense
                fallback={
                  isDashboard ? (
                    <DashboardSkeletonLoader />
                  ) : (
                    <WaitingLoader type="lottie" />
                  )
                }
              >
                {isDemo && <DemoNotice />}

                {!initialSetupOpen &&
                  (!isDemo || (isDemo && !isDemoNoticeOpen)) && <WhatsNew />}

                {migrationOpen && <MigrationNotice />}

                {!isDemo && initialSetupOpen && <InitialSetup />}

                <AppReminders />

                <Box sx={{ marginBottom: '32px' }}>
                  <MyAssignments />
                  <Outlet />
                </Box>
              </Suspense>
            )}
          </>
        )}
      </Container>

      {import.meta.env.VITE_APP_ON_NETLIFY && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '0px',
            width: '100%',
            borderTop: '1px outset var(--accent-200)',
            backgroundColor: 'var(--white)',
            boxShadow: 'var(--small-card-shadow)',
          }}
        >
          <Link
            href="https://www.netlify.com/"
            target="_blank"
            rel="noopener"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '40px',
            }}
          >
            <img
              alt=""
              src={isDarkTheme ? NetlifyDark : NetlifyLight}
              style={{ height: '25px' }}
            />
            <Typography className="body-small-semibold">
              This site is powered by Netlify
            </Typography>
          </Link>
        </Box>
      )}
    </AppModalWrapper>
  );
};

export default RootLayout;
