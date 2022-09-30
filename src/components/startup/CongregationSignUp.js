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
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	apiHostState,
	isCongRequestSentState,
	isUserSignInState,
	isCongAccountCreateState,
	isCongWaitRequestState,
	userEmailState,
	visitorIDState,
} from '../../appStates/appSettings';

const CongregationSignUp = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [userTmpCongName, setUserTmpCongName] = useState('');
	const [userTmpCongNumber, setUserTmpCongNumber] = useState('');
	const [hasErrorCongName, setHasErrorCongName] = useState(false);
	const [hasErrorCongNumber, setHasErrorCongNumber] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const setUserSignIn = useSetRecoilState(isUserSignInState);
	const setIsCongAccountCreate = useSetRecoilState(isCongAccountCreateState);
	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setIsCongRequestSent = useSetRecoilState(isCongRequestSentState);
	const setIsCongWaitRequest = useSetRecoilState(isCongWaitRequestState);

	const apiHost = useRecoilValue(apiHostState);
	const userEmail = useRecoilValue(userEmailState);
	const visitorID = useRecoilValue(visitorIDState);

	const handleSignIn = () => {
		setUserSignIn(true);
		setIsCongAccountCreate(false);
	};

	const handleSignUp = async () => {
		setHasErrorCongName(false);
		setHasErrorCongNumber(false);
		if (userTmpCongName.length > 0 && userTmpCongNumber.length > 0) {
			setIsProcessing(true);
			const reqPayload = {
				email: userEmail,
				cong_name: userTmpCongName,
				cong_number: userTmpCongNumber,
				app_requestor: 'lmmo',
			};

			if (apiHost !== '') {
				fetch(`${apiHost}api/congregations`, {
					signal: abortCont.signal,
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						visitorid: visitorID,
						email: userEmail,
					},
					body: JSON.stringify(reqPayload),
				})
					.then(async (res) => {
						const data = await res.json();
						if (res.status === 200) {
							setIsCongRequestSent(true);
							setIsProcessing(false);
							setIsCongAccountCreate(false);
						} else if (res.status === 405) {
							setIsCongWaitRequest(true);
							setIsProcessing(false);
							setIsCongAccountCreate(false);
						} else {
							setIsProcessing(false);
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
		} else {
			if (userTmpCongName.length === 0) {
				setHasErrorCongName(true);
			}
			if (userTmpCongNumber.length === 0) {
				setHasErrorCongNumber(true);
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
						{t('login.createCongregationAccount')}
					</Typography>
				</Box>
			</Box>

			<TextField
				id='outlined-email'
				label={t('login.congregationName')}
				variant='outlined'
				size='small'
				autoComplete='off'
				required
				value={userTmpCongName}
				onChange={(e) => setUserTmpCongName(e.target.value)}
				error={hasErrorCongName ? true : false}
			/>
			<TextField
				id='outlined-email'
				label={t('login.congregationNumber')}
				sx={{ marginTop: '15px' }}
				variant='outlined'
				size='small'
				autoComplete='off'
				type='number'
				required
				value={userTmpCongNumber}
				onChange={(e) => setUserTmpCongNumber(e.target.value)}
				error={hasErrorCongNumber ? true : false}
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
					disabled={isProcessing}
				>
					{t('login.requestAccount')}
				</Button>
			</Box>
		</StartupHeader>
	);
};

export default CongregationSignUp;
