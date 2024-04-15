import { lazy, useEffect, useState, Suspense } from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import CssBaseline from '@mui/material/CssBaseline';
import PrivateVipConnectedRoute from './components/PrivateVipConnectedRoute';
import PrivateElderRoute from './components/PrivateElderRoute';
import PrivateSecretaryRoute from './components/PrivateSecretaryRoute';
import PrivateLMMORoute from './components/PrivateLMMORoute';
import PrivatePublisherRoute from './components/PrivatePublisherRoute';
import PrivateVipRoute from './components/PrivateVipRoute';
import PrivatePublicTalkCoordinatorRoute from './components/PrivatePublicTalkCoordinatorRoute';
import PrivateWeekendMeetingRoute from './components/PrivateWeekendMeetingRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { apiHostState, isLightThemeState, isOnlineState, visitorIDState } from './states/main';
import { congAccountConnectedState, congRoleState } from './states/congregation';
import { appSnackOpenState } from './states/notification';
import { InternetChecker } from './features/internetChecker';
import NotificationWrapper from './features/notificationWrapper';
import WaitingPage from './components/WaitingPage';
import backupWorkerInstance from './workers/backupWorker';
import PrivateMeetingEditorRoute from './components/PrivateMeetingEditorRoute';

// lazy loading
const Layout = lazy(() => import('./components/Layout'));
const Administration = lazy(() => import('./pages/Administration'));
const DashboardMenu = lazy(() => import('./pages/DashboardMenu'));
const Persons = lazy(() => import('./pages/Persons'));
const PersonDetails = lazy(() => import('./pages/PersonDetails'));
const Schedules = lazy(() => import('./pages/Schedules'));
const ScheduleDetails = lazy(() => import('./pages/ScheduleDetails'));
const S89 = lazy(() => import('./pages/S89'));
const ScheduleWeekDetails = lazy(() => import('./pages/ScheduleWeekDetails'));
const Settings = lazy(() => import('./pages/UserSettings'));
const SourceMaterials = lazy(() => import('./pages/SourceMaterials'));
const SourceWeekDetails = lazy(() => import('./pages/SourceWeekDetails'));
const CongregationPersonDetails = lazy(() => import('./pages/CongregationPersonDetails'));
const WeeklyAssignments = lazy(() => import('./pages/WeeklyAssignments'));
const CongregationSettings = lazy(() => import('./pages/CongregationSettings'));
const FieldServiceGroup = lazy(() => import('./pages/FieldServiceGroup'));
const MeetingAttendance = lazy(() => import('./pages/MeetingAttendance'));
const FieldServiceReport = lazy(() => import('./pages/FieldServiceReport'));
const BranchOfficeReports = lazy(() => import('./pages/BranchOfficeReports'));
const UserFieldServiceReport = lazy(() => import('./pages/UserFieldServiceReport'));
const UserBibleStudies = lazy(() => import('./pages/UserBibleStudies'));
const PendingFieldServiceReports = lazy(() => import('./pages/PendingFieldServiceReports'));
const PublicTalksList = lazy(() => import('./pages/PublicTalksList'));
const WeekendMeetingSchedule = lazy(() => import('./pages/WeekendMeetingSchedule'));
const VisitingSpeakers = lazy(() => import('./pages/VisitingSpeakers'));

const queryClient = new QueryClient();

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

const App = ({ updatePwa }) => {
	const setVisitorID = useSetRecoilState(visitorIDState);
	const setApiHost = useSetRecoilState(apiHostState);

	const isOnline = useRecoilValue(isOnlineState);
	const isLight = useRecoilValue(isLightThemeState);
	const appSnackOpen = useRecoilValue(appSnackOpenState);
	const isCongAccountConnected = useRecoilValue(congAccountConnectedState);
	const congRole = useRecoilValue(congRoleState);

	const [activeTheme, setActiveTheme] = useState(darkTheme);
	const [isLoading, setIsLoading] = useState(true);
	const [isSupported, setIsSupported] = useState(true);

	const secretaryRole = congRole.includes('secretary');
	const lmmoRole = congRole.includes('lmmo') || congRole.includes('lmmo-backup');
	const publicTalkCoordinatorRole = congRole.includes('public_talk_coordinator');
	const coordinatorRole = congRole.includes('coordinator');
	const adminRole = congRole.includes('admin');
	const elderRole =
		congRole.includes('elder') || secretaryRole || lmmoRole || coordinatorRole || publicTalkCoordinatorRole;
	const msRole = congRole.includes('ms');
	const publisherRole = congRole.includes('publisher') || msRole || elderRole;

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
					element: <PrivatePublisherRoute isPublisher={publisherRole} />,
					children: [
						{ path: '/user-field-service-reports', element: <UserFieldServiceReport /> },
						{ path: '/user-bible-studies', element: <UserBibleStudies /> },
					],
				},
				{
					element: <PrivateElderRoute isElder={elderRole} />,
					children: [
						{
							path: '/persons',
							element: <Persons />,
						},
						{
							path: '/persons/:id',
							element: <PersonDetails />,
						},
						{
							element: (
								<PrivateVipRoute
									isLMMO={lmmoRole}
									isSecretary={secretaryRole}
									isCoordinator={coordinatorRole}
									isPublicTalkCoordinator={publicTalkCoordinatorRole}
								/>
							),
							children: [
								{
									path: '/persons/new',
									element: <PersonDetails />,
								},
								{
									element: <PrivateLMMORoute isLMMO={lmmoRole} />,
									children: [
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
									],
								},
								{
									element: (
										<PrivateMeetingEditorRoute
											isMeetingEditor={lmmoRole || coordinatorRole || publicTalkCoordinatorRole}
										/>
									),
									children: [
										{
											path: '/source-materials',
											element: <SourceMaterials />,
										},
										{
											path: '/source-materials/:weekToFormat',
											element: <SourceWeekDetails />,
										},
									],
								},
								{
									element: <PrivateSecretaryRoute isSecretary={secretaryRole} />,
									children: [
										{
											path: '/field-service-group',
											element: <FieldServiceGroup />,
										},
										{
											path: '/meeting-attendance-record',
											element: <MeetingAttendance />,
										},
										{
											path: '/field-service-report',
											element: <FieldServiceReport />,
										},
										{
											path: '/branch-office-reports',
											element: <BranchOfficeReports />,
										},
										{
											path: '/pending-field-service-reports',
											element: <PendingFieldServiceReports />,
										},
									],
								},
								{
									element: <PrivatePublicTalkCoordinatorRoute isPublicTalkCoordinator={publicTalkCoordinatorRole} />,
									children: [
										{
											path: '/public-talks',
											element: <PublicTalksList />,
										},
										{
											path: '/visiting-speakers',
											element: <VisitingSpeakers />,
										},
									],
								},
								{
									element: (
										<PrivateWeekendMeetingRoute isWeekendMeetingRole={publicTalkCoordinatorRole || coordinatorRole} />
									),
									children: [
										{
											path: '/weekend-schedules',
											element: <WeekendMeetingSchedule />,
										},
									],
								},
							],
						},
						{
							path: '/congregation-settings',
							element: <CongregationSettings />,
						},
						{
							element: <PrivateVipConnectedRoute isCongAccountConnected={isCongAccountConnected} isAdmin={adminRole} />,
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
		const getUserID = async () => {
			try {
				const fp = await FingerprintJS.load();
				const result = await fp.get();

				const visitorId = result.visitorId;
				setVisitorID(visitorId);
				backupWorkerInstance.setVisitorID(visitorId);

				console.info('CPE: Fingerprint: Device visitor id has been set');
			} catch (error) {
				console.error(`CPE: Fingerprint: ${error}`);
			}
		};

		if (isOnline) getUserID();
	}, [setVisitorID, isOnline]);

	useEffect(() => {
		let apiHost;

		if (import.meta.env.VITE_BACKEND_API) {
			apiHost = import.meta.env.VITE_BACKEND_API;
		} else {
			if (import.meta.env.DEV || window.location.host.indexOf('localhost') !== -1) {
				apiHost = 'http://localhost:8000/';
			} else {
				apiHost = 'https://api.sws2apps.com/';
			}
		}

		setApiHost(apiHost);
		backupWorkerInstance.setApiHost(apiHost);

		console.info(`CPE: API: The client API is set to: ${apiHost}`);
	}, [setApiHost]);

	useEffect(() => {
		const checkBrowser = () => {
			if (!('Worker' in window)) {
				setIsSupported(false);
				console.error(`CPE: Browser Not Supported: Web Worker is not supported in this device`);
				return;
			}

			if (!('crypto' in window)) {
				setIsSupported(false);
				console.error(`CPE: Browser Not Supported: Web Crypto is not supported in this device`);
				return;
			}

			if (!crypto.randomUUID || typeof crypto.randomUUID !== 'function') {
				setIsSupported(false);
				console.error(`CPE: Browser Not Supported: Web Crypto RandomUUID is not supported in this device`);
				return;
			}

			if (!indexedDB) {
				setIsSupported(false);
				console.error(`CPE: Browser Not Supported: IndexedDb is not supported in this device`);
				return;
			}

			if (!('serviceWorker' in navigator)) {
				setIsSupported(false);
				console.error(`CPE: Browser Not Supported: Service Worker is not supported in this device`);
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
				<div className='browser-not-supported'>
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
