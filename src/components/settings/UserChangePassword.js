import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { dbGetAppSettings } from '../../indexedDb/dbAppSettings';
import { decryptString } from '../../utils/sws-encryption';
import {
	apiHostState,
	rootModalOpenState,
	userEmailState,
	userIDState,
	visitorIDState,
} from '../../appStates/appSettings';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';

const password = {
	width: '320px',
	marginRight: '5px',
	marginBottom: '15px',
};

const UserChangePassword = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const { t } = useTranslation();

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setModalOpen = useSetRecoilState(rootModalOpenState);

	const userEmail = useRecoilValue(userEmailState);
	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const userID = useRecoilValue(userIDState);

	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

	const handleUpdatePassword = async () => {
		try {
			// verify password requirements
			if (newPassword.length < 10 || newPasswordConfirm.length < 10) {
				setAppMessage(t('settings.passwordRequirements'));
				setAppSeverity('warning');
				setAppSnackOpen(true);
				return;
			}

			// validating old password
			const { userPass } = await dbGetAppSettings();
			const crdParse = await decryptString(oldPassword, userPass);
			if (!crdParse.pwd) {
				setAppMessage(t('settings.passwordIncorrect'));
				setAppSeverity('warning');
				setAppSnackOpen(true);
				return;
			}

			// validating new password
			if (newPassword !== newPasswordConfirm) {
				setAppMessage(t('settings.passwordNotEqual'));
				setAppSeverity('warning');
				setAppSnackOpen(true);
				return;
			}

			// update password in firebase auth
			if (apiHost !== '') {
				setModalOpen(true);

				const res = await fetch(`${apiHost}api/users/${userID}/password`, {
					signal: abortCont.signal,
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						visitor_id: visitorID,
						email: userEmail,
					},
					body: JSON.stringify({ password: newPassword }),
				});

				const data = await res.json();

				if (res.status === 200) {
					setModalOpen(false);
					setAppMessage(t('settings.passwordChanged'));
					setAppSeverity('success');
					setAppSnackOpen(true);

					setOldPassword('');
					setNewPassword('');
					setNewPasswordConfirm('');
					return;
				}

				setModalOpen(false);
				setAppMessage(data.message);
				setAppSeverity('warning');
				setAppSnackOpen(true);
			}
		} catch (err) {
			setModalOpen(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
		}
	};

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<TextField
					id='settings-old-password'
					label={t('settings.oldPassword')}
					variant='outlined'
					type='password'
					size='small'
					autoComplete='off'
					required
					sx={password}
					value={oldPassword}
					onChange={(e) => setOldPassword(e.target.value)}
				/>
				<TextField
					id='settings-new-password'
					type='password'
					label={t('settings.newPassword')}
					variant='outlined'
					size='small'
					autoComplete='off'
					required
					sx={password}
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
				<TextField
					id='settings-confirm-password'
					type='password'
					label={t('settings.confirmPassword')}
					variant='outlined'
					size='small'
					autoComplete='off'
					required
					sx={password}
					value={newPasswordConfirm}
					onChange={(e) => setNewPasswordConfirm(e.target.value)}
				/>
			</Box>
			<Button onClick={handleUpdatePassword} variant='contained'>
				{t('global.update')}
			</Button>
		</Box>
	);
};

export default UserChangePassword;
