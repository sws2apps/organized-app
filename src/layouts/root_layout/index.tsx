import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { useAtomValue } from 'jotai';
import { Box, Container, Toolbar } from '@mui/material';
import { IconClose } from '@components/icons';
import { AppModalWrapper, WebWorkerWrapper } from '@wrapper/index';
import { Startup } from '@features/app_start';
import { isTest } from '@constants/index';
import useConsoleWarning from '@hooks/useConsoleWarning';
import useCurrentUser from '@hooks/useCurrentUser';
import useGlobal from '@hooks/useGlobal';
import useRootLayout from './useRootLayout';
import useAppLock from '@features/app_lock/useAppLock';
import { isAppLockedState } from '@states/app_lock';
import AppLock from '@features/app_lock';
import { EXIT_DURATION_MS } from '@features/app_lock/index.styles';
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
import MyAssignments from '@features/meetings/my_assignments';
import NavBar from '@layouts/navbar';
import Support from '@features/support';
import UnsupportedBrowser from '@features/app_start/shared/unsupported_browser';
import WaitingLoader from '@components/waiting_loader';
import WhatsNew from '@features/whats_new';

const RootLayout = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const { isSupported } = useGlobal();

  useConsoleWarning();
  useAppLock();

  const { isPublisher } = useCurrentUser();
  const isAppLocked = useAtomValue(isAppLockedState);

  // Keep AppLock mounted briefly after unlock so the exit animation plays.
  const [showLock, setShowLock] = useState(isAppLocked);
  const [isExiting, setIsExiting] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isAppLocked) {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      setIsExiting(false);
      setShowLock(true);
    } else if (showLock) {
      setIsExiting(true);
      exitTimerRef.current = setTimeout(() => {
        setShowLock(false);
        setIsExiting(false);
      }, EXIT_DURATION_MS);
    }
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [isAppLocked]);

  const {
    isAppLoad,
    isOpenAbout,
    isOpenContact,
    isOpenSupport,
    isImportJWOrg,
    isImportEPUB,
    isDashboard,
    isDemoNoticeOpen,
    initialSetupOpen,
  } = useRootLayout();

  return (
    <WebWorkerWrapper>
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
          }}
        >
          {!isSupported && <UnsupportedBrowser />}

          {isSupported && (
            <>
              {isOpenContact && <Contact />}
              {isOpenAbout && <About updatePwa={updatePwa} />}
              {isOpenSupport && <Support />}

              {isAppLoad && !isTest && <Startup />}

              {isAppLoad && isTest && <DemoStartup />}

              {!isAppLoad && showLock && (
                <AppLock isExiting={isExiting} />
              )}

              {!isAppLoad && !showLock && (
                <Suspense
                  fallback={
                    isDashboard ? (
                      <DashboardSkeletonLoader />
                    ) : (
                      <WaitingLoader type="lottie" />
                    )
                  }
                >
                  {isTest && <DemoNotice />}

                  {!initialSetupOpen &&
                    (!isTest || (isTest && !isDemoNoticeOpen)) && <WhatsNew />}

                  {!isTest && initialSetupOpen && <InitialSetup />}

                  {isPublisher && <AppReminders />}

                  <Box sx={{ marginBottom: '32px' }}>
                    <MyAssignments />
                    <Outlet />
                  </Box>
                </Suspense>
              )}
            </>
          )}
        </Container>

        <ScrollRestoration />
      </AppModalWrapper>
    </WebWorkerWrapper>
  );
};

export default RootLayout;
