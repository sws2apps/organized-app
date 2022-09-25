import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	classCountState,
	meetingDayState,
} from '../../appStates/appCongregation';

const StepperMeetingDetails = () => {
	const { t } = useTranslation();

	const [meetingDay, setMeetingDay] = useRecoilState(meetingDayState);
	const [classCount, setClassCount] = useRecoilState(classCountState);

	const handleMeetingDayChange = (e) => {
		setMeetingDay(e.target.value);
	};

	const handleClassChange = (e) => {
		setClassCount(e.target.value);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				flexWrap: 'wrap',
			}}
		>
			<Typography variant='body2' paragraph>
				{t('startup.meetingInfoDescription')}
			</Typography>
			<TextField
				id='outlined-select-day'
				select
				label={t('startup.meetingDay')}
				value={meetingDay}
				defaultValue={3}
				onChange={handleMeetingDayChange}
				size='small'
				sx={{
					minWidth: 150,
					marginRight: '5px',
					marginBottom: '10px',
				}}
			>
				<MenuItem value={1}>{t('global.monday')}</MenuItem>
				<MenuItem value={2}>{t('global.tuesday')}</MenuItem>
				<MenuItem value={3}>{t('global.wednesday')}</MenuItem>
				<MenuItem value={4}>{t('global.thursday')}</MenuItem>
				<MenuItem value={5}>{t('global.friday')}</MenuItem>
				<MenuItem value={6}>{t('global.saturday')}</MenuItem>
			</TextField>
			<TextField
				id='outlined-select-class'
				select
				label={t('startup.classCount')}
				value={classCount}
				defaultValue={1}
				onChange={handleClassChange}
				size='small'
				sx={{
					minWidth: 100,
					marginRight: '5px',
					marginBottom: '10px',
				}}
			>
				<MenuItem value={1}>{t('global.oneClass')}</MenuItem>
				<MenuItem value={2}>{t('global.twoClass')}</MenuItem>
			</TextField>
		</Box>
	);
};

export default StepperMeetingDetails;
