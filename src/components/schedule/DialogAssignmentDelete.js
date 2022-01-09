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
	currentWeekSchedState,
	dlgAssDeleteOpenState,
	isDeleteSchedState,
	isDlgActionOpenState,
	schedActionTypeState,
	weekListSchedState,
	weeksToDeleteState,
} from '../../appStates/appSchedule';
import {
	monthNamesState,
	shortDateFormatState,
} from '../../appStates/appSettings';

const dateFormat = require('dateformat');

const DialogAssignmentDelete = () => {
	const { t } = useTranslation();

	const [scheduleName, setScheduleName] = useState('');

	const [currentWeekFormat, setCurrentWeekFormat] = useState('');

	const [dlgAssDeleteOpen, setDlgAssDeleteOpen] = useRecoilState(
		dlgAssDeleteOpenState
	);

	const setIsDlgActionOpen = useSetRecoilState(isDlgActionOpenState);
	const setIsDeleteSched = useSetRecoilState(isDeleteSchedState);
	const setWeeksDelete = useSetRecoilState(weeksToDeleteState);
	const setActionType = useSetRecoilState(schedActionTypeState);

	const currentSchedule = useRecoilValue(currentScheduleState);
	const monthNames = useRecoilValue(monthNamesState);
	const weekList = useRecoilValue(weekListSchedState);
	const currentWeek = useRecoilValue(currentWeekSchedState);
	const shortDateFormat = useRecoilValue(shortDateFormatState);

	const handleDeleteAll = () => {
		setActionType('DeleteAssignment');
		setWeeksDelete(weekList);
		setIsDeleteSched(true);
		setIsDlgActionOpen(true);
		setDlgAssDeleteOpen(false);
	};

	const handleDeleteWeek = () => {
		var obj = [];
		obj.push({ value: currentWeek });
		setActionType('DeleteAssignment');
		setWeeksDelete(obj);
		setIsDeleteSched(true);
		setIsDlgActionOpen(true);
		setDlgAssDeleteOpen(false);
	};

	const handleClose = () => {
		setDlgAssDeleteOpen(false);
	};

	useEffect(() => {
		if (currentWeek !== '') {
			const dateWeek = new Date(currentWeek);
			const newDate = dateFormat(dateWeek, shortDateFormat);
			setCurrentWeekFormat(newDate);
		}
	}, [currentWeek, shortDateFormat]);

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
			open={dlgAssDeleteOpen}
			aria-labelledby='dialog-title-delete-assignment'
			onClose={handleClose}
		>
			<DialogTitle id='dialog-title-delete-assignment'>
				<Typography variant='h6' component='p'>
					{t('schedule.deleteAssignmentTitle')}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Typography>
					{t('schedule.deleteAssignmentDesc', {
						currentSchedule: scheduleName,
						currentWeek: currentWeekFormat,
					})}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleDeleteAll} color='primary'>
					{t('schedule.deleteAllLabel')}
				</Button>
				<Button autoFocus onClick={handleDeleteWeek} color='primary'>
					{t('schedule.deleteWeekOnlyLabel', {
						currentWeek: currentWeekFormat,
					})}
				</Button>
				<Button onClick={handleClose} color='primary' autoFocus>
					{t('global.no')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogAssignmentDelete;
