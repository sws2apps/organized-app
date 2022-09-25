import { lazy, Suspense, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { HashRouter, Route, Routes } from 'react-router-dom';
import usePwa2 from 'use-pwa2/dist/index.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppNotification from './components/root/AppNotification';
import InternetChecker from './components/root/InternetChecker';
import Layout from './components/root/Layout';
import S89Template from './template/S89Template';
import ScheduleTemplate from './template/ScheduleTemplate';
import ServiceWorkerWrapper from './components/root/ServiceWorkerWrapper';
import Startup from './pages/Startup';
import StudentDetails from './pages/StudentDetails';
import PrivateRoute from './components/root/PrivateRoot';
import UserSignOut from './components/root/UserSignOut';
import VipUserDetail from './pages/VipUserDetail';
import { isAdminCongState } from './appStates/appCongregation';
import { apiHostState, isAppLoadState } from './appStates/appSettings';
import { appSnackOpenState } from './appStates/appNotification';

const Home = lazy(() => import('./pages/Home'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Settings = lazy(() => import('./pages/Settings'));
const SourceMaterial = lazy(() => import('./pages/SourceMaterial'));
const Students = lazy(() => import('./pages/Students'));
const Administration = lazy(() => import('./pages/Administration'));

const theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			xs420: 420,
			sm: 600,
			sm800: 800,
			md: 900,
			lg: 1280,
			xl: 1536,
		},
	},
});

const App = ({ updatePwa }) => {
	const { enabledInstall, installPwa, isLoading } = usePwa2();

	const isAppLoad = useRecoilValue(isAppLoadState);
	const appSnackOpen = useRecoilValue(appSnackOpenState);
	const isAdminCong = useRecoilValue(isAdminCongState);

	const setApiHost = useSetRecoilState(apiHostState);

	useEffect(() => {
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			setApiHost('http://localhost:8000/');
		} else {
			setApiHost('https://sws2apps-api.onrender.com/');
		}
	}, [setApiHost]);

	useEffect(() => {
		if (!indexedDB) {
			if ('serviceWorker' in navigator) {
			} else {
				return (
					<div className='browser-not-supported'>
						You seem to use an unsupported browser to use LMM-OA. Make sure that
						you browser is up to date, or try to use another browser.
					</div>
				);
			}
		}
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<InternetChecker />
			<ServiceWorkerWrapper
				enabledInstall={enabledInstall}
				updatePwa={updatePwa}
			/>
			<UserSignOut />
			{appSnackOpen && <AppNotification />}
			{isAppLoad && <Startup />}
			{!isAppLoad && (
				<Suspense fallback={<div></div>}>
					<HashRouter>
						<Layout
							enabledInstall={enabledInstall}
							isLoading={isLoading}
							installPwa={installPwa}
						>
							<Routes>
								<Route path='/' element={<Home />} />
								<Route path='/students' element={<Students />} />
								<Route path='/students/new' element={<StudentDetails />} />
								<Route path='/students/:id' element={<StudentDetails />} />
								<Route
									path='/schedule-template'
									element={<ScheduleTemplate />}
								/>
								<Route path='/schedule' element={<Schedule />} />
								<Route path='/s89-template' element={<S89Template />} />
								<Route path='/source-material' element={<SourceMaterial />} />
								<Route path='/settings' element={<Settings />} />
								<Route element={<PrivateRoute isAdminCong={isAdminCong} />}>
									<Route path='/administration' element={<Administration />} />
									<Route
										path='/administration/members/new'
										element={<VipUserDetail />}
									/>
									<Route
										path='/administration/members/:id'
										element={<VipUserDetail />}
									/>
								</Route>
							</Routes>
						</Layout>
					</HashRouter>
				</Suspense>
			)}
		</ThemeProvider>
	);
};

export default App;
