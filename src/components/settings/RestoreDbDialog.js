import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { congIDState } from '../../appStates/appCongregation';
import {
	apiHostState,
	restoreDbOpenState,
	shortDateFormatState,
	userEmailState,
	visitorIDState,
} from '../../appStates/appSettings';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import { dbRestoreCongregationBackup } from '../../indexedDb/dbUtility';

const RestoreDbDialog = () => {
	let abortCont = useMemo(() => new AbortController(), []);
	const { t } = useTranslation();

	const [open, setOpen] = useRecoilState(restoreDbOpenState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const userEmail = useRecoilValue(userEmailState);
	const congID = useRecoilValue(congIDState);
	const shortDateFormat = useRecoilValue(shortDateFormatState);

	const [isProcessing, setIsProcessing] = useState(true);
	const [hasBackup, setHasBackup] = useState(false);
	const [backup, setBackup] = useState({});

	const handleClose = useCallback(
		(event, reason) => {
			if (reason === 'clickaway' || reason === 'backdropClick') {
				return;
			}
			setOpen(false);
		},
		[setOpen]
	);

	const fetchLastBackup = useCallback(async () => {
		try {
			if (apiHost !== '') {
				setIsProcessing(true);
				const res = await fetch(
					`${apiHost}api/congregations/${congID}/backup/last`,
					{
						signal: abortCont.signal,
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					if (data.message) {
						setHasBackup(false);
						setIsProcessing(false);
					} else {
						setBackup(data);
						setHasBackup(true);
						setIsProcessing(false);
					}

					return;
				}

				setIsProcessing(false);
				setAppMessage(data.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
				setOpen(false);
			}
		} catch (err) {
			setIsProcessing(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
			setOpen(false);
		}
	}, [
		abortCont,
		apiHost,
		congID,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		setOpen,
		userEmail,
		visitorID,
	]);

	const restoreBackup = async () => {
		try {
			if (apiHost !== '') {
				setIsProcessing(true);
				const res = await fetch(
					`${apiHost}api/congregations/${congID}/backup`,
					{
						signal: abortCont.signal,
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					const {
						cong_persons,
						cong_schedule,
						cong_sourceMaterial,
						cong_swsPocket,
					} = data;

					await dbRestoreCongregationBackup(
						cong_persons,
						cong_schedule,
						cong_sourceMaterial,
						cong_swsPocket
					);

					window.location.reload();
					return;
				}

				setIsProcessing(false);
				setAppMessage(data.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
				setOpen(false);
			}
		} catch (err) {
			setIsProcessing(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
			setOpen(false);
		}
	};

	useEffect(() => {
		fetchLastBackup();
	}, [fetchLastBackup]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>
					{t('settings.restoreBackup')}
				</DialogTitle>
				<DialogContent>
					{isProcessing && (
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
					{!isProcessing && (
						<>
							{hasBackup && (
								<Typography>
									{t('settings.restoreConfirmation', {
										backup_person: backup.by,
										backup_date: dateFormat(
											new Date(backup.date),
											shortDateFormat
										),
									})}
								</Typography>
							)}
							{!hasBackup && (
								<Typography>{t('settings.noBackupFound')}</Typography>
							)}
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						{t('global.cancel')}
					</Button>
					<Button
						onClick={restoreBackup}
						disabled={isProcessing}
						color='primary'
					>
						{t('global.restore')}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default RestoreDbDialog;
