import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PartDuration from './PartDuration';
import PartType from './PartType';
import SourceMaterialFooter from './SourceMaterialFooter';
import WeekType from './WeekType';
import { dbGetSourceMaterial } from '../../indexedDb/dbSourceMaterial';
import { appLangState } from '../../appStates/appSettings';

const sharedStyles = {
	ayfStuPart: {
		padding: '10px',
		marginBottom: '15px',
		boxShadow: '0 8px rgba(0, 0, 255, 0.2)',
	},
	ayfStuPartInfo: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	inputAYF: {
		width: '100%',
	},
	partHeader: {
		fontWeight: 'bold',
		marginBottom: '10px',
	},
};

const WeekDetails = (props) => {
	const { t } = useTranslation();

	const [weekOf, setWeekOf] = useState('');
	const [hasMeeting, setHasMeeting] = useState(true);
	const [weekType, setWeekType] = useState(1);
	const [BRead, setBRead] = useState('');
	const [Ass1Type, setAss1Type] = useState('');
	const [Ass1Time, setAss1Time] = useState('');
	const [Ass1Src, setAss1Src] = useState('');
	const [Ass2Type, setAss2Type] = useState('');
	const [Ass2Time, setAss2Time] = useState('');
	const [Ass2Src, setAss2Src] = useState('');
	const [Ass3Type, setAss3Type] = useState('');
	const [Ass3Time, setAss3Time] = useState('');
	const [Ass3Src, setAss3Src] = useState('');
	const [Ass4Type, setAss4Type] = useState('');
	const [Ass4Time, setAss4Time] = useState('');
	const [Ass4Src, setAss4Src] = useState('');

	const appLang = useRecoilValue(appLangState);

	const handleWeekAdd = () => {
		props.handleWeekAdd();
	};

	const handleImportEPUB = () => {
		props.handleImportEPUB();
	};

	const handleSaveSource = async () => {
		var obj = {};
		obj.weekOf = weekOf;
		obj.bibleReading_src = BRead;
		obj.ass1_type = Ass1Type;
		obj.ass1_time = Ass1Time;
		obj.ass1_src = Ass1Src;
		obj.ass2_type = Ass2Type;
		obj.ass2_time = Ass2Time;
		obj.ass2_src = Ass2Src;
		obj.ass3_type = Ass3Type;
		obj.ass3_time = Ass3Time;
		obj.ass3_src = Ass3Src;
		obj.ass4_type = Ass4Type;
		obj.ass4_time = Ass4Time;
		obj.ass4_src = Ass4Src;
		obj.week_type = weekType;
		obj.noMeeting = !hasMeeting;
		obj.isOverride = true;

		props.handleSaveSource(obj);
	};

	useEffect(() => {
		let isSubscribed = true;
		const loadWeekData = async () => {
			const data = await dbGetSourceMaterial(props.currentWeek);
			if (isSubscribed) {
				setWeekOf(data.weekOf);
				setHasMeeting(!data.noMeeting);
				setWeekType(data.week_type);
				setBRead(data.bibleReading_src);
				setAss1Time(data.ass1_time);
				setAss1Type(data.ass1_type);
				setAss1Src(data.ass1_src);
				setAss2Time(data.ass2_time);
				setAss2Type(data.ass2_type);
				setAss2Src(data.ass2_src);
				setAss3Time(data.ass3_time);
				setAss3Type(data.ass3_type);
				setAss3Src(data.ass3_src);
				setAss4Time(data.ass4_time);
				setAss4Type(data.ass4_type);
				setAss4Src(data.ass4_src);
			}
		};

		if (props.currentWeek !== '' && isSubscribed) {
			loadWeekData();
		}

		return () => {
			isSubscribed = false;
		};
	}, [props.currentWeek, appLang]);

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					marginBottom: '40px',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						flexWrap: 'wrap-reverse',
					}}
				>
					<WeekType
						weekType={weekType}
						setWeekType={(value) => setWeekType(value)}
						setHasMeeting={(value) => setHasMeeting(value)}
					/>
					<FormControlLabel
						control={
							<Switch
								checked={hasMeeting}
								onChange={(e) => setHasMeeting(e.target.checked)}
							/>
						}
						label={
							hasMeeting
								? t('sourceMaterial.hasMeeting')
								: t('sourceMaterial.noMeeting')
						}
					/>
				</Box>
				<Box className={`tgwPart meetingPart`}>
					<Typography variant='h6'>{t('global.treasuresPart')}</Typography>
				</Box>
				<TextField
					id='outlined-basic'
					label={t('global.bibleReadingText')}
					variant='outlined'
					size='small'
					sx={{
						marginTop: '8px',
						width: '300px',
					}}
					value={BRead}
					onChange={(e) => setBRead(e.target.value)}
				/>
				<Box className={`ayfPart meetingPart`}>
					<Typography variant='h6'>
						{t('global.applyFieldMinistryPart')}
					</Typography>
				</Box>
				<Box sx={sharedStyles.ayfStuPart}>
					<Typography variant='body1' sx={sharedStyles.partHeader}>
						{t('global.ayfPart1')}
					</Typography>
					<Box sx={sharedStyles.ayfStuPartInfo}>
						<PartDuration
							ayf={1}
							assTime={Ass1Time}
							setAss1Time={(value) => setAss1Time(value)}
						/>
						<PartType
							ayf={1}
							assType={Ass1Type}
							setAss1Type={(value) => setAss1Type(value)}
						/>
						<TextField
							id='outlined-basic'
							label={t('global.sourceMaterial')}
							variant='outlined'
							multiline
							size='small'
							sx={sharedStyles.inputAYF}
							value={Ass1Src}
							onChange={(e) => setAss1Src(e.target.value)}
						/>
					</Box>
				</Box>
				<Box sx={sharedStyles.ayfStuPart}>
					<Typography variant='body1' sx={sharedStyles.partHeader}>
						{t('global.ayfPart2')}
					</Typography>
					<Box sx={sharedStyles.ayfStuPartInfo}>
						<PartDuration
							ayf={2}
							assTime={Ass2Time}
							setAss2Time={(value) => setAss2Time(value)}
						/>
						<PartType
							ayf={2}
							assType={Ass2Type}
							setAss2Type={(value) => setAss2Type(value)}
						/>
						<TextField
							id='outlined-basic'
							label={t('global.sourceMaterial')}
							variant='outlined'
							multiline
							size='small'
							sx={sharedStyles.inputAYF}
							value={Ass2Src}
							onChange={(e) => setAss2Src(e.target.value)}
						/>
					</Box>
				</Box>
				<Box sx={sharedStyles.ayfStuPart}>
					<Typography variant='body1' sx={sharedStyles.partHeader}>
						{t('global.ayfPart3')}
					</Typography>
					<Box sx={sharedStyles.ayfStuPartInfo}>
						<PartDuration
							ayf={3}
							assTime={Ass3Time}
							setAss3Time={(value) => setAss3Time(value)}
						/>
						<PartType
							ayf={3}
							assType={Ass3Type}
							setAss3Type={(value) => setAss3Type(value)}
						/>
						<TextField
							id='outlined-basic'
							label={t('global.sourceMaterial')}
							variant='outlined'
							multiline
							size='small'
							sx={sharedStyles.inputAYF}
							value={Ass3Src}
							onChange={(e) => setAss3Src(e.target.value)}
						/>
					</Box>
				</Box>
				<Box sx={sharedStyles.ayfStuPart}>
					<Typography variant='body1' sx={sharedStyles.partHeader}>
						{t('global.ayfPart4')}
					</Typography>
					<Box sx={sharedStyles.ayfStuPartInfo}>
						<PartDuration
							ayf={4}
							assTime={Ass4Time}
							setAss4Time={(value) => setAss4Time(value)}
						/>
						<PartType
							ayf={4}
							assType={Ass4Type}
							setAss4Type={(value) => setAss4Type(value)}
						/>
						<TextField
							id='outlined-basic'
							label={t('global.sourceMaterial')}
							variant='outlined'
							multiline
							size='small'
							sx={sharedStyles.inputAYF}
							value={Ass4Src}
							onChange={(e) => setAss4Src(e.target.value)}
						/>
					</Box>
				</Box>
			</Box>
			<SourceMaterialFooter
				currentWeek={weekOf}
				handleWeekAdd={handleWeekAdd}
				handleImportEPUB={handleImportEPUB}
				handleSaveSource={handleSaveSource}
			/>
		</>
	);
};

export default WeekDetails;
