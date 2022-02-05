import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CongregationLogin from '../components/administration/CongregationLogin';
import { congIDState, congPasswordState } from '../appStates/appCongregation';
import {
	isCongConnectedState,
	isCongCreateAccountState,
	isCongLoginOpenState,
	isCongSignInState,
	isCongUpdateAccountState,
	isUserLoggedState,
} from '../appStates/appSettings';

const Administration = () => {
	const { t } = useTranslation();

	const [isLoginOpen, setIsLoginOpen] = useRecoilState(isCongLoginOpenState);
	const [isConnected, setIsConnected] = useRecoilState(isCongConnectedState);

	const isUserLogged = useRecoilValue(isUserLoggedState);
	const congID = useRecoilValue(congIDState);
	const congPassword = useRecoilValue(congPasswordState);

	const setIsCongCreateAccount = useSetRecoilState(isCongCreateAccountState);
	const setIsCongSignIn = useSetRecoilState(isCongSignInState);
	const setIsCongUpdateAccount = useSetRecoilState(isCongUpdateAccountState);

	const handleCreateCongAccount = () => {
		setIsCongCreateAccount(true);
		setIsCongSignIn(false);
		setIsCongUpdateAccount(false);
		setIsLoginOpen(true);
	};

	const handleSignIn = () => {
		setIsCongCreateAccount(false);
		setIsCongSignIn(true);
		setIsCongUpdateAccount(false);
		setIsLoginOpen(true);
	};

	const handleUpdateCongAccount = () => {
		setIsCongCreateAccount(false);
		setIsCongSignIn(false);
		setIsCongUpdateAccount(true);
		setIsLoginOpen(true);
	};

	useEffect(() => {
		if (!isUserLogged) {
			setIsConnected(false);
		}
	}, [isUserLogged, setIsConnected]);

	return (
		<>
			{isLoginOpen && <CongregationLogin />}
			<Box>
				<Typography
					sx={{
						fontWeight: 'bold',
						lineHeight: '1.2',
						marginBottom: '10px',
					}}
				>
					{t('administration.congregationAccount')}
				</Typography>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-start',
					}}
				>
					{isUserLogged && (
						<>
							{isConnected && (
								<Box
									sx={{
										marginTop: '10px',
									}}
								>
									<TextField
										label={t('administration.congregationId')}
										variant='outlined'
										type='number'
										size='small'
										sx={{
											width: '150px',
											marginRight: '10px',
											marginBottom: '15px',
										}}
										value={congID}
										InputProps={{
											readOnly: true,
										}}
									/>
									<TextField
										label={t('administration.congregationPassphrase')}
										variant='outlined'
										size='small'
										type='password'
										sx={{
											width: '200px',
											marginRight: '10px',
											marginBottom: '15px',
										}}
										value={congPassword}
										InputProps={{
											readOnly: true,
										}}
									/>
									<Button
										variant='contained'
										color='primary'
										onClick={handleUpdateCongAccount}
										sx={{
											marginBottom: '15px',
										}}
									>
										{t('administration.congregationInfoUpdate')}
									</Button>
								</Box>
							)}
							{!isConnected && (
								<>
									{congID.length === 10 && (
										<Button
											variant='contained'
											color='primary'
											onClick={handleCreateCongAccount}
											sx={{
												marginRight: '8px',
											}}
										>
											{t('administration.createCongregationAccount')}
										</Button>
									)}
									<Button
										variant='contained'
										color='primary'
										onClick={handleSignIn}
									>
										{t('administration.signInCongregationAccount')}
									</Button>
								</>
							)}
						</>
					)}
					{!isUserLogged && (
						<Typography>{t('administration.userLogin')}</Typography>
					)}
				</Box>
			</Box>
		</>
	);
};

export default Administration;
