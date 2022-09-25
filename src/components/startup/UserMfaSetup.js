import { useEffect, useMemo, useState } from 'react';
import { Markup } from 'interweave';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import QRCode from 'qrcode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import StartupHeader from './StartupHeader';
import { runUpdater } from '../../utils/updater';
import { encryptString } from '../../utils/sws-encryption';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	apiHostState,
	isAppLoadState,
	isCongAccountCreateState,
	isSetupState,
	isUnauthorizedRoleState,
	isUserMfaSetupState,
	qrCodePathState,
	secretTokenPathState,
	userEmailState,
	userIDState,
	userPasswordState,
	visitorIDState,
	startupProgressState,
} from '../../appStates/appSettings';
import {
	congAccountConnectedState,
	congIDState,
	isAdminCongState,
	offlineOverrideState,
} from '../../appStates/appCongregation';
import { loadApp } from '../../utils/app';
import { initAppDb, isDbExist } from '../../indexedDb/dbUtility';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';

const UserMfaSetup = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [isProcessing, setIsProcessing] = useState(false);
	const [hasErrorOTP, setHasErrorOTP] = useState(false);
	const [userOTP, setUserOTP] = useState('');

	const [imgPath, setImgPath] = useState('');
	const [isNoQR, setIsNoQR] = useState(false);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setIsCongAccountCreate = useSetRecoilState(isCongAccountCreateState);
	const setIsUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
	const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
	const setIsSetup = useSetRecoilState(isSetupState);
	const setIsAppLoad = useSetRecoilState(isAppLoadState);
	const setStartupProgress = useSetRecoilState(startupProgressState);
	const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
	const setOfflineOverride = useSetRecoilState(offlineOverrideState);
	const setIsAdminCong = useSetRecoilState(isAdminCongState);
	const setCongID = useSetRecoilState(congIDState);
	const setUserID = useSetRecoilState(userIDState);

	const apiHost = useRecoilValue(apiHostState);
	const qrCodePath = useRecoilValue(qrCodePathState);
	const token = useRecoilValue(secretTokenPathState);
	const userEmail = useRecoilValue(userEmailState);
	const visitorID = useRecoilValue(visitorIDState);
	const userPwd = useRecoilValue(userPasswordState);

	const handleCopyClipboard = async (text) => {
		await navigator.clipboard.writeText(text);
	};

	const handleVerifyOTP = async () => {
		try {
			setHasErrorOTP(false);

			if (userOTP.length === 6) {
				setIsProcessing(true);
				const reqPayload = {
					token: userOTP,
				};

				if (apiHost !== '') {
					const res = await fetch(`${apiHost}api/mfa/verify-token`, {
						signal: abortCont.signal,
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
						body: JSON.stringify(reqPayload),
					});

					const data = await res.json();
					if (res.status === 200) {
						const { id, cong_id, cong_name, cong_role, cong_number } = data;

						if (cong_name.length > 0) {
							if (cong_role.length > 0) {
								// role admin
								if (cong_role.includes('admin')) {
									setIsAdminCong(true);
								}

								// role approved
								if (
									cong_role.includes('lmmo') ||
									cong_role.includes('lmmo-backup')
								) {
									setCongID(cong_id);

									const isMainDb = await isDbExist('lmm_oa');
									if (!isMainDb) {
										await initAppDb();
									}

									// encrypt email & pwd
									const encPwd = await encryptString(
										userPwd,
										JSON.stringify({ email: userEmail, pwd: userPwd })
									);

									// save congregation update if any
									let obj = {};
									obj.username = data.username;
									obj.isCongVerified = true;
									obj.cong_name = cong_name;
									obj.cong_number = cong_number;
									obj.userPass = encPwd;
									obj.isLoggedOut = false;
									await dbUpdateAppSettings(obj);

									setUserID(id);

									await loadApp();

									setIsSetup(false);

									await runUpdater();
									setTimeout(() => {
										setStartupProgress(0);
										setOfflineOverride(false);
										setCongAccountConnected(true);
										setIsAppLoad(false);
									}, [2000]);
								}
								return;
							}

							setIsProcessing(false);
							setIsUserMfaSetup(false);
							setIsUnauthorizedRole(true);
							return;
						}

						// congregation not assigned
						setIsProcessing(false);
						setIsUserMfaSetup(false);
						setIsCongAccountCreate(true);
					} else {
						setIsProcessing(false);
						setAppMessage(data.message);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
				}
			} else {
				setHasErrorOTP(true);
			}
		} catch (err) {
			setIsProcessing(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
		}
	};

	useEffect(() => {
		const getQrCode = async () => {
			QRCode.toDataURL(qrCodePath, function (err, data_url) {
				if (err) {
					return;
				}

				setImgPath(data_url);
			});
		};

		if (qrCodePath.length > 0) {
			getQrCode();
		}
	}, [qrCodePath]);

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
							marginBottom: '10px',
						}}
					>
						<Markup
							content={
								isNoQR ? t('login.mfaSetupToken') : t('login.mfaSetupQr')
							}
						/>
					</Typography>
				</Box>
			</Box>

			{isNoQR && (
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-end',
						marginBottom: '10px',
					}}
				>
					<TextField
						id='outlined-token'
						label='Token'
						variant='outlined'
						size='small'
						autoComplete='off'
						value={token}
						multiline
						sx={{ width: '100%', marginTop: '10px' }}
						InputProps={{
							readOnly: true,
						}}
					/>
					<IconButton
						aria-label='copy'
						onClick={() => handleCopyClipboard(token)}
					>
						<ContentCopyIcon />
					</IconButton>
				</Box>
			)}

			{!isNoQR && (
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					{imgPath.length > 0 && (
						<img className='qrcode' src={imgPath} alt='QR Code 2FA' />
					)}
				</Box>
			)}

			<Typography
				sx={{ fontSize: '14px', marginBottom: '15px', marginTop: '10px' }}
			>
				{t('login.setupTextOTP')}
			</Typography>

			<Box sx={{ width: '100%' }}>
				<TextField
					id='outlined-otp'
					type='number'
					label={t('login.labelOTP')}
					variant='outlined'
					size='small'
					autoComplete='off'
					required
					value={userOTP}
					onChange={(e) => setUserOTP(e.target.value)}
					error={hasErrorOTP ? true : false}
					sx={{ width: '100%' }}
				/>
			</Box>

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
					onClick={() => setIsNoQR(!isNoQR)}
				>
					{isNoQR ? t('login.scanQR') : t('login.copyToken')}
				</Link>
				<Button
					variant='contained'
					onClick={handleVerifyOTP}
					disabled={isProcessing || visitorID.length === 0}
				>
					{t('login.mfaVerify')}
				</Button>
			</Box>
		</StartupHeader>
	);
};

export default UserMfaSetup;
