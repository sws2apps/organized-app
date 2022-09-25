import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import {
	blue,
	brown,
	green,
	orange,
	purple,
	red,
	teal,
} from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
	currentStudentState,
	isStudentDeleteState,
} from '../../appStates/appStudent';

const sharedStyles = {
	root: {
		backgroundColor: blue[50],
		margin: '5px',
		height: '100%',
	},
	rootUnavailable: {
		backgroundColor: red[200],
		margin: '5px',
		height: '100%',
	},
	chip: {
		margin: '2px',
	},
	chipBRead: {
		backgroundColor: orange[200],
	},
	chipIniCall: {
		backgroundColor: purple[200],
	},
	chipRV: {
		backgroundColor: teal[200],
	},
	chipBS: {
		backgroundColor: green[200],
	},
	chipTalk: {
		backgroundColor: brown[200],
	},
};

const StudentCard = ({ student }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const setCurrentStudent = useSetRecoilState(currentStudentState);
	const setIsStudentDelete = useSetRecoilState(isStudentDeleteState);

	const handleClickOpen = () => {
		navigate(`/students/${student.person_uid}`);
	};

	const handleDelete = (uid, name) => {
		var obj = {};
		obj.name = name;
		obj.person_uid = uid;
		setCurrentStudent(obj);
		setIsStudentDelete(true);
	};

	return (
		<Grid item sx={{ marginBottom: '5px' }} xs={12} sm={6} md={6} lg={4}>
			<Card
				sx={
					student.isDisqualified
						? sharedStyles.rootUnavailable
						: sharedStyles.root
				}
			>
				<CardHeader
					sx={{
						padding: '5px',
						'& .MuiCardHeader-title': {
							fontSize: '16px',
							fontWeight: 'bold',
						},
						'& .MuiCardHeader-action': {
							alignSelf: 'center',
						},
					}}
					avatar={
						<Avatar
							sx={{
								height: '50px',
								width: '50px',
							}}
							alt='Student icon'
							src={student.isMale ? maleIcon : femaleIcon}
						/>
					}
					action={
						<>
							<Tooltip title={t('global.edit')}>
								<IconButton onClick={handleClickOpen}>
									<EditIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title={t('global.delete')}>
								<IconButton
									sx={{ marginRight: '5px' }}
									onClick={() =>
										handleDelete(student.person_uid, student.person_name)
									}
								>
									<DeleteIcon />
								</IconButton>
							</Tooltip>
						</>
					}
					title={student.person_name}
				/>
				<CardContent
					sx={{
						padding: '2px',
						marginLeft: '60px',
						'&:last-child': {
							paddingBottom: 0,
						},
					}}
				>
					{student.assignments.find(
						(assignment) =>
							assignment.code === 100 && assignment.isActive === true
					) && (
						<Chip
							label={t('global.abbrBibleReading')}
							size='small'
							sx={{ ...sharedStyles.chip, ...sharedStyles.chipBRead }}
						/>
					)}
					{student.assignments.find(
						(assignment) =>
							assignment.code === 101 && assignment.isActive === true
					) && (
						<Chip
							label={t('global.abbrInitialCall')}
							size='small'
							sx={{ ...sharedStyles.chip, ...sharedStyles.chipIniCall }}
						/>
					)}
					{student.assignments.find(
						(assignment) =>
							assignment.code === 102 && assignment.isActive === true
					) && (
						<Chip
							label={t('global.abbrReturnVisit')}
							size='small'
							sx={{ ...sharedStyles.chip, ...sharedStyles.chipRV }}
						/>
					)}
					{student.assignments.find(
						(assignment) =>
							assignment.code === 103 && assignment.isActive === true
					) && (
						<Chip
							label={t('global.abbrBibleStudy')}
							size='small'
							sx={{ ...sharedStyles.chip, ...sharedStyles.chipBS }}
						/>
					)}
					{student.assignments.find(
						(assignment) =>
							assignment.code === 104 && assignment.isActive === true
					) && (
						<Chip
							label={t('global.abbrTalk')}
							size='small'
							sx={{ ...sharedStyles.chip, ...sharedStyles.chipTalk }}
						/>
					)}
				</CardContent>
			</Card>
		</Grid>
	);
};

export default StudentCard;
