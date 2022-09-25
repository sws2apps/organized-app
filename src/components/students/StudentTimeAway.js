import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StudentTimeAwayItem from './StudentTimeAwayItem';

const StudentTimeAway = ({ timeAway, setTimeAway }) => {
	const { t } = useTranslation();

	const handleTimeAwayAdd = () => {
		const obj = {
			timeAwayId: window.crypto.randomUUID(),
			startDate: format(new Date(), 'MM/dd/yyyy'),
			endDate: null,
			comments: '',
		};

		setTimeAway([obj, ...timeAway]);
	};

	return (
		<Box id='time-away-container'>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginBottom: '10px',
				}}
			>
				<Button
					variant='outlined'
					color='success'
					startIcon={<AddCircleIcon />}
					onClick={handleTimeAwayAdd}
				>
					{t('students.addTimeAway')}
				</Button>
			</Box>
			{timeAway?.length > 0 &&
				timeAway.map((item) => (
					<StudentTimeAwayItem
						key={item.timeAwayId}
						timeAway={item}
						timeAways={timeAway}
						setTimeAway={(value) => setTimeAway(value)}
					/>
				))}
		</Box>
	);
};

export default StudentTimeAway;
