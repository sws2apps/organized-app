import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CongregationRequestSent from '../components/startup/CongregationRequestSent';
import CongregationSignUp from '../components/startup/CongregationSignUp';
import CongregationWait from '../components/startup/CongregationWait';
import EmailBlocked from '../components/startup/EmailBlocked';
import EmailNotVerified from '../components/startup/EmailNotVerified';
import LinearProgressWithLabel from '../components/reusable/LinearProgressWithLabel';
import TermsUse from '../components/startup/TermsUse';
import UnauthorizedRole from '../components/startup/UnauthorizedRole';
import UserMfaSetup from '../components/startup/UserMfaSetup';
import UserMfaVerify from '../components/startup/UserMfaVerify';
import UserSignIn from '../components/startup/UserSignIn';
import UserSignUp from '../components/startup/UserSignUp';
import {
	isAppLoadState,
	isCongAccountCreateState,
	isCongRequestSentState,
	isCongWaitRequestState,
	isEmailBlockedState,
	isEmailNotVerifiedState,
	isSetupState,
	isShowTermsUseState,
	isUnauthorizedRoleState,
	isUserMfaSetupState,
	isUserMfaVerifyState,
	isUserSignInState,
	isUserSignUpState,
	startupProgressState,
} from '../appStates/appSettings';
import {
	congAccountConnectedState,
	offlineOverrideState,
} from '../appStates/appCongregation';
import { dbGetAppSettings } from '../indexedDb/dbAppSettings';
import { loadApp } from '../utils/app';
import { runUpdater } from '../utils/updater';

const Startup = () => {
	const [isSetup, setIsSetup] = useRecoilState(isSetupState);
	const [startupProgress, setStartupProgress] =
		useRecoilState(startupProgressState);

	const setIsAppLoad = useSetRecoilState(isAppLoadState);

	const isUserMfaSetup = useRecoilValue(isUserMfaSetupState);
	const isUserMfaVerify = useRecoilValue(isUserMfaVerifyState);
	const isUserSignIn = useRecoilValue(isUserSignInState);
	const isUserSignUp = useRecoilValue(isUserSignUpState);
	const isEmailBlocked = useRecoilValue(isEmailBlockedState);
	const isEmailNotVerified = useRecoilValue(isEmailNotVerifiedState);
	const isCongAccountCreate = useRecoilValue(isCongAccountCreateState);
	const isCongRequestSent = useRecoilValue(isCongRequestSentState);
	const isCongWaitRequest = useRecoilValue(isCongWaitRequestState);
	const isShowTermsUse = useRecoilValue(isShowTermsUseState);
	const isUnauthorizedRole = useRecoilValue(isUnauthorizedRoleState);
	const offlineOverride = useRecoilValue(offlineOverrideState);
	const congAccountConnected = useRecoilValue(congAccountConnectedState);

	useEffect(() => {
		const checkLoginState = async () => {
			if (offlineOverride) {
				setIsSetup(true);
			} else {
				let { isLoggedOut, userPass, username } = await dbGetAppSettings();

				isLoggedOut = isLoggedOut === undefined ? true : isLoggedOut;

				if (!isLoggedOut && userPass?.length > 0 && username?.length > 0) {
					await loadApp();
					await runUpdater();
					setTimeout(() => {
						setIsAppLoad(false);
						setStartupProgress(0);
					}, [1000]);
				} else {
					setIsSetup(true);
				}
			}
		};

		checkLoginState();
	}, [offlineOverride, setIsAppLoad, setIsSetup, setStartupProgress]);

	useEffect(() => {
		const skipLoad = async () => {
			setIsSetup(false);
			await loadApp();
			await runUpdater();
			setTimeout(() => {
				setIsAppLoad(false);
				setStartupProgress(0);
			}, [1000]);
		};

		if (congAccountConnected) {
			skipLoad();
		}
	}, [congAccountConnected, setIsAppLoad, setStartupProgress, setIsSetup]);

	if (isSetup) {
		return (
			<>
				{isShowTermsUse && <TermsUse />}
				{!isShowTermsUse && (
					<>
						{isUserSignIn && <UserSignIn />}
						{isUserSignUp && <UserSignUp />}
						{isEmailNotVerified && <EmailNotVerified />}
						{isEmailBlocked && <EmailBlocked />}
						{isUserMfaSetup && <UserMfaSetup />}
						{isUserMfaVerify && <UserMfaVerify />}
						{isUnauthorizedRole && <UnauthorizedRole />}
						{isCongAccountCreate && <CongregationSignUp />}
						{isCongRequestSent && <CongregationRequestSent />}
						{isCongWaitRequest && <CongregationWait />}
					</>
				)}
			</>
		);
	}

	return (
		<div className='app-splash-screen'>
			<div className='app-logo-container'>
				<img src='/img/appLogo.png' alt='App logo' className='appLogo' />
			</div>
			<Box sx={{ width: '280px', marginTop: '10px' }}>
				<LinearProgressWithLabel value={startupProgress} />
			</Box>
		</div>
	);
};

export default Startup;
