import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import StartupHeader from './StartupHeader';
import { loadApp } from '../../utils/app';
import { runUpdater } from '../../utils/updater';
import { isEmailValid } from '../../utils/emailValid';
import { decryptString } from '../../utils/sws-encryption';
import {
	dbGetAppSettings,
	dbUpdateAppSettings,
} from '../../indexedDb/dbAppSettings';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	apiHostState,
	isAppLoadState,
	isEmailNotVerifiedState,
	isOnlineState,
	isSetupState,
	isUserMfaSetupState,
	isUserMfaVerifyState,
	isUserSignInState,
	isUserSignUpState,
	qrCodePathState,
	secretTokenPathState,
	userEmailState,
	userPasswordState,
	visitorIDState,
	startupProgressState,
} from '../../appStates/appSettings';
import { offlineOverrideState } from '../../appStates/appCongregation';

const UserSignIn = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [userTmpPwd, setUserTmpPwd] = useState('');
	const [userTmpEmail, setUserTmpEmail] = useState('');
	const [hasErrorEmail, setHasErrorEmail] = useState(false);
	const [hasErrorPwd, setHasErrorPwd] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isInternetNeeded, setIsInternetNeeded] = useState(true);

	const [visitorID, setVisitorID] = useRecoilState(visitorIDState);

	const setUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
	const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
	const setUserSignIn = useSetRecoilState(isUserSignInState);
	const setUserSignUp = useSetRecoilState(isUserSignUpState);
	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setEmailNotVerified = useSetRecoilState(isEmailNotVerifiedState);
	const setUserEmail = useSetRecoilState(userEmailState);
	const setUserPassword = useSetRecoilState(userPasswordState);
	const setQrCodePath = useSetRecoilState(qrCodePathState);
	const setSecretTokenPath = useSetRecoilState(secretTokenPathState);
	const setIsSetup = useSetRecoilState(isSetupState);
	const setIsAppLoad = useSetRecoilState(isAppLoadState);
	const setStartupProgress = useSetRecoilState(startupProgressState);

	const apiHost = useRecoilValue(apiHostState);
	const isOnline = useRecoilValue(isOnlineState);
	const offlineOverride = useRecoilValue(offlineOverrideState);

	const handleSignUp = () => {
		setUserSignUp(true);
		setUserSignIn(false);
	};

	const signInSwitch = async () => {
		if (isInternetNeeded) {
			await handleSignIn();
		} else {
			await handleSignInWithoutInternet();
		}
	};

	const handleSignInWithoutInternet = async () => {
		try {
			setHasErrorEmail(false);
			setHasErrorPwd(false);
			if (isEmailValid(userTmpEmail) && userTmpPwd.length >= 10) {
				setIsProcessing(true);

				const { userPass } = await dbGetAppSettings();
				const crdParse = await decryptString(userTmpPwd, userPass);

				if (userTmpEmail === crdParse.email && userTmpPwd === crdParse.pwd) {
					await loadApp();
					await dbUpdateAppSettings({ isLoggedOut: false });

					setUserEmail(userTmpEmail);
					localStorage.setItem('email', userTmpEmail);

					setUserPassword(userTmpPwd);

					setIsSetup(false);

					await runUpdater();

					setTimeout(() => {
						setIsAppLoad(false);
						setStartupProgress(0);
					}, [2000]);
				} else {
					setAppMessage(t('login.incorrectInfo'));
					setAppSeverity('warning');
					setIsProcessing(false);
					setAppSnackOpen(true);
				}
			} else {
				if (!isEmailValid(userTmpEmail)) {
					setHasErrorEmail(true);
				}
				if (userTmpPwd.length < 10) {
					setHasErrorPwd(true);
				}
			}
		} catch (err) {
			setAppMessage(t('login.incorrectInfo'));
			setAppSeverity('warning');
			setIsProcessing(false);
			setAppSnackOpen(true);
		}
	};

	const handleSignIn = () => {
		setHasErrorEmail(false);
		setHasErrorPwd(false);
		if (isEmailValid(userTmpEmail) && userTmpPwd.length >= 10) {
			setIsProcessing(true);
			const reqPayload = {
				email: userTmpEmail,
				password: userTmpPwd,
				visitorid: visitorID,
			};

			if (apiHost !== '') {
				fetch(`${apiHost}user-login`, {
					signal: abortCont.signal,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(reqPayload),
				})
					.then(async (res) => {
						const data = await res.json();
						if (res.status === 200) {
							setUserEmail(userTmpEmail);
							localStorage.setItem('email', userTmpEmail);
							setUserPassword(userTmpPwd);
							setIsProcessing(false);
							setUserMfaVerify(true);
							setUserSignIn(false);
						} else {
							if (data.secret && data.qrCode) {
								setUserEmail(userTmpEmail);
								localStorage.setItem('email', userTmpEmail);
								setUserPassword(userTmpPwd);
								setIsProcessing(false);
								setSecretTokenPath(data.secret);
								setQrCodePath(data.qrCode);
								setUserMfaSetup(true);
								setUserSignIn(false);
							} else if (data.message === 'NOT_VERIFIED') {
								setUserEmail(userTmpEmail);
								localStorage.setItem('email', userTmpEmail);
								setIsProcessing(false);
								setEmailNotVerified(true);
								setUserSignIn(false);
							} else {
								let warnMsg = '';
								if (
									data.message === 'EMAIL_NOT_FOUND' ||
									data.message === 'INVALID_EMAIL' ||
									data.message === 'MISSING_EMAIL'
								) {
									warnMsg = t('login.accountNotFound');
								} else if (data.message === 'INVALID_PASSWORD') {
									warnMsg = t('login.incorrectInfo');
								} else if (data.message === 'USER_DISABLED') {
									warnMsg = t('login.accountDisabled');
								} else if (
									data.message === 'BLOCKED_TEMPORARILY_TRY_AGAIN' ||
									data.message === 'BLOCKED_TEMPORARILY'
								) {
									warnMsg = t('login.hostBlocked');
								} else {
									warnMsg = t('global.errorTryAgain');
								}
								setIsProcessing(false);
								setAppMessage(warnMsg);
								setAppSeverity('warning');
								setAppSnackOpen(true);
							}
						}
					})
					.catch((err) => {
						setIsProcessing(false);
						setAppMessage(err.message);
						setAppSeverity('error');
						setAppSnackOpen(true);
					});
			}
		} else {
			if (!isEmailValid(userTmpEmail)) {
				setHasErrorEmail(true);
			}
			if (userTmpPwd.length < 10) {
				setHasErrorPwd(true);
			}
		}
	};

	useEffect(() => {
		const checkDbs = async () => {
			if (offlineOverride) {
				setIsInternetNeeded(true);
			} else {
				const { username, userPass } = await dbGetAppSettings();
				if (!username || !userPass) {
					setIsInternetNeeded(true);
				} else {
					setIsInternetNeeded(false);
				}
			}
		};

		checkDbs();
	}, [offlineOverride]);

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
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<StartupHeader>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<img
					src='/img/appLogo.png'
					alt='App logo'
					className={'appLogoStartup'}
				/>
				<Box>
					<Typography align='center' sx={{ lineHeight: 1.2, marginTop: '5px' }}>
						Life and Ministry Meeting Overseer Assistant
					</Typography>
					<Typography
						align='center'
						sx={{
							fontSize: '14px',
							lineHeight: 1.2,
							marginTop: '10px',
							marginBottom: '25px',
						}}
					>
						{isInternetNeeded
							? t('login.signInWithInternet')
							: t('login.signInNoInternet')}
					</Typography>
				</Box>
			</Box>

			<TextField
				id='outlined-email'
				label={t('login.email')}
				variant='outlined'
				size='small'
				autoComplete='off'
				required
				value={userTmpEmail}
				onChange={(e) => setUserTmpEmail(e.target.value)}
				error={hasErrorEmail ? true : false}
			/>
			<TextField
				sx={{ marginTop: '15px' }}
				id='outlined-password'
				label={t('login.password')}
				type='password'
				variant='outlined'
				size='small'
				autoComplete='off'
				required
				value={userTmpPwd}
				onChange={(e) => setUserTmpPwd(e.target.value)}
				error={hasErrorPwd ? true : false}
			/>

			{isProcessing && (
				<Container
					sx={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '15px',
					}}
				>
					<CircularProgress disableShrink color='secondary' size={'40px'} />
				</Container>
			)}

			<Box
				sx={{
					marginTop: '20px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Box>
					{visitorID.length > 0 && (
						<Link
							component='button'
							underline='none'
							variant='body2'
							onClick={handleSignUp}
						>
							{t('login.createSwsAccount')}
						</Link>
					)}
				</Box>

				<Button
					variant='contained'
					onClick={signInSwitch}
					disabled={
						isProcessing || (isInternetNeeded && visitorID.length === 0)
					}
				>
					{t('global.signIn')}
				</Button>
			</Box>
		</StartupHeader>
	);
};

export default UserSignIn;
