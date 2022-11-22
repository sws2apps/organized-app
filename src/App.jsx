import { lazy, Suspense, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import { apiHostState, isLightThemeState, isOnlineState, visitorIDState } from './states/main';
import { InternetChecker } from './features/internetChecker';
import { appSnackOpenState } from './states/notification';
import DashboardMenu from './pages/DashboardMenu';
import NotificationWrapper from './features/notificationWrapper';
import Layout from './components/Layout';
import PrivateRoot from './components/PrivateRoot';
import { isAdminCongState } from './states/congregation';

// lazy loading
const Administration = lazy(() => import('./pages/Administration'));
const Persons = lazy(() => import('./pages/Persons'));
const PersonDetails = lazy(() => import('./pages/PersonDetails'));
const Schedules = lazy(() => import('./pages/Schedules'));
const ScheduleDetails = lazy(() => import('./pages/ScheduleDetails'));
const S89 = lazy(() => import('./pages/S89'));
const S140 = lazy(() => import('./pages/S140'));
const ScheduleWeekDetails = lazy(() => import('./pages/ScheduleWeekDetails'));
const Settings = lazy(() => import('./pages/Settings'));
const SourceMaterials = lazy(() => import('./pages/SourceMaterials'));
const SourceWeekDetails = lazy(() => import('./pages/SourceWeekDetails'));
const VipUserDetail = lazy(() => import('./pages/VipUserDetail'));

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

const WaitingPage = () => {
  return (
    <CircularProgress
      color="primary"
      size={80}
      disableShrink={true}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
      }}
    />
  );
};

const App = ({ updatePwa }) => {
  const setVisitorID = useSetRecoilState(visitorIDState);
  const setApiHost = useSetRecoilState(apiHostState);

  const isOnline = useRecoilValue(isOnlineState);
  const isLight = useRecoilValue(isLightThemeState);
  const appSnackOpen = useRecoilValue(appSnackOpenState);
  const isAdminCong = useRecoilValue(isAdminCongState);

  const [activeTheme, setActiveTheme] = useState(darkTheme);

  const router = createBrowserRouter([
    {
      element: <Layout updatePwa={updatePwa} />,
      children: [
        { path: '/', element: <DashboardMenu /> },
        {
          path: '/persons',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <Persons />
            </Suspense>
          ),
        },
        {
          path: '/persons/new',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <PersonDetails />
            </Suspense>
          ),
        },
        {
          path: '/persons/:id',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <PersonDetails />
            </Suspense>
          ),
        },
        {
          path: '/schedules',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <Schedules />
            </Suspense>
          ),
        },
        {
          path: '/schedules/:schedule',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <ScheduleDetails />
            </Suspense>
          ),
        },
        {
          path: '/schedules/:schedule/:weekToFormat',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <ScheduleWeekDetails />
            </Suspense>
          ),
        },
        {
          path: '/assignment-form',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <S89 />
            </Suspense>
          ),
        },
        {
          path: '/midweek-meeting-schedule',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <S140 />
            </Suspense>
          ),
        },
        {
          path: '/source-materials',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <SourceMaterials />
            </Suspense>
          ),
        },
        {
          path: '/source-materials/:weekToFormat',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <SourceWeekDetails />
            </Suspense>
          ),
        },
        {
          path: '/settings',
          element: (
            <Suspense fallback={<WaitingPage />}>
              <Settings />
            </Suspense>
          ),
        },
        {
          element: <PrivateRoot isAdminCong={isAdminCong} />,
          children: [
            {
              path: '/administration',
              element: (
                <Suspense fallback={<WaitingPage />}>
                  <Administration />
                </Suspense>
              ),
            },
            {
              path: '/administration/members/new',
              element: (
                <Suspense fallback={<WaitingPage />}>
                  <VipUserDetail />
                </Suspense>
              ),
            },
            {
              path: '/administration/members/:id',
              element: (
                <Suspense fallback={<WaitingPage />}>
                  <VipUserDetail />
                </Suspense>
              ),
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
        apiKey: 'XwmESck7zm6PZAfspXbs',
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
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      if (import.meta.env.VITE_API_REMOTE_URL) {
        setApiHost(import.meta.env.VITE_API_REMOTE_URL);
      } else {
        setApiHost('http://localhost:8000/');
      }
    } else {
      setApiHost('https://sws2apps-api.onrender.com/');
    }
  }, [setApiHost]);

  useEffect(() => {
    if (!indexedDB) {
      if ('serviceWorker' in navigator) {
      } else {
        return (
          <div className="browser-not-supported">
            You seem to use an unsupported browser to use LMM-OA. Make sure that you browser is up to date, or try to
            use another browser.
          </div>
        );
      }
    }
  }, []);

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <InternetChecker />
      {appSnackOpen && <NotificationWrapper />}

      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
