import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import MenuItem from '@mui/material/MenuItem';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import ScheduleDetails from '../components/schedule/ScheduleDetails';
import DialogAutoFill from '../components/schedule/DialogAutoFill';
import ScheduleActions from '../components/schedule/ScheduleActions';
import DialogAssignmentDelete from '../components/schedule/DialogAssignmentDelete';
import SchedulePublish from '../components/schedule/SchedulePublish';
import {
	dbGetScheduleListByYear,
	dbGetWeekListBySched,
} from '../indexedDb/dbSourceMaterial';
import {
	isOnlineState,
	monthNamesState,
	shortDateFormatState,
} from '../appStates/appSettings';
import { yearsListState } from '../appStates/appSourceMaterial';
import {
	currentScheduleState,
	currentWeekSchedState,
	dlgAutoFillOpenState,
	dlgAssDeleteOpenState,
	isDlgActionOpenState,
	isPublishOpenState,
	isS89OpenState,
	weekListSchedState,
} from '../appStates/appSchedule';
import { congAccountConnectedState } from '../appStates/appCongregation';

const sharedStyles = {
	btnSchedule: {
		margin: '0 2px 2px 0',
	},
};

const Schedule = () => {
	let navigate = useNavigate();
	const { t } = useTranslation();

	const [currentYear, setCurrentYear] = useState('');
	const [schedules, setSchedules] = useState([]);

	const [currentWeek, setCurrentWeek] = useRecoilState(currentWeekSchedState);
	const [dlgAutoFillOpen, setDlgAutoFillOpen] =
		useRecoilState(dlgAutoFillOpenState);
	const [dlgAssDeleteOpen, setDlgAssDeleteOpen] = useRecoilState(
		dlgAssDeleteOpenState
	);
	const [currentSchedule, setCurrentSchedule] =
		useRecoilState(currentScheduleState);
	const [weeks, setWeeks] = useRecoilState(weekListSchedState);
	const [publishOpen, setPublishOpen] = useRecoilState(isPublishOpenState);

	const setIsS89 = useSetRecoilState(isS89OpenState);

	const years = useRecoilValue(yearsListState);
	const monthNames = useRecoilValue(monthNamesState);
	const shortDateFormat = useRecoilValue(shortDateFormatState);
	const isDlgActionOpen = useRecoilValue(isDlgActionOpenState);
	const congAccountConnected = useRecoilValue(congAccountConnectedState);
	const isOnline = useRecoilValue(isOnlineState);

	const handleAutoFill = () => {
		setDlgAutoFillOpen(true);
	};

	const handleS89 = () => {
		setIsS89(true);
	};

	const handleDeleteAssignment = () => {
		setDlgAssDeleteOpen(true);
	};

	const handleYearChange = async (e) => {
		setIsS89(false);
		setCurrentSchedule('');
		setCurrentYear(e.target.value);
	};

	const handleScheduleChange = async (value) => {
		setIsS89(false);
		setCurrentWeek('');
		setCurrentSchedule(value);
	};

	const handleWeekChange = async (value) => {
		setIsS89(false);
		if (value !== undefined) {
			setCurrentWeek(value);
		}
	};

	const handlePreviewSchedule = () => {
		navigate('/schedule-template');
	};

	const handleShareSchedule = async () => {
		setPublishOpen(true);
	};

	useEffect(() => {
		let mounted = true;
		const getSchedules = async () => {
			const year = years[0].value;

			if (mounted) {
				setCurrentYear(currentYear || year);
			}
		};

		setIsS89(false);
		if (mounted && years.length > 0) {
			getSchedules();
		}

		return () => {
			mounted = false;
		};
	}, [years, currentYear, setIsS89]);

	useEffect(() => {
		const getScheduleByYear = async () => {
			let data = await dbGetScheduleListByYear(currentYear);
			let newData = [];
			for (let i = 0; i < data.length; i++) {
				let obj = {};
				obj.value = data[i].value;
				const monthIndex = parseInt(data[i].value.split('/')[0], 10);
				obj.label = monthNames[monthIndex - 1];
				newData.push(obj);
			}
			setSchedules(newData);

			setCurrentSchedule(newData[0].value);
		};

		if (currentYear !== '') {
			getScheduleByYear();
		}
	}, [currentYear, monthNames, setCurrentSchedule]);

	useEffect(() => {
		const getWeekBySchedule = async () => {
			let data = await dbGetWeekListBySched(currentSchedule);
			let newData = [];
			for (let i = 0; i < data.length; i++) {
				const weekDate = data[i].weekOf;
				const day = weekDate.split('/')[1];
				const month = weekDate.split('/')[0];
				const year = weekDate.split('/')[2];
				const newDate = new Date(year, +month - 1, day);
				const dateFormatted = dateFormat(newDate, shortDateFormat);
				let obj = {};
				obj.value = data[i].value;
				obj.label = dateFormatted;
				newData.push(obj);
			}
			setCurrentWeek('');
			setWeeks(newData);
			setCurrentWeek(newData[0].value);
		};

		if (currentSchedule !== '') {
			getWeekBySchedule();
		}
	}, [currentSchedule, shortDateFormat, setCurrentWeek, setWeeks]);

	useEffect(() => {
		return () => {
			setCurrentWeek('');
			setWeeks([]);
			setCurrentSchedule('');
		};
	}, [setCurrentSchedule, setCurrentWeek, setWeeks]);

	const renderYearList = (year) => {
		return (
			<MenuItem key={year.value} value={year.value}>
				{year.label}
			</MenuItem>
		);
	};

	const renderScheduleList = (schedule) => {
		return (
			<MenuItem key={schedule.value} value={schedule.value}>
				{schedule.label}
			</MenuItem>
		);
	};

	const renderWeekList = (week) => {
		return (
			<MenuItem key={week.value} value={week.value}>
				{week.label}
			</MenuItem>
		);
	};

	return (
		<Box sx={{ marginRight: '5px' }}>
			{dlgAutoFillOpen && <DialogAutoFill />}
			{dlgAssDeleteOpen && <DialogAssignmentDelete />}
			{isDlgActionOpen && (
				<ScheduleActions handleWeekChange={handleWeekChange} />
			)}
			{publishOpen && <SchedulePublish />}
			{schedules.length > 0 && (
				<>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
							marginTop: '10px',
						}}
					>
						<Box>
							<TextField
								id='outlined-select-year'
								select
								label={t('global.year')}
								value={currentYear}
								onChange={(e) => handleYearChange(e)}
								size='small'
								sx={{
									minWidth: '80px',
									marginRight: '5px',
									marginBottom: '10px',
								}}
							>
								{years.map((year) => renderYearList(year))}
							</TextField>
							{schedules.length > 0 && (
								<TextField
									id='outlined-select-schedule'
									select
									label={t('global.schedule')}
									value={currentSchedule}
									onChange={(e) => handleScheduleChange(e.target.value)}
									size='small'
									sx={{
										minWidth: '130px',
										marginRight: '5px',
										marginBottom: '10px',
									}}
								>
									{schedules.map((schedule) => renderScheduleList(schedule))}
								</TextField>
							)}
							{weeks.length > 0 && (
								<TextField
									id='outlined-select-week'
									select
									label={t('global.week')}
									value={currentWeek}
									onChange={(e) => handleWeekChange(e.target.value)}
									size='small'
									sx={{
										minWidth: '140px',
										marginRight: '5px',
										marginBottom: '10px',
									}}
								>
									{weeks.map((week) => renderWeekList(week))}
								</TextField>
							)}
						</Box>
						<Box>
							<Button
								variant='contained'
								color='primary'
								startIcon={<FlashAutoIcon />}
								sx={sharedStyles.btnSchedule}
								onClick={() => handleAutoFill()}
							>
								{t('schedule.autofill')}
							</Button>
							<Button
								variant='contained'
								color='primary'
								startIcon={<SaveAltIcon />}
								sx={sharedStyles.btnSchedule}
								onClick={handlePreviewSchedule}
							>
								PDF
							</Button>
							{isOnline && congAccountConnected && (
								<Button
									variant='contained'
									color='primary'
									sx={sharedStyles.btnSchedule}
									startIcon={<SendIcon />}
									onClick={handleShareSchedule}
								>
									{t('schedule.send')}
								</Button>
							)}
							<Button
								variant='contained'
								color='primary'
								sx={sharedStyles.btnSchedule}
								startIcon={<AssignmentIcon />}
								onClick={() => handleS89()}
							>
								S-89
							</Button>
							<Button
								variant='contained'
								color='error'
								sx={sharedStyles.btnSchedule}
								startIcon={<DeleteIcon />}
								onClick={() => handleDeleteAssignment()}
							>
								{t('global.delete')}
							</Button>
						</Box>
					</Box>
					<Box>
						{currentWeek.length === 10 && (
							<ScheduleDetails week={currentWeek} />
						)}
					</Box>
				</>
			)}
		</Box>
	);
};

export default Schedule;
