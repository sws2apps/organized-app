import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Typography from '@mui/material/Typography';
import StartupHeader from './StartupHeader';
import {
	isUnauthorizedRoleState,
	isUserSignInState,
} from '../../appStates/appSettings';

const UnauthorizedRole = () => {
	const { t } = useTranslation();

	const setUserSignIn = useSetRecoilState(isUserSignInState);
	const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);

	const handleSignIn = () => {
		setUserSignIn(true);
		setIsUnauthorizedRole(false);
	};

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

			<Box
				sx={{
					marginTop: '25px',
					display: 'flex',
					justifyContent: 'center',
					marginBottom: '10px',
				}}
			>
				<ContactSupportIcon
					sx={{
						fontSize: '60px',
						cursor: 'pointer',
						color: 'red',
					}}
				/>
			</Box>

			<Typography sx={{ lineHeight: 1.2, textAlign: 'center' }}>
				{t('login.unauthorizedRole')}
			</Typography>

			<Box
				sx={{
					marginTop: '20px',
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<Button variant='contained' onClick={handleSignIn}>
					OK
				</Button>
			</Box>
		</StartupHeader>
	);
};

export default UnauthorizedRole;
