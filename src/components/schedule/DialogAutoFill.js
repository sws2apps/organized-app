import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import {
	currentScheduleState,
	dlgAutoFillOpenState,
	isAutoFillSchedState,
	isDlgActionOpenState,
	schedActionTypeState,
} from '../../appStates/appSchedule';
import { monthNamesState } from '../../appStates/appSettings';

const DialogAutoFill = () => {
	const { t } = useTranslation();

	const [scheduleName, setScheduleName] = useState('');

	const [dlgAutoFillOpen, setDlgAutoFillOpen] =
		useRecoilState(dlgAutoFillOpenState);

	const setIsAutoFill = useSetRecoilState(isAutoFillSchedState);
	const setIsDlgActionOpen = useSetRecoilState(isDlgActionOpenState);
	const setActionType = useSetRecoilState(schedActionTypeState);

	const currentSchedule = useRecoilValue(currentScheduleState);
	const monthNames = useRecoilValue(monthNamesState);

	const handleAutoFill = () => {
		setActionType('AutoFill');
		setIsAutoFill(true);
		setIsDlgActionOpen(true);
		setDlgAutoFillOpen(false);
	};

	const handleClose = () => {
		setDlgAutoFillOpen(false);
	};

	useEffect(() => {
		if (currentSchedule !== '') {
			const sched = currentSchedule;
			const month = sched.split('/')[0];
			const year = sched.split('/')[1];

			const monthName = monthNames[+month - 1];

			const str = monthName + ' ' + year;
			setScheduleName(str);
		}
	}, [currentSchedule, monthNames]);

	return (
		<Dialog
			open={dlgAutoFillOpen}
			aria-labelledby='dialog-title-autoFill'
			onClose={handleClose}
		>
			<DialogTitle id='dialog-title-autoFill'>
				<Typography variant='h6' component='p'>
					{t('schedule.autoFillTitle')}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Typography>
					{t('schedule.autoFillDesc', { currentSchedule: scheduleName })}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleAutoFill} color='primary'>
					{t('global.yes')}
				</Button>
				<Button onClick={handleClose} color='primary' autoFocus>
					{t('global.no')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogAutoFill;
