import { lazy, useEffect, useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import CssBaseline from '@mui/material/CssBaseline';
import { apiHostState, isLightThemeState, isOnlineState, visitorIDState } from './states/main';
import { InternetChecker } from './features/internetChecker';
import { appSnackOpenState } from './states/notification';
import DashboardMenu from './pages/DashboardMenu';
import NotificationWrapper from './features/notificationWrapper';
import Layout from './components/Layout';
import PrivateRoot from './components/PrivateRoot';
import { congAccountConnectedState } from './states/congregation';
import WeeklyAssignments from './pages/WeeklyAssignments';
import CongregationSettings from './pages/CongregationSettings';
import ErrorBoundary from './components/ErrorBoundary';

// lazy loading
const Administration = lazy(() => import('./pages/Administration'));
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

  const [activeTheme, setActiveTheme] = useState(darkTheme);

  const router = createHashRouter([
    {
      element: <Layout updatePwa={updatePwa} />,
      errorElement: <ErrorBoundary />,
      children: [
        { path: '/', element: <DashboardMenu /> },
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
          path: '/schedules/view/:weekToFormat',
          element: <WeeklyAssignments />,
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
          path: '/user-settings',
          element: <Settings />,
        },
        {
          path: '/congregation-settings',
          element: <CongregationSettings />,
        },
        {
          element: <PrivateRoot isCongAccountConnected={isCongAccountConnected} />,
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
    };

    if (isOnline) {
      getUserID();
    }
  }, [setVisitorID, isOnline]);

  useEffect(() => {
    if (
      !process.env.NODE_ENV ||
      process.env.NODE_ENV === 'development' ||
      window.location.host.indexOf('localhost') !== -1
    ) {
      if (import.meta.env.VITE_API_REMOTE_URL) {
        setApiHost(import.meta.env.VITE_API_REMOTE_URL);
      } else {
        setApiHost('http://localhost:8000/');
      }
    } else {
      setApiHost('https://sws2apps.onrender.com/');
    }
  }, [setApiHost]);

  useEffect(() => {
    if (!indexedDB) {
      if (!('serviceWorker' in navigator)) {
        return (
          <div className="browser-not-supported">
            You seem to use an unsupported browser to use CPE. Make sure that you browser is up to date, or try to use
            another browser.
          </div>
        );
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <InternetChecker />
        {appSnackOpen && <NotificationWrapper />}

        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
