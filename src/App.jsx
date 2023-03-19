import { lazy, useEffect, useState, Suspense } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import CssBaseline from '@mui/material/CssBaseline';
import { InternetChecker } from './features/internetChecker';
import NotificationWrapper from './features/notificationWrapper';
import PrivateVipConnectedRoute from './components/PrivateVipConnectedRoute';
import PrivateVipRoute from './components/PrivateVipRoute';
import ErrorBoundary from './components/ErrorBoundary';
import backupWorkerInstance from './workers/backupWorker';
import { accountTypeState, apiHostState, isLightThemeState, isOnlineState, visitorIDState } from './states/main';
import { congAccountConnectedState } from './states/congregation';
import { appSnackOpenState } from './states/notification';
import WaitingPage from './components/WaitingPage';

// lazy loading
const Layout = lazy(() => import('./components/Layout'));
const Administration = lazy(() => import('./pages/Administration'));
const DashboardMenu = lazy(() => import('./pages/DashboardMenu'));
const Persons = lazy(() => import('./pages/Persons'));
const PersonDetails = lazy(() => import('./pages/PersonDetails'));
const Schedules = lazy(() => import('./pages/Schedules'));
const ScheduleDetails = lazy(() => import('./pages/ScheduleDetails'));
const S89 = lazy(() => import('./pages/S89'));
const S140 = lazy(() => import('./pages/S140'));
const ScheduleWeekDetails = lazy(() => import('./pages/ScheduleWeekDetails'));
const Settings = lazy(() => import('./pages/UserSettings'));
const SourceMaterials = lazy(() => import('./pages/SourceMaterials'));
const SourceWeekDetails = lazy(() => import('./pages/SourceWeekDetails'));
const CongregationPersonDetails = lazy(() => import('./pages/CongregationPersonDetails'));
const WeeklyAssignments = lazy(() => import('./pages/WeeklyAssignments'));
const CongregationSettings = lazy(() => import('./pages/CongregationSettings'));

// creating theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient();

const App = ({ updatePwa }) => {
  const setVisitorID = useSetRecoilState(visitorIDState);
  const setApiHost = useSetRecoilState(apiHostState);

  const isOnline = useRecoilValue(isOnlineState);
  const isLight = useRecoilValue(isLightThemeState);
  const appSnackOpen = useRecoilValue(appSnackOpenState);
  const isCongAccountConnected = useRecoilValue(congAccountConnectedState);
  const accountType = useRecoilValue(accountTypeState);

  const [activeTheme, setActiveTheme] = useState(darkTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(true);

  const router = createHashRouter([
    {
      element: <Layout updatePwa={updatePwa} />,
      errorElement: <ErrorBoundary />,
      children: [
        { path: '/', element: <DashboardMenu /> },
        {
          path: '/schedules/view/:weekToFormat',
          element: <WeeklyAssignments />,
        },
        {
          path: '/user-settings',
          element: <Settings />,
        },
        {
          element: <PrivateVipRoute accountType={accountType} />,
          children: [
            {
              path: '/persons',
              element: <Persons />,
            },
            {
              path: '/persons/new',
              element: <PersonDetails />,
            },
            {
              path: '/persons/:id',
              element: <PersonDetails />,
            },
            {
              path: '/schedules',
              element: <Schedules />,
            },
            {
              path: '/schedules/:schedule',
              element: <ScheduleDetails />,
            },
            {
              path: '/schedules/:schedule/:weekToFormat',
              element: <ScheduleWeekDetails />,
            },
            {
              path: '/assignment-form',
              element: <S89 />,
            },
            {
              path: '/midweek-meeting-schedule',
              element: <S140 />,
            },
            {
              path: '/source-materials',
              element: <SourceMaterials />,
            },
            {
              path: '/source-materials/:weekToFormat',
              element: <SourceWeekDetails />,
            },
            {
              path: '/congregation-settings',
              element: <CongregationSettings />,
            },
            {
              element: <PrivateVipConnectedRoute isCongAccountConnected={isCongAccountConnected} />,
              children: [
                {
                  path: '/administration',
                  element: <Administration />,
                },
                {
                  path: '/administration/members/:id',
                  element: <CongregationPersonDetails />,
                },
              ],
            },
          ],
        },
        { path: '*', element: <DashboardMenu /> },
      ],
    },
  ]);

  useEffect(() => {
    if (isLight) {
      setActiveTheme(lightTheme);
    } else {
      setActiveTheme(darkTheme);
    }
  }, [isLight]);

  useEffect(() => {
    // get visitor ID and check if there is an active connection
    const getUserID = async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: import.meta.env.VITE_FINGERPRINT_API_CLIENT_KEY,
      });

      let visitorId = '';

      do {
        const fp = await fpPromise;
        const result = await fp.get();
        visitorId = result.visitorId;
      } while (visitorId.length === 0);

      setVisitorID(visitorId);
      backupWorkerInstance.setVisitorID(visitorId);
    };

    if (isOnline) {
      getUserID();
    }
  }, [setVisitorID, isOnline]);

  useEffect(() => {
    let apiHost;
    if (
      !process.env.NODE_ENV ||
      process.env.NODE_ENV === 'development' ||
      window.location.host.indexOf('localhost') !== -1
    ) {
      if (import.meta.env.VITE_API_REMOTE_URL) {
        apiHost = import.meta.env.VITE_API_REMOTE_URL;
      } else {
        apiHost = 'http://localhost:8000/';
      }
    } else {
      apiHost = 'https://sws2apps.herokuapp.com/';
    }

    setApiHost(apiHost);
    backupWorkerInstance.setApiHost(apiHost);
  }, [setApiHost]);

  useEffect(() => {
    const checkBrowser = () => {
      if (!('Worker' in window)) {
        setIsSupported(false);
        return;
      }

      if (!('crypto' in window)) {
        setIsSupported(false);
        return;
      }

      if (!crypto.randomUUID || typeof crypto.randomUUID !== 'function') {
        setIsSupported(false);
        return;
      }

      if (!indexedDB) {
        setIsSupported(false);
        return;
      }

      if (!('serviceWorker' in navigator)) {
        setIsSupported(false);
        return;
      }
    };

    checkBrowser();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <WaitingPage />;
  }

  return (
    <>
      {!isSupported && (
        <div className="browser-not-supported">
          You are using unsupported browser for the Congregation Program for Everyone app. Make sure that your browser
          is up to date, or try to use another browser.
        </div>
      )}
      {isSupported && (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={activeTheme}>
            <CssBaseline />
            <InternetChecker />
            {appSnackOpen && <NotificationWrapper />}
            <Suspense fallback={<WaitingPage />}>
              <RouterProvider router={router} />
            </Suspense>
          </ThemeProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

export default App;
