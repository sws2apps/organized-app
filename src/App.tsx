import { lazy } from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@components/index';
import { RootLayout } from '@layouts/index';

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
const UpcomingEvents = lazy(
  () => import('@pages/congregation/upcoming_events')
);
const Applications = lazy(() => import('@pages/persons/applications'));
const ApplicationDetails = lazy(
  () => import('@pages/persons/application_details')
);

const queryClient = new QueryClient();

const App = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const router = createHashRouter([
    {
      errorElement: <ErrorBoundary />,
      children: [
        {
          element: <RootLayout updatePwa={updatePwa} />,
          children: [
            { path: '/', element: <Dashboard /> },
            { path: '/persons', element: <PersonsAll /> },
            {
              path: '/reports/branch-office',
              element: <BranchOfficeReports />,
            },
            {
              path: '/reports/meeting-attendance',
              element: <MeetingAttendance />,
            },
            {
              path: '/reports/field-service',
              element: <FieldServiceReportsPage />,
            },
            { path: '/persons/:id', element: <PersonDetails /> },
            { path: '/persons/new', element: <PersonDetails /> },
            { path: '/pioneer-applications', element: <Applications /> },
            {
              path: '/pioneer-applications/:id',
              element: <ApplicationDetails />,
            },
            { path: '/user-profile', element: <MyProfile /> },
            { path: '/public-talks-list', element: <PublicTalksList /> },
            { path: '/ministry-report', element: <MinistryReport /> },
            { path: '/upcoming-events', element: <UpcomingEvents /> },
            {
              path: '/auxiliary-pioneer-application',
              element: <AuxiliaryPioneerApplication />,
            },
            { path: '/speakers-catalog', element: <SpeakersCatalog /> },
            { path: '/midweek-meeting', element: <MidweekMeeting /> },
            { path: '/weekend-meeting', element: <WeekendMeeting /> },
            { path: '/field-service-groups', element: <FieldServiceGroups /> },
            { path: '/publisher-records', element: <PublisherRecord /> },
            {
              path: '/publisher-records/:id',
              element: <PublisherRecordDetails />,
            },
            { path: '/manage-access', element: <UsersAll /> },
            {
              path: '/manage-access/:id',
              element: <UserDetails />,
            },
            { path: '/service-year', element: <ServiceYear /> },
            { path: '/weekly-schedules', element: <WeeklySchedules /> },
            {
              path: '/congregation-settings',
              element: <CongregationSettings />,
            },
            { path: '*', element: <Dashboard /> },
          ],
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
export default App;
