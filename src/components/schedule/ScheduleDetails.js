import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import Typography from '@mui/material/Typography';
import ScheduleAYF from './ScheduleAYF';
import StudentSelector from './StudentSelector';
import S89 from './S89';
import { dbSaveAss } from '../../indexedDb/dbAssignment';
import {
	isS89OpenState,
	currentScheduleState,
	isReloadScheduleState,
} from '../../appStates/appSchedule';
import { classCountState } from '../../appStates/appCongregation';
import { dbGetSourceMaterial } from '../../indexedDb/dbSourceMaterial';
import { dbGetScheduleData } from '../../indexedDb/dbSchedule';

const sharedStyles = {
	studentPartWrapper1: {
		width: {
			xs: '100%',
			sm: 'calc(100% - 300px)',
		},
	},
	studentPartWrapper2: {
		width: {
			xs: '100%',
			sm: 'calc(100% - 300px)',
			sm800: 'calc(100% - 600px)',
			lg: 'calc(100% - 300px)',
		},
		flexDirection: {
			sm800: 'row',
		},
	},
	studentContainer1: {
		display: 'flex',
		justifyContent: {
			xs: 'flex-start',
			sm: 'flex-end',
		},
	},
	studentContainer2: {
		display: 'flex',
		justifyContent: {
			xs: 'flex-start',
			sm: 'flex-end',
		},
		flexDirection: {
			xs: 'column',
			xs420: 'row',
			sm: 'column',
			sm800: 'row',
			lg: 'column',
		},
	},
	pickerDlgTitleContainer: {
		padding: '5px 10px',
	},
	pickerDlgTitleSub: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	pickerDlgTitleText: {
		fontWeight: 'bold',
	},
};

const boxMeetingPart = {
	maxWidth: '100%',
	minWidth: '320px',
	borderRadius: '10px',
	padding: '0 10px',
	color: 'white',
	marginTop: '10px',
	marginBottom: '5px',
};

const typoStudentField = {
	height: '25px',
	lineHeight: '25px',
	width: '165px',
	backgroundColor: 'lightblue',
	color: 'purple',
	padding: '2px 2px 2px 5px',
	borderRadius: 5,
	fontWeight: 'bold',
};

const boxStudentFldContainer = {
	display: 'flex',
	marginRight: '5px',
	alignItems: 'flex-end',
};

const iconButtonContainer = {
	padding: '1px',
};

const editIconButton = {
	fontSize: '24px',
};

const boxStudentSelector = {
	marginLeft: '5px',
	marginTop: '10px',
	width: '600px',
	display: {
		xs: 'none',
		lg: 'block',
	},
};

const ScheduleDetails = ({ week }) => {
	const { t } = useTranslation();

	const [bibleReadingSrc, setBibleReadingSrc] = useState('');
	const [ass1Type, setAss1Type] = useState('');
	const [ass1TypeName, setAss1TypeName] = useState('');
	const [ass1Time, setAss1Time] = useState('');
	const [ass1Src, setAss1Src] = useState('');
	const [ass2Type, setAss2Type] = useState('');
	const [ass2TypeName, setAss2TypeName] = useState('');
	const [ass2Time, setAss2Time] = useState('');
	const [ass2Src, setAss2Src] = useState('');
	const [ass3Type, setAss3Type] = useState('');
	const [ass3TypeName, setAss3TypeName] = useState('');
	const [ass3Time, setAss3Time] = useState('');
	const [ass3Src, setAss3Src] = useState('');
	const [ass4Type, setAss4Type] = useState('');
	const [ass4TypeName, setAss4TypeName] = useState('');
	const [ass4Time, setAss4Time] = useState('');
	const [ass4Src, setAss4Src] = useState('');
	const [noMeeting, setNoMeeting] = useState(false);
	const [stuBReadA, setStuBReadA] = useState('');
	const [isStuBReadA, setIsStuBReadA] = useState(false);
	const [stuBReadB, setStuBReadB] = useState('');
	const [isStuBReadB, setIsStuBReadB] = useState(false);
	const [stu1A, setStu1A] = useState('');
	const [isStu1A, setIsStu1A] = useState(false);
	const [ass1A, setAss1A] = useState('');
	const [isAss1A, setIsAss1A] = useState(false);
	const [stu1B, setStu1B] = useState('');
	const [isStu1B, setIsStu1B] = useState(false);
	const [ass1B, setAss1B] = useState('');
	const [isAss1B, setIsAss1B] = useState(false);
	const [stu2A, setStu2A] = useState('');
	const [isStu2A, setIsStu2A] = useState(false);
	const [ass2A, setAss2A] = useState('');
	const [isAss2A, setIsAss2A] = useState(false);
	const [stu2B, setStu2B] = useState('');
	const [isStu2B, setIsStu2B] = useState(false);
	const [ass2B, setAss2B] = useState('');
	const [isAss2B, setIsAss2B] = useState(false);
	const [stu3A, setStu3A] = useState('');
	const [isStu3A, setIsStu3A] = useState(false);
	const [ass3A, setAss3A] = useState('');
	const [isAss3A, setIsAss3A] = useState(false);
	const [stu3B, setStu3B] = useState('');
	const [isStu3B, setIsStu3B] = useState(false);
	const [ass3B, setAss3B] = useState('');
	const [isAss3B, setIsAss3B] = useState(false);
	const [stu4A, setStu4A] = useState('');
	const [isStu4A, setIsStu4A] = useState(false);
	const [ass4A, setAss4A] = useState('');
	const [isAss4A, setIsAss4A] = useState(false);
	const [stu4B, setStu4B] = useState('');
	const [isStu4B, setIsStu4B] = useState(false);
	const [ass4B, setAss4B] = useState('');
	const [isAss4B, setIsAss4B] = useState(false);
	const [isAssign, setIsAssign] = useState(false);
	const [assInfo, setAssInfo] = useState({});
	const [isDlgOpen, setIsDlgOpen] = useState(false);

	const [isS89, setIsS89] = useRecoilState(isS89OpenState);
	const [isReload, setIsReload] = useRecoilState(isReloadScheduleState);

	const classCount = useRecoilValue(classCountState);
	const currentSchedule = useRecoilValue(currentScheduleState);

	const theme = useTheme();
	const mdDown = useMediaQuery(theme.breakpoints.down('lg'), { noSsr: true });

	const loadStudentPicker = (obj) => {
		setIsS89(false);
		const args = { ...obj, isAssign: true };
		setAssInfo(args);
		setIsAssign(true);
		setIsDlgOpen(true);
	};

	const handleDlgClose = () => {
		setIsAssign(false);
		setIsS89(false);
	};

	const deleteStudent = async (assID) => {
		var obj = {};
		obj.assID = assID;
		obj.assType = '';
		obj.studentId = undefined;
		obj.studentName = '';
		await setSelectedStudent(obj);
	};

	const setSelectedStudent = async (selectedStudent) => {
		const assID = selectedStudent.assID;
		var studentID = undefined;
		if (typeof selectedStudent.studentId !== 'undefined') {
			studentID = selectedStudent.studentId;
		}
		const studentName = selectedStudent.studentName;

		if (assID === 0) {
			setIsStuBReadA(true);
			await dbSaveAss(week, studentID, 'bRead_stu_A');
			setStuBReadA(studentName);
			setIsStuBReadA(false);
		} else if (assID === 1) {
			setIsStuBReadB(true);
			await dbSaveAss(week, studentID, 'bRead_stu_B');
			setStuBReadB(studentName);
			setIsStuBReadB(false);
		} else if (assID === 2) {
			setIsStu1A(true);
			await dbSaveAss(week, studentID, 'ass1_stu_A');
			setStu1A(studentName);
			setIsStu1A(false);
		} else if (assID === 3) {
			setIsAss1A(true);
			await dbSaveAss(week, studentID, 'ass1_ass_A');
			setAss1A(studentName);
			setIsAss1A(false);
		} else if (assID === 4) {
			setIsStu1B(true);
			await dbSaveAss(week, studentID, 'ass1_stu_B');
			setStu1B(studentName);
			setIsStu1B(false);
		} else if (assID === 5) {
			setIsAss1B(true);
			await dbSaveAss(week, studentID, 'ass1_ass_B');
			setAss1B(studentName);
			setIsAss1B(false);
		} else if (assID === 6) {
			setIsStu2A(true);
			await dbSaveAss(week, studentID, 'ass2_stu_A');
			setStu2A(studentName);
			setIsStu2A(false);
		} else if (assID === 7) {
			setIsAss2A(true);
			await dbSaveAss(week, studentID, 'ass2_ass_A');
			setAss2A(studentName);
			setIsAss2A(false);
		} else if (assID === 8) {
			setIsStu2B(true);
			await dbSaveAss(week, studentID, 'ass2_stu_B');
			setStu2B(studentName);
			setIsStu2B(false);
		} else if (assID === 9) {
			setIsAss2B(false);
			await dbSaveAss(week, studentID, 'ass2_ass_B');
			setAss2B(studentName);
			setIsAss2B(true);
		} else if (assID === 10) {
			setIsStu3A(true);
			await dbSaveAss(week, studentID, 'ass3_stu_A');
			setStu3A(studentName);
			setIsStu3A(false);
		} else if (assID === 11) {
			setIsAss3A(true);
			await dbSaveAss(week, studentID, 'ass3_ass_A');
			setAss3A(studentName);
			setIsAss3A(false);
		} else if (assID === 12) {
			setIsStu3B(true);
			await dbSaveAss(week, studentID, 'ass3_stu_B');
			setStu3B(studentName);
			setIsStu3B(false);
		} else if (assID === 13) {
			setIsAss3B(true);
			await dbSaveAss(week, studentID, 'ass3_ass_B');
			setAss3B(studentName);
			setIsAss3B(false);
		} else if (assID === 14) {
			setIsStu4A(true);
			await dbSaveAss(week, studentID, 'ass4_stu_A');
			setStu4A(studentName);
			setIsStu4A(false);
		} else if (assID === 15) {
			setIsAss4A(true);
			await dbSaveAss(week, studentID, 'ass4_ass_A');
			setAss4A(studentName);
			setIsAss4A(false);
		} else if (assID === 16) {
			setIsStu4B(true);
			await dbSaveAss(week, studentID, 'ass4_stu_B');
			setStu4B(studentName);
			setIsStu4B(false);
		} else if (assID === 17) {
			setIsAss4B(true);
			await dbSaveAss(week, studentID, 'ass4_ass_B');
			setAss4B(studentName);
			setIsAss4B(false);
		}
	};

	useEffect(() => {
		const loadCurrentWeekData = async () => {
			const scheduleData = await dbGetScheduleData(week);
			const sourceData = await dbGetSourceMaterial(week);

			setBibleReadingSrc(sourceData.bibleReading_src);
			setStuBReadA(scheduleData.bRead_stu_A_dispName);
			setStuBReadB(scheduleData.bRead_stu_B_dispName);
			setAss1Type(sourceData.ass1_type);
			setAss1TypeName(sourceData.ass1_type_name);
			setAss1Time(sourceData.ass1_time);
			setAss1Src(sourceData.ass1_src);
			setStu1A(scheduleData.ass1_stu_A_dispName);
			setAss1A(scheduleData.ass1_ass_A_dispName);
			setStu1B(scheduleData.ass1_stu_B_dispName);
			setAss1B(scheduleData.ass1_ass_B_dispName);
			setAss2Type(sourceData.ass2_type);
			setAss2TypeName(sourceData.ass2_type_name);
			setAss2Time(sourceData.ass2_time);
			setAss2Src(sourceData.ass2_src);
			setStu2A(scheduleData.ass2_stu_A_dispName);
			setAss2A(scheduleData.ass2_ass_A_dispName);
			setStu2B(scheduleData.ass2_stu_B_dispName);
			setAss2B(scheduleData.ass2_ass_B_dispName);
			setAss3Type(sourceData.ass3_type);
			setAss3TypeName(sourceData.ass3_type_name);
			setAss3Time(sourceData.ass3_time);
			setAss3Src(sourceData.ass3_src);
			setStu3A(scheduleData.ass3_stu_A_dispName);
			setAss3A(scheduleData.ass3_ass_A_dispName);
			setStu3B(scheduleData.ass3_stu_B_dispName);
			setAss3B(scheduleData.ass3_ass_B_dispName);
			setAss4Type(sourceData.ass4_type);
			setAss4TypeName(sourceData.ass4_type_name);
			setAss4Time(sourceData.ass4_time);
			setAss4Src(sourceData.ass4_src);
			setStu4A(scheduleData.ass4_stu_A_dispName);
			setAss4A(scheduleData.ass4_ass_A_dispName);
			setStu4B(scheduleData.ass4_stu_B_dispName);
			setAss4B(scheduleData.ass4_ass_B_dispName);
			setNoMeeting(scheduleData.noMeeting);
		};

		if (week !== '' || isReload) {
			loadCurrentWeekData();
			setIsReload(false);
		}
	}, [t, week, isReload, setIsReload]);

	useEffect(() => {
		if (isS89) {
			setIsAssign(false);
		}
	}, [isS89]);

	if (noMeeting) {
		return (
			<Container
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '60vh',
				}}
			>
				<NoMeetingRoomIcon color='error' sx={{ fontSize: '150px' }} />
				<Typography variant='body1' align='center'>
					{t('global.noMidweekMeeting')}
				</Typography>
			</Container>
		);
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
			}}
		>
			{isAssign && (
				<Dialog
					open={mdDown ? isDlgOpen : false}
					onClose={handleDlgClose}
					aria-labelledby='dialog-title'
				>
					<DialogTitle
						id='dialog-title'
						sx={sharedStyles.pickerDlgTitleContainer}
					>
						<Box sx={sharedStyles.pickerDlgTitleSub}>
							<Typography sx={sharedStyles.pickerDlgTitleText}>
								{t('schedule.assignStudent')}
							</Typography>
							<IconButton onClick={() => handleDlgClose()}>
								<CancelIcon />
							</IconButton>
						</Box>
					</DialogTitle>
					<DialogContent>
						<StudentSelector
							assInfo={assInfo}
							setIsAssign={(value) => setIsAssign(value)}
							setSelectedStudent={(value) => setSelectedStudent(value)}
							deleteStudent={(value) => deleteStudent(value)}
							currentWeek={week}
						/>
					</DialogContent>
				</Dialog>
			)}
			{isS89 && (
				<Dialog
					open={mdDown ? isS89 : false}
					onClose={handleDlgClose}
					aria-labelledby='dialog-title'
				>
					<DialogTitle
						id='dialog-title'
						sx={sharedStyles.pickerDlgTitleContainer}
					>
						<Box sx={sharedStyles.pickerDlgTitleSub}>
							<Typography sx={sharedStyles.pickerDlgTitleText}>
								{t('schedule.s89')}
							</Typography>
							<IconButton onClick={() => handleDlgClose()}>
								<CancelIcon />
							</IconButton>
						</Box>
					</DialogTitle>
					<DialogContent>
						<S89 />
					</DialogContent>
				</Dialog>
			)}
			<Box sx={{ width: '100%' }}>
				<Box sx={boxMeetingPart} className={'tgwPart'}>
					<Typography variant='h6'>{t('global.treasuresPart')}</Typography>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
					}}
				>
					<Grid
						item
						sx={
							classCount === 1
								? sharedStyles.studentPartWrapper1
								: sharedStyles.studentPartWrapper2
						}
					>
						<Typography
							variant='body1'
							sx={{
								fontWeight: 'bold',
								fontSize: 16,
							}}
						>
							{t('global.bibleReadingText')}
						</Typography>
						<Typography variant='body1'>{bibleReadingSrc}</Typography>
					</Grid>
					<Grid
						item
						sx={
							classCount === 1
								? sharedStyles.studentContainer1
								: sharedStyles.studentContainer2
						}
					>
						<Box sx={boxStudentFldContainer}>
							<Typography sx={typoStudentField} variant='body1'>
								{stuBReadA}
							</Typography>
							{isStuBReadA && (
								<CircularProgress
									sx={sharedStyles.fieldBtnContainer}
									color='secondary'
									size={26}
									disableShrink={true}
								/>
							)}
							{!isStuBReadA && (
								<IconButton
									sx={iconButtonContainer}
									onClick={() =>
										loadStudentPicker({
											assID: 0,
											assType: 100,
											assTypeName: t('global.bibleReading'),
											currentStudent: stuBReadA,
										})
									}
								>
									<EditIcon sx={editIconButton} />
								</IconButton>
							)}
						</Box>
						{classCount === 2 && (
							<Box sx={boxStudentFldContainer}>
								<Typography sx={typoStudentField} variant='body1'>
									{stuBReadB}
								</Typography>
								{isStuBReadB && (
									<CircularProgress
										sx={sharedStyles.fieldBtnContainer}
										color='secondary'
										size={26}
										disableShrink={true}
									/>
								)}
								{!isStuBReadB && (
									<IconButton
										sx={iconButtonContainer}
										onClick={() =>
											loadStudentPicker({
												assID: 1,
												assType: 100,
												assTypeName: t('global.bibleReading'),
												currentStudent: stuBReadB,
											})
										}
									>
										<EditIcon sx={editIconButton} />
									</IconButton>
								)}
							</Box>
						)}
					</Grid>
				</Box>
				<Box sx={boxMeetingPart} className='ayfPart'>
					<Typography variant='h6'>
						{t('global.applyFieldMinistryPart')}
					</Typography>
				</Box>
				<ScheduleAYF
					params={{
						classCount,
						stuAID: 2,
						assAID: 3,
						stuBID: 4,
						assBID: 5,
						assType: ass1Type,
						assTypeName: ass1TypeName,
						assTime: ass1Time,
						assSrc: ass1Src,
						stuA: stu1A,
						assA: ass1A,
						stuB: stu1B,
						assB: ass1B,
						isStuA: isStu1A,
						isAssA: isAss1A,
						isStuB: isStu1B,
						isAssB: isAss1B,
					}}
					loadStudentPicker={(value) => loadStudentPicker(value)}
				/>
				{!isNaN(ass2Type) && (
					<ScheduleAYF
						params={{
							classCount,
							stuAID: 6,
							assAID: 7,
							stuBID: 8,
							assBID: 9,
							assType: ass2Type,
							assTypeName: ass2TypeName,
							assTime: ass2Time,
							assSrc: ass2Src,
							stuA: stu2A,
							assA: ass2A,
							stuB: stu2B,
							assB: ass2B,
							isStuA: isStu2A,
							isAssA: isAss2A,
							isStuB: isStu2B,
							isAssB: isAss2B,
						}}
						loadStudentPicker={(value) => loadStudentPicker(value)}
					/>
				)}
				{!isNaN(ass3Type) && (
					<ScheduleAYF
						params={{
							classCount,
							stuAID: 10,
							assAID: 11,
							stuBID: 12,
							assBID: 13,
							assType: ass3Type,
							assTypeName: ass3TypeName,
							assTime: ass3Time,
							assSrc: ass3Src,
							stuA: stu3A,
							assA: ass3A,
							stuB: stu3B,
							assB: ass3B,
							isStuA: isStu3A,
							isAssA: isAss3A,
							isStuB: isStu3B,
							isAssB: isAss3B,
						}}
						loadStudentPicker={(value) => loadStudentPicker(value)}
					/>
				)}
				{!isNaN(ass4Type) && (
					<ScheduleAYF
						params={{
							classCount,
							stuAID: 14,
							assAID: 15,
							stuBID: 16,
							assBID: 17,
							assType: ass4Type,
							assTypeName: ass4TypeName,
							assTime: ass4Time,
							assSrc: ass4Src,
							stuA: stu4A,
							assA: ass4A,
							stuB: stu4B,
							assB: ass4B,
							isStuA: isStu4A,
							isAssA: isAss4A,
							isStuB: isStu4B,
							isAssB: isAss4B,
						}}
						loadStudentPicker={(value) => loadStudentPicker(value)}
					/>
				)}
			</Box>
			{!mdDown && (
				<Box sx={boxStudentSelector}>
					{isAssign && (
						<StudentSelector
							assInfo={assInfo}
							setIsAssign={(value) => setIsAssign(value)}
							setSelectedStudent={(value) => setSelectedStudent(value)}
							deleteStudent={(value) => deleteStudent(value)}
						/>
					)}
					{isS89 && (
						<S89
							isS89={isS89}
							currentSchedule={currentSchedule}
							setIsS89={(value) => setIsS89(value)}
						/>
					)}
				</Box>
			)}
		</Box>
	);
};

export default ScheduleDetails;
