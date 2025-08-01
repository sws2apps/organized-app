import { lazy, useEffect } from 'react';
import { createHashRouter, RouterProvider } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@components/index';
import { RootLayout } from '@layouts/index';
import { useCurrentUser } from './hooks';
import {
  appLangState,
  appLocaleState,
  appThemeState,
  congAccountConnectedState,
} from '@states/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import FeatureFlagsWrapper from '@wrapper/feature_flags';
import RouteProtected from '@components/route_protected';
import { determineAppLocale } from '@services/app';
import { firstDayWeekState } from '@states/settings';

// lazy loading
const Dashboard = lazy(() => import('@pages/dashboard'));
const MyProfile = lazy(() => import('@pages/my_profile'));
const PersonsAll = lazy(() => import('@pages/persons/all_persons'));
const PersonDetails = lazy(() => import('@pages/persons/person_details'));
const PublicTalksList = lazy(
  () => import('@pages/meeting_materials/public_talks_list')
);
const BranchOfficeReports = lazy(() => import('@pages/reports/branch_office'));
const MeetingAttendance = lazy(
  () => import('@pages/reports/meeting_attendance')
);
const FieldServiceReportsPage = lazy(
  () => import('@pages/reports/field_service')
);
const MidweekMeeting = lazy(() => import('@pages/meetings/midweek'));
const MinistryReport = lazy(() => import('@pages/ministry/ministry_report'));
const ServiceYear = lazy(() => import('@pages/ministry/service_year'));
const AuxiliaryPioneerApplication = lazy(
  () => import('@pages/ministry/auxiliary_pioneer')
);
const SpeakersCatalog = lazy(() => import('@pages/persons/speakers_catalog'));
const WeekendMeeting = lazy(() => import('@pages/meetings/weekend'));
const FieldServiceGroups = lazy(
  () => import('@pages/congregation/field_service_groups')
);
const PublisherRecord = lazy(() => import('@pages/reports/publisher_records'));
const PublisherRecordDetails = lazy(
  () => import('@pages/reports/publisher_records_details')
);
const UsersAll = lazy(
  () => import('@pages/congregation/manage_access/all_users')
);
const UserDetails = lazy(
  () => import('@pages/congregation/manage_access/user_details')
);
const WeeklySchedules = lazy(() => import('@pages/meetings/schedules'));
const CongregationSettings = lazy(() => import('@pages/congregation/settings'));
const Applications = lazy(() => import('@pages/persons/applications'));
const ApplicationDetails = lazy(
  () => import('@pages/persons/application_details')
);
const UpcomingEvents = lazy(() => import('@pages/activities/upcoming_events'));

const queryClient = new QueryClient();

const cache = createCache({
  key: 'css',
  prepend: true,
});

const App = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const {
    isAdmin,
    isPublisher,
    isElder,
    isPersonEditor,
    isAttendanceEditor,
    isAppointed,
    isMidweekEditor,
    isWeekendEditor,
    isGroupOverseer,
    isSecretary,
    isPublicTalkCoordinator,
    isServiceCommittee,
    isGroup,
    isLanguageGroupOverseer,
  } = useCurrentUser();

  const [adapterLocale, setAdapterLocale] = useAtom(appLocaleState);

  const isConnected = useAtomValue(congAccountConnectedState);
  const theme = useAtomValue(appThemeState);
  const appLang = useAtomValue(appLangState);
  const firstDayOfTheWeekOption = useAtomValue(firstDayWeekState);

  const router = createHashRouter([
    {
      errorElement: <ErrorBoundary updatePwa={updatePwa} />,
      children: [
        {
          element: <RootLayout updatePwa={updatePwa} />,
          children: [
            // public routes
            { index: true, element: <Dashboard /> },
            { path: '/user-profile', element: <MyProfile /> },
            { path: '/weekly-schedules', element: <WeeklySchedules /> },
            {
              path: '/activities/upcoming-events',
              element: <UpcomingEvents />,
            },

            // publisher routes
            {
              element: <RouteProtected allowed={isPublisher} />,
              children: [
                { path: '/ministry-report', element: <MinistryReport /> },
                { path: '/service-year', element: <ServiceYear /> },

                // only if connected
                {
                  element: <RouteProtected allowed={isConnected} />,
                  children: [
                    {
                      path: '/auxiliary-pioneer-application',
                      element: <AuxiliaryPioneerApplication />,
                    },
                  ],
                },
              ],
            },

            // publisher, service committee, appointed routes
            {
              element: (
                <RouteProtected
                  allowed={isPublisher || isAppointed || isServiceCommittee}
                />
              ),
              children: [
                {
                  path: '/field-service-groups',
                  element: <FieldServiceGroups />,
                },
              ],
            },

            // appointed routes
            {
              element: <RouteProtected allowed={isAppointed} />,
              children: [
                { path: '/public-talks-list', element: <PublicTalksList /> },
              ],
            },

            // elder routes
            {
              element: <RouteProtected allowed={isElder} />,
              children: [
                { path: '/persons', element: <PersonsAll /> },
                { path: '/persons/:id', element: <PersonDetails /> },
                { path: '/speakers-catalog', element: <SpeakersCatalog /> },
                {
                  path: '/congregation-settings',
                  element: <CongregationSettings />,
                },
                { path: '/publisher-records', element: <PublisherRecord /> },
                {
                  path: '/publisher-records/:id',
                  element: <PublisherRecordDetails />,
                },

                // only if connected
                {
                  element: <RouteProtected allowed={isConnected} />,
                  children: [
                    {
                      path: '/pioneer-applications',
                      element: <Applications />,
                    },
                    {
                      path: '/pioneer-applications/:id',
                      element: <ApplicationDetails />,
                    },
                  ],
                },
              ],
            },

            // person editor routes
            {
              element: <RouteProtected allowed={isPersonEditor} />,
              children: [{ path: '/persons/new', element: <PersonDetails /> }],
            },

            // attendance editor routes
            {
              element: <RouteProtected allowed={isAttendanceEditor} />,
              children: [
                {
                  path: '/reports/meeting-attendance',
                  element: <MeetingAttendance />,
                },
              ],
            },

            // midweek editor routes
            {
              element: <RouteProtected allowed={isMidweekEditor} />,
              children: [
                { path: '/midweek-meeting', element: <MidweekMeeting /> },
              ],
            },

            // weekend editor routes
            {
              element: (
                <RouteProtected
                  allowed={isWeekendEditor || isPublicTalkCoordinator}
                />
              ),
              children: [
                { path: '/weekend-meeting', element: <WeekendMeeting /> },
              ],
            },

            // secretary routes and group overseer
            {
              element: (
                <RouteProtected
                  allowed={
                    isGroupOverseer || isLanguageGroupOverseer || isSecretary
                  }
                />
              ),
              children: [
                {
                  path: '/reports/field-service',
                  element: <FieldServiceReportsPage />,
                },
              ],
            },

            // language group admin route
            {
              element: <RouteProtected allowed={isLanguageGroupOverseer} />,
              children: [
                {
                  path: '/group-settings',
                  element: <CongregationSettings />,
                },
              ],
            },

            // congregation admin routes (admin - secretary - coordinator)
            {
              element: <RouteProtected allowed={isAdmin} />,
              children: [
                {
                  element: <RouteProtected allowed={!isGroup} />,
                  children: [
                    {
                      path: '/reports/branch-office',
                      element: <BranchOfficeReports />,
                    },
                  ],
                },

                // only if connected
                {
                  element: <RouteProtected allowed={isConnected} />,
                  children: [
                    { path: '/manage-access', element: <UsersAll /> },
                    {
                      path: '/manage-access/:id',
                      element: <UserDetails />,
                    },
                  ],
                },
              ],
            },

            // fallback to dashboard for all invalid routes
            { path: '*', element: <Dashboard /> },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    const locale = determineAppLocale(appLang);

    setAdapterLocale({
      ...locale,
      options: {
        ...locale.options,
        weekStartsOn: firstDayOfTheWeekOption,
      },
    });
  }, [appLang, firstDayOfTheWeekOption, setAdapterLocale]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={adapterLocale}
      >
        <CssBaseline />
        <CacheProvider value={cache}>
          <QueryClientProvider client={queryClient}>
            <FeatureFlagsWrapper>
              <RouterProvider router={router} />
            </FeatureFlagsWrapper>
          </QueryClientProvider>
        </CacheProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
export default App;
