import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import {
	dbGetScheduleListByYear,
	dbGetWeekListBySched,
} from '../../indexedDb/dbSourceMaterial';
import {
	monthNamesState,
	shortDateFormatState,
} from '../../appStates/appSettings';
import {
	currentWeekState,
	yearsListState,
} from '../../appStates/appSourceMaterial';

const dateFormat = require('dateformat');

const WeekList = () => {
	const { t } = useTranslation();

	const [currentYear, setCurrentYear] = useState('');
	const [schedules, setSchedules] = useState([]);
	const [currentSchedule, setCurrentSchedule] = useState('');
	const [weeks, setWeeks] = useState([]);

	const [currentWeek, setCurrentWeek] = useRecoilState(currentWeekState);

	const years = useRecoilValue(yearsListState);
	const monthNames = useRecoilValue(monthNamesState);
	const shortDateFormat = useRecoilValue(shortDateFormatState);

	const handleYearChange = async (e) => {
		setCurrentSchedule('');
		setCurrentYear(e.target.value);
	};

	const handleScheduleChange = async (value) => {
		setCurrentWeek('');
		setCurrentSchedule(value);
	};

	const handleWeekChange = (value) => {
		if (value !== undefined) {
			setCurrentWeek(value);
		}
	};

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

	useEffect(() => {
		let mounted = true;
		const getSchedules = async () => {
			const year = years[0].value;

			if (mounted) {
				setCurrentYear(currentYear || year);
			}
		};

		if (mounted && years.length > 0) {
			getSchedules();
		}

		return () => {
			mounted = false;
		};
	}, [years, currentYear]);

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
	}, [currentYear, monthNames]);

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
			setWeeks(newData);

			setCurrentWeek(newData[0].value);
		};

		if (currentSchedule !== '') {
			setCurrentWeek('');
			getWeekBySchedule();
		}
	}, [currentSchedule, shortDateFormat, setCurrentWeek]);

	return (
		<div>
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
						minWidth: '140px',
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
		</div>
	);
};

export default WeekList;
