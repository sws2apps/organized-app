import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// states
import {
	apiHostState,
	isAppClosingState,
	isAppLoadState,
	isOnlineState,
	isSetupState,
	isUserMfaSetupState,
	isUserMfaVerifyState,
	isUserSignInState,
	userEmailState,
	visitorIDState,
} from '../../appStates/appSettings';
import {
	congAccountConnectedState,
	offlineOverrideState,
} from '../../appStates/appCongregation';

// utils
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';

const UserSignOut = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const { t } = useTranslation();

	const [open, setOpen] = useRecoilState(isAppClosingState);
	const [userEmail, setUserEmail] = useRecoilState(userEmailState);
	const [congAccountConnected, setCongAccountConnectedState] = useRecoilState(
		congAccountConnectedState
	);

	const setIsAppLoad = useSetRecoilState(isAppLoadState);
	const setIsSetup = useSetRecoilState(isSetupState);
	const setUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
	const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
	const setUserSignIn = useSetRecoilState(isUserSignInState);
	const setOfflineOverrideState = useSetRecoilState(offlineOverrideState);

	const isOnline = useRecoilValue(isOnlineState);
	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway' || reason === 'backdropClick') {
			return;
		}
		setOpen(false);
	};

	const handleLogout = useCallback(async () => {
		if (isOnline && congAccountConnected) {
			if (apiHost !== '') {
				await fetch(`${apiHost}api/users/logout`, {
					signal: abortCont.signal,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						visitorid: visitorID,
						email: userEmail,
					},
				});

				setCongAccountConnectedState(false);
			}
		}

		localStorage.removeItem('email');
		await dbUpdateAppSettings({ isLoggedOut: true });

		setOpen(false);
		setOfflineOverrideState(false);
		setIsAppLoad(true);
		setIsSetup(true);
		setUserMfaSetup(false);
		setUserMfaVerify(false);
		setUserSignIn(true);
		setUserEmail('');
	}, [
		abortCont,
		apiHost,
		congAccountConnected,
		isOnline,
		setCongAccountConnectedState,
		setIsAppLoad,
		setIsSetup,
		setOfflineOverrideState,
		setOpen,
		setUserMfaSetup,
		setUserMfaVerify,
		setUserSignIn,
		setUserEmail,
		userEmail,
		visitorID,
	]);

	useEffect(() => {
		if (open) handleLogout();
	}, [handleLogout, open]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-close-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-close-title'>
					{t('global.waitSignOut')}
				</DialogTitle>
				<DialogContent>
					<CircularProgress
						color='secondary'
						size={80}
						disableShrink={true}
						sx={{
							display: 'flex',
							margin: '10px auto',
						}}
					/>
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default UserSignOut;
