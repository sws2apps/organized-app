import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
	congIDState,
	congNameState,
	congNumberState,
	congPasswordState,
} from '../../appStates/appCongregation';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	apiHostState,
	isCongConnectedState,
	isCongCreateAccountState,
	isCongLoginOpenState,
	isCongSignInState,
	isCongUpdateAccountState,
	uidUserState,
} from '../../appStates/appSettings';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';

const CongregationLogin = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [congID, setCongID] = useRecoilState(congIDState);
	const [open, setOpen] = useRecoilState(isCongLoginOpenState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setIsConnected = useSetRecoilState(isCongConnectedState);
	const setCongPassword = useSetRecoilState(congPasswordState);

	const apiHost = useRecoilValue(apiHostState);
	const uidUser = useRecoilValue(uidUserState);
	const isCongCreateAccount = useRecoilValue(isCongCreateAccountState);
	const isCongSignIn = useRecoilValue(isCongSignInState);
	const isCongUpdateAccount = useRecoilValue(isCongUpdateAccountState);
	const congName = useRecoilValue(congNameState);
	const congNumber = useRecoilValue(congNumberState);

	const [congTempID, setCongTempID] = useState(congID);
	const [congTempPassword, setCongTempPassword] = useState('');
	const [congTempConfirmPwd, setCongTempConfirmPwd] = useState('');
	const [congTempOldPwd, setCongTempOldPwd] = useState('');
	const [isGenerate, setIsGenerate] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
			return;
		}
		setOpen(false);
	};

	const handleGenerateCongPIN = () => {
		setIsGenerate(true);
		if (apiHost !== '') {
			fetch(`${apiHost}api/congregation/generate-id`, {
				signal: abortCont.signal,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					uid: uidUser,
				},
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						setCongTempID(data.message);
					} else {
						let warnMsg;
						if (data.message === 'FORBIDDEN') {
							warnMsg = t('administration.warnForbidden');
						} else {
							warnMsg = t('global.errorTryAgain');
						}
						setAppMessage(warnMsg);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
					setIsGenerate(false);
				})
				.catch((err) => {
					setIsGenerate(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	};

	const handleCreateCongAccount = async () => {
		setIsProcessing(true);
		setIsDisabled(true);

		const reqPayload = {
			cong_id: congTempID,
			cong_password: congTempPassword,
			cong_name: congName,
			cong_number: congNumber,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/congregation/create-account`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					uid: uidUser,
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						await dbUpdateAppSettings({
							cong_id: congTempID,
						});
						setCongID(congTempID);
						setCongPassword(congTempPassword);
						setIsConnected(true);
						setAppMessage(
							t('administration.congregationConnected', {
								congregation: `${congName} (${congNumber})`,
							})
						);
						setAppSeverity('success');
						setAppSnackOpen(true);
						handleClose();
					} else {
						let warnMsg;
						if (data.message === 'FORBIDDEN') {
							warnMsg = t('administration.warnForbidden');
						} else {
							warnMsg = t('global.errorTryAgain');
						}
						setAppMessage(warnMsg);
						setAppSeverity('warning');
						setAppSnackOpen(true);
						setIsProcessing(false);
						setIsDisabled(false);
					}
				})
				.catch((err) => {
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
					setIsProcessing(false);
					setIsDisabled(false);
				});
		}
	};

	const handleSignInCong = async () => {
		setIsProcessing(true);
		setIsDisabled(true);

		const reqPayload = {
			cong_id: congTempID,
			cong_password: congTempPassword,
			cong_name: congName,
			cong_number: congNumber,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/congregation/signin`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					uid: uidUser,
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						await dbUpdateAppSettings({
							cong_id: congTempID,
						});
						setCongID(congTempID);
						setCongPassword(congTempPassword);
						setIsConnected(true);
						setAppMessage(
							t('administration.congregationConnected', {
								congregation: `${congName} (${congNumber})`,
							})
						);
						setAppSeverity('success');
						setAppSnackOpen(true);
						handleClose();
					} else {
						let warnMsg;
						if (data.message === 'FORBIDDEN') {
							warnMsg = t('administration.incorrectLogin');
						} else {
							warnMsg = t('global.errorTryAgain');
						}
						setAppMessage(warnMsg);
						setAppSeverity('warning');
						setAppSnackOpen(true);
						setIsProcessing(false);
						setIsDisabled(false);
					}
				})
				.catch((err) => {
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
					setIsProcessing(false);
					setIsDisabled(false);
				});
		}
	};

	const handleSaveCongAccount = async () => {
		setIsProcessing(true);
		setIsDisabled(true);

		const reqPayload = {
			cong_id: congTempID,
			cong_password_old: congTempOldPwd,
			cong_password_new: congTempPassword,
			cong_name: congName,
			cong_number: congNumber,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/congregation/change-password`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					uid: uidUser,
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						setCongPassword(congTempPassword);
						setIsConnected(true);
						setAppMessage(t('administration.congregationPwdChanged'));
						setAppSeverity('success');
						setAppSnackOpen(true);
						handleClose();
					} else {
						let warnMsg;
						if (data.message === 'FORBIDDEN') {
							warnMsg = t('administration.incorrectLogin');
						} else {
							warnMsg = t('global.errorTryAgain');
						}
						setAppMessage(warnMsg);
						setAppSeverity('warning');
						setAppSnackOpen(true);
						setIsProcessing(false);
						setIsDisabled(false);
					}
				})
				.catch((err) => {
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
					setIsProcessing(false);
					setIsDisabled(false);
				});
		}
	};

	const handleDialogActions = () => {
		if (isCongCreateAccount) {
			handleCreateCongAccount();
		} else if (isCongSignIn) {
			handleSignInCong();
		} else if (isCongUpdateAccount) {
			handleSaveCongAccount();
		}
	};

	useEffect(() => {
		if (isCongSignIn) {
			if (congTempPassword.length < 8 || congTempID.length < 10) {
				setIsDisabled(true);
			} else {
				setIsDisabled(false);
			}
		}
	}, [isCongSignIn, congTempPassword, congTempID]);

	useEffect(() => {
		if (isCongCreateAccount) {
			if (
				congTempPassword.length < 8 ||
				congTempConfirmPwd.length < 8 ||
				congTempID.length < 10
			) {
				setIsDisabled(true);
			} else {
				if (congTempPassword === congTempConfirmPwd) {
					setIsDisabled(false);
				} else {
					setIsDisabled(true);
				}
			}
		}
	}, [isCongCreateAccount, congTempPassword, congTempConfirmPwd, congTempID]);

	useEffect(() => {
		if (isCongUpdateAccount) {
			if (
				congTempPassword.length < 8 ||
				congTempConfirmPwd.length < 8 ||
				congTempOldPwd.length < 8
			) {
				setIsDisabled(true);
			} else {
				if (congTempPassword === congTempConfirmPwd) {
					setIsDisabled(false);
				} else {
					setIsDisabled(true);
				}
			}
		}
	}, [
		isCongUpdateAccount,
		congTempPassword,
		congTempConfirmPwd,
		congTempOldPwd,
	]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle
					id='alert-dialog-title-login-congregation'
					sx={{
						padding: 0,
						position: 'absolute',
						right: 0,
					}}
				>
					<IconButton
						color='inherit'
						edge='start'
						sx={{ marginRight: '8px' }}
						onClick={handleClose}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{
						padding: '10px',
						marginTop: '15px',
						width: `${isCongCreateAccount ? '300px' : '250px'}`,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							marginBottom: '15px',
						}}
					>
						<img
							src='/img/appLogo.png'
							alt='App logo'
							className='appLogoMini'
						/>
						<Typography
							sx={{
								fontWeight: 'bold',
								marginTop: '5px',
							}}
						>
							LMM-OA
						</Typography>
					</Box>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
						}}
					>
						<Box>
							<TextField
								label={t('administration.congregationId')}
								variant='outlined'
								type='number'
								size='small'
								sx={{
									width: '220px',
									marginRight: '13px',
									marginBottom: '15px',
								}}
								value={congTempID}
								onChange={(e) => setCongTempID(e.target.value)}
								InputProps={{
									readOnly: isCongSignIn ? false : true,
								}}
							/>
							{isGenerate && (
								<CircularProgress
									disableShrink
									color='secondary'
									size={'30px'}
									sx={{
										marginRight: '8px',
										marginTop: '3px',
									}}
								/>
							)}
							{!isGenerate && isCongCreateAccount && (
								<Tooltip title={t('administration.generateCongID')}>
									<IconButton
										color='inherit'
										edge='start'
										sx={{
											marginRight: '5px',
										}}
										onClick={handleGenerateCongPIN}
									>
										<FlashAutoIcon />
									</IconButton>
								</Tooltip>
							)}
							{isCongUpdateAccount && (
								<TextField
									label={t('administration.congregationOldPassphrase')}
									variant='outlined'
									size='small'
									type='password'
									sx={{
										width: '220px',
										marginBottom: '15px',
									}}
									value={congTempOldPwd}
									onChange={(e) => setCongTempOldPwd(e.target.value)}
								/>
							)}
							<TextField
								label={
									isCongUpdateAccount
										? t('administration.congregationNewPassphrase')
										: t('administration.congregationPassphrase')
								}
								variant='outlined'
								size='small'
								type='password'
								sx={{
									width: '220px',
									marginBottom: '15px',
								}}
								value={congTempPassword}
								onChange={(e) => setCongTempPassword(e.target.value)}
							/>
							{!isCongSignIn && (
								<TextField
									label={t('administration.congregationConfirmPassphrase')}
									variant='outlined'
									size='small'
									type='password'
									sx={{
										width: '220px',
										marginBottom: '10px',
									}}
									value={congTempConfirmPwd}
									onChange={(e) => setCongTempConfirmPwd(e.target.value)}
								/>
							)}
						</Box>
					</Box>
					{isProcessing && (
						<Container
							sx={{
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<CircularProgress disableShrink color='secondary' size={'40px'} />
						</Container>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						{t('global.cancel')}
					</Button>
					<Button
						id='btn-action'
						onClick={handleDialogActions}
						color='primary'
						autoFocus
						disabled={isDisabled}
					>
						{isCongCreateAccount
							? t('administration.createCongregationAccount')
							: isCongSignIn
							? t('administration.signInCongregationAccount')
							: isCongUpdateAccount
							? t('global.save')
							: null}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default CongregationLogin;
