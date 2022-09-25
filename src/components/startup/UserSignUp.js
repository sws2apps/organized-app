import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import StartupHeader from './StartupHeader';
import { isEmailValid } from '../../utils/emailValid';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	apiHostState,
	isEmailNotVerifiedState,
	isOnlineState,
	isUserSignInState,
	isUserSignUpState,
	visitorIDState,
} from '../../appStates/appSettings';

const UserSignUp = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [userTmpFullname, setUserTmpFullname] = useState('');
	const [userTmpPwd, setUserTmpPwd] = useState('');
	const [userTmpConfirmPwd, setUserTmpConfirmPwd] = useState('');
	const [userTmpEmail, setUserTmpEmail] = useState('');
	const [hasErrorFullname, setHasErrorFullname] = useState(false);
	const [hasErrorEmail, setHasErrorEmail] = useState(false);
	const [hasErrorPwd, setHasErrorPwd] = useState(false);
	const [hasErrorConfirmPwd, setHasErrorConfirmPwd] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const setUserSignIn = useSetRecoilState(isUserSignInState);
	const setUserSignUp = useSetRecoilState(isUserSignUpState);
	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setEmailNotVerified = useSetRecoilState(isEmailNotVerifiedState);

	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const isOnline = useRecoilValue(isOnlineState);

	const handleSignIn = () => {
		setUserSignIn(true);
		setUserSignUp(false);
	};

	const handleSignUp = async () => {
		setHasErrorEmail(false);
		setHasErrorPwd(false);
		setHasErrorConfirmPwd(false);
		if (
			userTmpFullname.length >= 3 &&
			isEmailValid(userTmpEmail) &&
			userTmpPwd.length >= 10 &&
			userTmpPwd === userTmpConfirmPwd
		) {
			setIsProcessing(true);
			const reqPayload = {
				email: userTmpEmail,
				password: userTmpPwd,
				fullname: userTmpFullname,
			};

			if (apiHost !== '') {
				fetch(`${apiHost}api/users/create-account`, {
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
							setEmailNotVerified(true);
							setIsProcessing(false);
							setUserSignUp(false);
						} else {
							let warnMsg = '';
							if (data.message === 'ACCOUNT_IN_USE') {
								warnMsg = t('login.accountExist');
							} else {
								warnMsg = data.message;
							}
							setIsProcessing(false);
							setAppMessage(warnMsg);
							setAppSeverity('warning');
							setAppSnackOpen(true);
						}
					})
					.catch(() => {
						setIsProcessing(false);
						setAppMessage(t('login.createFailed'));
						setAppSeverity('error');
						setAppSnackOpen(true);
					});
			}
		} else {
			if (userTmpFullname.length < 3) {
				setHasErrorFullname(true);
			}
			if (!isEmailValid(userTmpEmail)) {
				setHasErrorEmail(true);
			}
			if (userTmpPwd.length < 10) {
				setHasErrorPwd(true);
			}
			if (userTmpConfirmPwd.length < 10 || userTmpPwd !== userTmpConfirmPwd) {
				setHasErrorConfirmPwd(true);
			}
		}
	};

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
						{t('login.newUserAccount')}
					</Typography>
				</Box>
			</Box>

			<TextField
				id='outlined-fullname'
				label={t('login.fullname')}
				variant='outlined'
				size='small'
				autoComplete='off'
				required
				value={userTmpFullname}
				onChange={(e) => setUserTmpFullname(e.target.value)}
				error={hasErrorFullname ? true : false}
			/>
			<TextField
				sx={{ marginTop: '15px' }}
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
			<TextField
				sx={{ marginTop: '15px' }}
				id='outlined-confirm-password'
				label={t('login.confirmPassword')}
				type='password'
				variant='outlined'
				size='small'
				autoComplete='off'
				required
				value={userTmpConfirmPwd}
				onChange={(e) => setUserTmpConfirmPwd(e.target.value)}
				error={hasErrorConfirmPwd ? true : false}
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
				<Link
					component='button'
					underline='none'
					variant='body2'
					onClick={handleSignIn}
				>
					{t('login.hasAccount')}
				</Link>
				<Button
					variant='contained'
					onClick={handleSignUp}
					disabled={!isOnline || isProcessing || visitorID.length === 0}
				>
					{t('login.createAccount')}
				</Button>
			</Box>
		</StartupHeader>
	);
};

export default UserSignUp;
