import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import { shortDatePickerFormatState } from '../../appStates/appSettings';

const datePicker = {
	marginTop: '25px',
	marginLeft: '10px !important',
	width: '170px !important',
	'.MuiInputBase-inputAdornedEnd': {
		padding: '9px !important',
	},
	'.MuiInputLabel-formControl': {
		top: '-7px !important',
	},
};

const StudentTimeAwayItem = ({ timeAway, timeAways, setTimeAway }) => {
	const { t } = useTranslation();

	const { timeAwayId } = timeAway;

	const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

	const [startedDate, setStartedDate] = useState(timeAway.startDate);
	const [expiredDate, setExpiredDate] = useState(timeAway.endDate);
	const [comments, setComments] = useState('');

	const handleInfoChange = (startDate, endDate, comments) => {
		if (timeAwayId) {
			let obj = timeAways.map((timeAway) =>
				timeAway.timeAwayId === timeAwayId
					? {
							timeAwayId: timeAwayId,
							startDate: startDate,
							endDate: endDate,
							comments: comments,
					  }
					: timeAway
			);
			setTimeAway(obj);
		}
	};

	const handleStartedChange = (newValue) => {
		if (newValue instanceof Date && !isNaN(newValue)) {
			const d = format(newValue, 'MM/dd/yyyy');
			setStartedDate(d);
			handleInfoChange(d, expiredDate, comments);
		}
	};

	const handleExpiredChange = (newValue) => {
		if (newValue instanceof Date && !isNaN(newValue)) {
			const d = format(newValue, 'MM/dd/yyyy');
			setExpiredDate(d);
			handleInfoChange(startedDate, d, comments);
		}
	};

	const handleCommentsChange = (value) => {
		setComments(value);
		handleInfoChange(startedDate, expiredDate, value);
	};

	const handleRemoveTimeAway = () => {
		let obj = timeAways.filter(
			(timeAway) => timeAway.timeAwayId !== timeAwayId
		);
		setTimeAway(obj);
	};

	return (
		<Box
			id='time-away-item'
			sx={{
				border: '1px outset',
				width: '100%',
				borderRadius: '8px',
				paddingBottom: '10px',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap',
					marginTop: '-5px',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
					}}
				>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DesktopDatePicker
							id='start-date-time-away-picker'
							label={t('global.startDate')}
							inputFormat={shortDatePickerFormat}
							value={startedDate}
							onChange={handleStartedChange}
							renderInput={(params) => (
								<TextField {...params} sx={datePicker} />
							)}
						/>
					</LocalizationProvider>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DesktopDatePicker
							id='end-date-time-away-picker'
							label={t('global.endDate')}
							inputFormat={shortDatePickerFormat}
							value={expiredDate}
							onChange={handleExpiredChange}
							renderInput={(params) => (
								<TextField {...params} sx={datePicker} />
							)}
							sx={{ marginTop: '15px' }}
						/>
					</LocalizationProvider>
				</Box>
				<TextField
					label={t('global.comments')}
					variant='outlined'
					size='small'
					autoComplete='off'
					sx={{
						marginTop: '20px',
						flexGrow: 1,
						marginRight: '10px',
						marginLeft: '10px',
					}}
					value={comments}
					onChange={(e) => handleCommentsChange(e.target.value)}
				/>
			</Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginTop: '10px',
					marginRight: '10px',
				}}
			>
				<Button
					variant='outlined'
					color='error'
					startIcon={<ClearIcon />}
					onClick={handleRemoveTimeAway}
				>
					{t('global.delete')}
				</Button>
			</Box>
		</Box>
	);
};

export default StudentTimeAwayItem;
