import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import UAParser from 'ua-parser-js';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import StorageIcon from '@mui/icons-material/Storage';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	apiHostState,
	backupEncryptedState,
	backupJsonDataState,
	isBackupDbOpenState,
	isBackupOfflineState,
	isBackupOnlineState,
	isRestoreOfflineState,
	isRestoreOnlineState,
	uidUserState,
} from '../../appStates/appSettings';
import { dbExportDb, dbExportJsonDb } from '../../indexedDb/dbUtility';

const DialogDbBackup = () => {
	let history = useHistory();
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [isDisabled, setIsDisabled] = useState(true);
	const [dateFormat, setDateFormat] = useState('');
	const [backupCreatePwd, setBackupCreatePwd] = useState('');
	const [backupConfirmPwd, setBackupConfirmPwd] = useState('');
	const [backupNewDevice, setBackupNewDevice] = useState('');
	const [isLoadingBackup, setIsLoadingBackup] = useState(true);
	const [hasBackup, setHasBackup] = useState(false);
	const [backupData, setBackupData] = useState('');
	const [backupType, setBackupType] = useState('');
	const [backupDate, setBackupDate] = useState('');
	const [backupDevice, setBackupDevice] = useState('');

	const [open, setOpen] = useRecoilState(isBackupDbOpenState);

	const isBackupOffline = useRecoilValue(isBackupOfflineState);
	const isBackupOnline = useRecoilValue(isBackupOnlineState);
	const isRestoreOffline = useRecoilValue(isRestoreOfflineState);
	const isRestoreOnline = useRecoilValue(isRestoreOnlineState);
	const apiHost = useRecoilValue(apiHostState);
	const uid = useRecoilValue(uidUserState);
	const fileBackup = useRecoilValue(backupEncryptedState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setJsonData = useSetRecoilState(backupJsonDataState);

	const handleClose = useCallback(
		(event, reason) => {
			if (reason === 'clickaway' || reason === 'backdropClick') {
				return;
			}
			setOpen(false);
		},
		[setOpen]
	);

	const offlineBackupDb = async () => {
		setIsLoadingBackup(true);
		setIsDisabled(true);

		dbExportDb(backupConfirmPwd)
			.then(() => {
				setAppSnackOpen(true);
				setAppSeverity('success');
				setAppMessage(t('settings.backupSuccess'));
				setBackupCreatePwd('');
				setBackupConfirmPwd('');
				handleClose();
			})
			.catch(() => {
				setAppSnackOpen(true);
				setAppSeverity('error');
				setAppMessage(t('settings.backupError'));
				setBackupCreatePwd('');
				setBackupConfirmPwd('');
				handleClose();
			});
	};

	const onlineBackup = () => {
		setIsLoadingBackup(true);
		setBackupCreatePwd('');
		setBackupConfirmPwd('');
		dbExportJsonDb(backupConfirmPwd)
			.then((data) => {
				fetch(`${apiHost}api/user/send-backup`, {
					signal: abortCont.signal,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						uid: uid,
					},
					body: JSON.stringify({
						backup_type: 'lmmoa',
						backup_data: data,
						backup_date: new Date().getTime(),
						backup_device: backupNewDevice,
					}),
				})
					.then((result) => {
						if (result.status === 200) {
							setAppSnackOpen(true);
							setAppSeverity('success');
							setAppMessage(t('settings.backupSuccess'));
						} else {
							setAppSnackOpen(true);
							setAppSeverity('error');
							setAppMessage(t('settings.backupError'));
						}
						handleClose();
					})
					.catch(() => {
						setAppSnackOpen(true);
						setAppSeverity('error');
						setAppMessage(t('settings.backupError'));
						handleClose();
					});
			})
			.catch(() => {
				setAppSnackOpen(true);
				setAppSeverity('error');
				setAppMessage(t('settings.backupError'));
				handleClose();
			});
	};

	const offlineRestoreDb = async () => {
		setIsLoadingBackup(true);
		setIsDisabled(true);

		const getEncryptedText = () => {
			return new Promise((resolve, reject) => {
				let reader = new FileReader();
				reader.readAsText(fileBackup);
				reader.onloadend = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});
		};

		const backupData = await getEncryptedText();

		try {
			const Cryptr = require('cryptr');
			const cryptr = new Cryptr(backupConfirmPwd);
			const decryptedData = cryptr.decrypt(backupData);
			fetch(decryptedData)
				.then((res) => res.blob())
				.then((blob) => {
					setJsonData(blob);
					history.push('/DBRestore');
					handleClose();
				});
		} catch (error) {
			if (
				error.message === 'Unsupported state or unable to authenticate data'
			) {
				setAppSnackOpen(true);
				setAppSeverity('error');
				setAppMessage(t('settings.backupRestoreInvalidPassword'));
			} else {
				setAppSnackOpen(true);
				setAppSeverity('error');
				setAppMessage(t('settings.backupRestoreError'));
			}
			handleClose();
		}
	};

	const onlineRestoreDb = async () => {
		setIsLoadingBackup(true);
		setIsDisabled(true);

		try {
			const Cryptr = require('cryptr');
			const cryptr = new Cryptr(backupConfirmPwd);
			const decryptedData = cryptr.decrypt(backupData);
			fetch(decryptedData)
				.then((res) => res.blob())
				.then((blob) => {
					setJsonData(blob);
					history.push('/DBRestore');
					handleClose();
				});
		} catch (error) {
			if (
				error.message === 'Unsupported state or unable to authenticate data'
			) {
				setAppSnackOpen(true);
				setAppSeverity('error');
				setAppMessage(t('settings.backupRestoreInvalidPassword'));
			} else {
				setAppSnackOpen(true);
				setAppSeverity('error');
				setAppMessage(t('settings.backupRestoreError'));
			}
			handleClose();
		}
	};

	const handleDialogActions = () => {
		if (isBackupOffline) {
			offlineBackupDb();
		} else if (isBackupOnline) {
			onlineBackup();
		} else if (isRestoreOffline) {
			offlineRestoreDb();
		} else if (isRestoreOnline) {
			onlineRestoreDb();
		}
	};

	useEffect(() => {
		if (backupDate !== '') {
			var timestamp = backupDate;
			var date = new Date(timestamp);
			setDateFormat(
				date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
			);
		}
	}, [backupDate]);

	useEffect(() => {
		if (isBackupOffline || isBackupOnline) {
			if (backupCreatePwd.length === 0 && backupConfirmPwd.length === 0) {
				setIsDisabled(true);
			} else {
				if (backupCreatePwd === backupConfirmPwd) {
					setIsDisabled(false);
				} else {
					setIsDisabled(true);
				}
			}
		}
	}, [isBackupOffline, isBackupOnline, backupCreatePwd, backupConfirmPwd]);

	useEffect(() => {
		if (isBackupOffline) {
			setIsLoadingBackup(false);
		}
	}, [isBackupOffline]);

	useEffect(() => {
		if (isRestoreOffline) {
			setIsLoadingBackup(false);
			if (backupConfirmPwd.length === 0) {
				setIsDisabled(true);
			} else {
				setIsDisabled(false);
			}
		}
	}, [isRestoreOffline, backupConfirmPwd]);

	useEffect(() => {
		if (isBackupOnline && open) {
			// Retrieve online backup if any
			const getOnlineBackup = async () => {
				if (apiHost !== '') {
					try {
						const result = await fetch(`${apiHost}api/user/get-backup`, {
							signal: abortCont.signal,
							method: 'GET',
							headers: {
								uid: uid,
							},
						});

						if (result.status === 200) {
							const data = await result.json();
							setBackupDevice(data.message.backup_device);
							setBackupDate(data.message.backup_date);
							setHasBackup(true);
						} else if (result.status === 404) {
							setHasBackup(false);
						} else {
							setAppSnackOpen(true);
							setAppSeverity('error');
							setAppMessage(t('settings.backupRetrieveFailed'));
							handleClose();
						}
					} catch {
						setAppSnackOpen(true);
						setAppSeverity('error');
						setAppMessage(t('settings.backupRetrieveFailed'));
						handleClose();
					}
				}
				setIsLoadingBackup(false);
			};

			setIsLoadingBackup(true);
			setIsDisabled(true);
			setBackupType('backup');
			const parser = new UAParser();
			const ua = parser.getResult();
			setBackupNewDevice(
				ua.os.name +
					' ' +
					ua.os.version +
					'|' +
					ua.browser.name +
					' ' +
					ua.browser.version
			);
			// Retrieve online backup if any
			getOnlineBackup();
		}

		return () => abortCont.abort();
	}, [
		isBackupOnline,
		open,
		apiHost,
		uid,
		handleClose,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		t,
		abortCont,
	]);

	useEffect(() => {
		if (isRestoreOnline && open) {
			// Retrieve online backup if any
			const getOnlineBackup = async () => {
				if (apiHost !== '') {
					try {
						const result = await fetch(`${apiHost}api/user/get-backup`, {
							signal: abortCont.signal,
							method: 'GET',
							headers: {
								uid: uid,
							},
						});

						if (result.status === 200) {
							const data = await result.json();
							setBackupData(data.message.backup_data);
							setBackupDevice(data.message.backup_device);
							setBackupDate(data.message.backup_date);
							setHasBackup(true);
							setBackupType('restore');
						} else if (result.status === 404) {
							setAppSnackOpen(true);
							setAppSeverity('info');
							setAppMessage(t('settings.backupOnlineNone'));
							handleClose();
						} else {
							setAppSnackOpen(true);
							setAppSeverity('error');
							setAppMessage(t('settings.backupRetrieveFailed'));
							handleClose();
						}
					} catch {
						setAppSnackOpen(true);
						setAppSeverity('error');
						setAppMessage(t('settings.backupRetrieveFailed'));
						handleClose();
					}
				}
				setIsLoadingBackup(false);
			};

			setIsLoadingBackup(true);
			setIsDisabled(true);

			// Retrieve online backup if any
			getOnlineBackup();
		}

		return () => abortCont.abort();
	}, [
		isRestoreOnline,
		open,
		apiHost,
		uid,
		handleClose,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		t,
		abortCont,
	]);

	useEffect(() => {
		if (isRestoreOnline) {
			if (backupConfirmPwd.length === 0) {
				setIsDisabled(true);
			} else {
				setIsDisabled(false);
			}
		}
	}, [isRestoreOnline, backupConfirmPwd]);

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
				<DialogTitle id='alert-dialog-title'>
					{t('settings.backup')}
				</DialogTitle>
				<DialogContent>
					<>
						{isBackupOffline && (
							<>
								{isLoadingBackup && (
									<CircularProgress
										color='secondary'
										size={80}
										disableShrink={true}
										sx={{
											display: 'flex',
											margin: '10px auto',
										}}
									/>
								)}
								{!isLoadingBackup && (
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
										}}
									>
										<Typography
											sx={{
												marginBottom: '15px',
											}}
										>
											{t('settings.createPassword')}
										</Typography>
										<TextField
											id='backup-password-outlined'
											type='password'
											label={t('login.password')}
											variant='outlined'
											size='small'
											autoComplete='off'
											required
											sx={{
												width: '250px',
												marginBottom: '15px',
											}}
											value={backupCreatePwd}
											onChange={(e) => setBackupCreatePwd(e.target.value)}
										/>
										<TextField
											id='backup-confirm-password-outlined'
											type='password'
											label={t('login.confirmPassword')}
											variant='outlined'
											size='small'
											autoComplete='off'
											required
											sx={{
												width: '250px',
												marginBottom: '15px',
											}}
											value={backupConfirmPwd}
											onChange={(e) => setBackupConfirmPwd(e.target.value)}
										/>
									</Box>
								)}
							</>
						)}
						{isRestoreOffline && (
							<>
								{isLoadingBackup && (
									<CircularProgress
										color='secondary'
										size={80}
										disableShrink={true}
										sx={{
											display: 'flex',
											margin: '10px auto',
										}}
									/>
								)}
								{!isLoadingBackup && (
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
										}}
									>
										<Typography
											sx={{
												marginBottom: '15px',
											}}
										>
											{t('settings.restoreIntro')}
										</Typography>
										<TextField
											id='backup-restore-password-outlined'
											type='password'
											label={t('global.password')}
											variant='outlined'
											size='small'
											autoComplete='off'
											required
											sx={{
												width: '250px',
												marginBottom: '15px',
											}}
											value={backupConfirmPwd}
											onChange={(e) => setBackupConfirmPwd(e.target.value)}
										/>
									</Box>
								)}
							</>
						)}
						{isLoadingBackup && (isBackupOnline || isRestoreOnline) && (
							<CircularProgress
								color='secondary'
								size={80}
								disableShrink={true}
								sx={{
									display: 'flex',
									margin: '10px auto',
								}}
							/>
						)}
						{!isLoadingBackup && (isBackupOnline || isRestoreOnline) && (
							<>
								{backupType === 'backup' && (
									<>
										{hasBackup && (
											<>
												<Typography gutterBottom>
													{t('settings.backupOnlineSendUpdate')}
												</Typography>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															flexDirection: 'column',
														}}
													>
														<Typography
															sx={{ fontWeight: 'bold' }}
															align='center'
														>
															{t('settings.backupNew')}
														</Typography>
														<StorageIcon
															sx={{ fontSize: '72px' }}
															color='primary'
														/>
														<Typography align='center'>
															{backupNewDevice.split('|')[0]}
														</Typography>
														<Typography
															sx={{ fontSize: '11px' }}
															align='center'
														>
															{backupNewDevice.split('|')[1]}
														</Typography>
													</Box>
													<Box
														sx={{
															width: '100px',
															display: 'flex',
															justifyContent: 'space-around',
														}}
													>
														<ArrowForwardIcon fontSize='large' />
													</Box>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															flexDirection: 'column',
														}}
													>
														<Typography
															sx={{ fontWeight: 'bold' }}
															align='center'
														>
															{t('settings.backupOld')}
														</Typography>
														<StorageIcon
															sx={{ fontSize: '72px' }}
															color='error'
														/>
														<Typography align='center'>
															{backupDevice.split('|')[0]}
														</Typography>
														<Typography
															sx={{ fontSize: '11px' }}
															align='center'
														>
															{backupDevice.split('|')[1]}
														</Typography>
														<Typography
															sx={{ fontSize: '11px' }}
															align='center'
														>
															{dateFormat}
														</Typography>
													</Box>
												</Box>
											</>
										)}
										{!hasBackup && (
											<>
												<Typography gutterBottom>
													{t('settings.backupOnlineSendNew')}
												</Typography>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														flexDirection: 'column',
													}}
												>
													<StorageIcon
														sx={{ fontSize: '72px' }}
														color='primary'
													/>
													<Typography align='center'>
														{backupNewDevice.split('|')[0]}
													</Typography>
													<Typography sx={{ fontSize: '11px' }} align='center'>
														{backupNewDevice.split('|')[1]}
													</Typography>
												</Box>
											</>
										)}
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												marginTop: '10px',
											}}
										>
											<Typography
												sx={{
													marginBottom: '15px',
												}}
											>
												{t('settings.createPassword')}
											</Typography>
											<TextField
												id='backup-online-password-outlined'
												type='password'
												label={t('login.password')}
												variant='outlined'
												size='small'
												autoComplete='off'
												required
												sx={{
													width: '250px',
													marginBottom: '15px',
												}}
												value={backupCreatePwd}
												onChange={(e) => setBackupCreatePwd(e.target.value)}
											/>
											<TextField
												id='backup-online-confirm-password-outlined'
												type='password'
												label={t('login.confirmPassword')}
												variant='outlined'
												size='small'
												autoComplete='off'
												required
												sx={{
													width: '250px',
													marginBottom: '15px',
												}}
												value={backupConfirmPwd}
												onChange={(e) => setBackupConfirmPwd(e.target.value)}
											/>
										</Box>
									</>
								)}
								{backupType === 'restore' && (
									<>
										<Typography>{t('settings.restoreOnlineIntro')}</Typography>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												flexDirection: 'column',
											}}
										>
											<StorageIcon sx={{ fontSize: '72px' }} color='success' />
											<Typography align='center'>
												{backupDevice.split('|')[0]}
											</Typography>
											<Typography sx={{ fontSize: '11px' }} align='center'>
												{backupDevice.split('|')[1]}
											</Typography>
											<Typography sx={{ fontSize: '11px' }} align='center'>
												{dateFormat}
											</Typography>
										</Box>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												marginTop: '10px',
											}}
										>
											<Typography
												sx={{
													marginBottom: '15px',
												}}
											>
												{t('settings.restoreIntro')}
											</Typography>
											<TextField
												id='backup-restore-password-outlined'
												type='password'
												label={t('global.password')}
												variant='outlined'
												size='small'
												autoComplete='off'
												required
												sx={{
													width: '250px',
													marginBottom: '15px',
												}}
												value={backupConfirmPwd}
												onChange={(e) => setBackupConfirmPwd(e.target.value)}
											/>
										</Box>
									</>
								)}
							</>
						)}
					</>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						{t('global.cancel')}
					</Button>
					<Button
						onClick={handleDialogActions}
						disabled={isDisabled}
						color='primary'
						autoFocus
					>
						{t('global.continue')}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DialogDbBackup;
