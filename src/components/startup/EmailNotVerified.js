import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import StartupHeader from './StartupHeader';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	apiHostState,
	isEmailNotVerifiedState,
	isUserSignInState,
	userEmailState,
	visitorIDState,
} from '../../appStates/appSettings';

const EmailNotVerified = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const setUserSignIn = useSetRecoilState(isUserSignInState);
	const setEmailNotVerified = useSetRecoilState(isEmailNotVerifiedState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const userEmail = useRecoilValue(userEmailState);
	const visitorID = useRecoilValue(visitorIDState);

	const [isProcessing, setIsProcessing] = useState(false);

	const handleSignIn = () => {
		setUserSignIn(true);
		setEmailNotVerified(false);
	};

	const handleResendVerification = async () => {
		setIsProcessing(true);

		if (apiHost !== '') {
			fetch(`${apiHost}api/users/resend-verification`, {
				signal: abortCont.signal,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					visitorid: visitorID,
					email: userEmail,
				},
			})
				.then(async (res) => {
					const data = await res.json();
					setIsProcessing(false);

					if (res.status !== 200) {
						setAppMessage(data.message);
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
				</Box>
			</Box>

			{!isProcessing && (
				<>
					<Box
						sx={{
							marginTop: '25px',
							display: 'flex',
							justifyContent: 'center',
							marginBottom: '10px',
						}}
					>
						<CheckCircleIcon
							color='success'
							sx={{
								fontSize: '60px',
								cursor: 'pointer',
							}}
						/>
					</Box>

					<Typography sx={{ lineHeight: 1.2, textAlign: 'justify' }}>
						{t('login.verifyAccount')}
					</Typography>
				</>
			)}

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
				{!isProcessing && (
					<Link
						component='button'
						underline='none'
						variant='body2'
						onClick={handleResendVerification}
					>
						{t('login.resendVerify')}
					</Link>
				)}

				<Button
					variant='contained'
					onClick={handleSignIn}
					disabled={isProcessing}
				>
					OK
				</Button>
			</Box>
		</StartupHeader>
	);
};

export default EmailNotVerified;
