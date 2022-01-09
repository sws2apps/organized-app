import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { dbAutoFill, dbDeleteWeekAssignment } from '../../indexedDb/dbSchedule';
import {
	currentScheduleState,
	currentWeekSchedState,
	isDlgActionOpenState,
	isReloadScheduleState,
	schedActionTypeState,
	weeksToDeleteState,
} from '../../appStates/appSchedule';

const ScheduleActions = (props) => {
	const { handleWeekChange } = props;

	const { t } = useTranslation();

	const [isDlgActionOpen, setIsDlgActionOpen] =
		useRecoilState(isDlgActionOpenState);

	const setIsReloadSchedule = useSetRecoilState(isReloadScheduleState);
	const currentSchedule = useRecoilValue(currentScheduleState);
	const actionType = useRecoilValue(schedActionTypeState);
	const currentWeek = useRecoilValue(currentWeekSchedState);
	const weeksDelete = useRecoilValue(weeksToDeleteState);

	useEffect(() => {
		const autoAssignSchedule = async () => {
			if (currentSchedule !== '' && typeof currentSchedule !== 'undefined') {
				await dbAutoFill(currentSchedule);
			}
			setIsDlgActionOpen(false);
			setIsReloadSchedule(true);
		};

		const deleteAssignment = async () => {
			if (weeksDelete.length > 0) {
				for (let i = 0; i < weeksDelete.length; i++) {
					await dbDeleteWeekAssignment(weeksDelete[i].value);
				}
			}

			setIsDlgActionOpen(false);
			setIsReloadSchedule(true);
		};

		if (actionType === 'AutoFill') {
			autoAssignSchedule();
		} else if (actionType === 'DeleteAssignment') {
			deleteAssignment();
		}

		return () => {
			//clean-up
		};
	}, [
		actionType,
		currentSchedule,
		currentWeek,
		handleWeekChange,
		setIsDlgActionOpen,
		setIsReloadSchedule,
		weeksDelete,
	]);

	return (
		<Dialog
			open={isDlgActionOpen}
			aria-labelledby='dialog-title-schedule-actions'
		>
			<DialogTitle id='dialog-title-schedule-actions'>
				<Typography>{t('global.pleaseWait')}</Typography>
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
	);
};

export default ScheduleActions;
