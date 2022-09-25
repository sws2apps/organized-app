import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { congIDState } from '../../appStates/appCongregation';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	currentScheduleState,
	isPublishOpenState,
} from '../../appStates/appSchedule';
import {
	apiHostState,
	userEmailState,
	visitorIDState,
} from '../../appStates/appSettings';
import { dbBuildScheduleForShare } from '../../indexedDb/dbSchedule';

const SchedulePublish = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [open, setOpen] = useRecoilState(isPublishOpenState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const visitorID = useRecoilValue(visitorIDState);
	const userEmail = useRecoilValue(userEmailState);
	const apiHost = useRecoilValue(apiHostState);
	const currentSchedule = useRecoilValue(currentScheduleState);
	const congID = useRecoilValue(congIDState);

	const handleClose = useCallback(
		(event, reason) => {
			if (reason === 'clickaway' || reason === 'backdropClick') {
				return;
			}
			setOpen(false);
		},
		[setOpen]
	);

	const publishSchedulePocket = useCallback(async () => {
		try {
			const dataPocket = await dbBuildScheduleForShare(currentSchedule);
			const { cong_schedule, cong_sourceMaterial } = dataPocket;

			if (apiHost !== '') {
				const res = await fetch(
					`${apiHost}api/congregations/${congID}/schedule`,
					{
						signal: abortCont.signal,
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
						body: JSON.stringify({ cong_schedule, cong_sourceMaterial }),
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					setAppMessage(t('schedule.publishSuccess'));
					setAppSeverity('success');
					setAppSnackOpen(true);
					handleClose(false);

					return;
				}

				setAppMessage(data.message);
				setAppSeverity('warning');
				setAppSnackOpen(true);
				handleClose(false);
			}
		} catch (err) {
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
			handleClose();
		}
	}, [
		abortCont,
		apiHost,
		congID,
		currentSchedule,
		handleClose,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		t,
		userEmail,
		visitorID,
	]);

	useEffect(() => {
		publishSchedulePocket();
	}, [publishSchedulePocket]);

	return (
		<div>
			<Dialog
				open={open}
				aria-labelledby='dialog-title-publish'
				onClose={handleClose}
			>
				<DialogTitle id='dialog-title-publish'>
					<Typography variant='h6' component='p'>
						{t('schedule.publishPocket')}
					</Typography>
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
		</div>
	);
};

export default SchedulePublish;
