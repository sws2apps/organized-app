import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import AppLanguage from '../components/root/AppLanguage';
import StepperWelcome from '../components/startup/StepperWelcome';
import StepperCongregation from '../components/startup/StepperCongregation';
import StepperMeetingDetails from '../components/startup/StepperMeetingDetails';
import { initAppDb, isDbExist } from '../indexedDb/dbUtility';
import {
	checkSrcUpdate,
	dbGetListWeekType,
	dbGetYearList,
} from '../indexedDb/dbSourceMaterial';
import {
	dbGetAppSettings,
	dbUpdateAppSettings,
} from '../indexedDb/dbAppSettings';
import {
	classCountState,
	congIDState,
	congNameState,
	congNumberState,
	isErrorCongNameState,
	isErrorCongNumberState,
	liveClassState,
	meetingDayState,
} from '../appStates/appCongregation';
import { appLangState, isAppLoadState } from '../appStates/appSettings';
import {
	assTypeListState,
	weekTypeListState,
	yearsListState,
} from '../appStates/appSourceMaterial';
import {
	allStudentsState,
	filteredStudentsState,
} from '../appStates/appStudents';
import { dbGetStudents } from '../indexedDb/dbPersons';
import { dbGetListAssType } from '../indexedDb/dbAssignment';

const Startup = () => {
	const { t, i18n } = useTranslation();

	const [isSetup, setIsSetup] = useState(false);

	const [congName, setCongName] = useRecoilState(congNameState);
	const [congNumber, setCongNumber] = useRecoilState(congNumberState);
	const [isErrorCongName, setIsErrorCongName] =
		useRecoilState(isErrorCongNameState);
	const [isErrorCongNumber, setIsErrorCongNumber] = useRecoilState(
		isErrorCongNumberState
	);
	const [meetingDay, setMeetingDay] = useRecoilState(meetingDayState);
	const [classCount, setClassCount] = useRecoilState(classCountState);

	const setCongID = useSetRecoilState(congIDState);
	const setAppLang = useSetRecoilState(appLangState);
	const setIsAppLoad = useSetRecoilState(isAppLoadState);
	const setDbStudents = useSetRecoilState(allStudentsState);
	const setStudents = useSetRecoilState(filteredStudentsState);
	const setYearsList = useSetRecoilState(yearsListState);
	const setAssTypeList = useSetRecoilState(assTypeListState);
	const setWeekTypeList = useSetRecoilState(weekTypeListState);
	const setLiveClass = useSetRecoilState(liveClassState);

	const [activeStep, setActiveStep] = useState(0);
	const steps = [
		t('startup.welcomeTitle'),
		t('startup.congInfoTitle'),
		t('startup.meetingInfoTitle'),
		t('startup.setupCompleteTitle'),
	];

	const getStepContent = (step) => {
		if (step === 0) {
			return <StepperWelcome />;
		} else if (step === 1) {
			return <StepperCongregation />;
		} else if (step === 2) {
			return <StepperMeetingDetails />;
		} else if (step === 3) {
			return (
				<Typography variant='body2'>
					{t('startup.setupCompleteDescription')}
				</Typography>
			);
		}
	};

	const handleNext = async () => {
		setIsErrorCongName(false);
		setIsErrorCongNumber(false);
		if (activeStep < steps.length - 1) {
			let hasError = false;

			if (activeStep === 1) {
				if (congName === '') {
					setIsErrorCongName(true);
					hasError = true;
				}
				if (congNumber === '') {
					setIsErrorCongNumber(true);
					hasError = true;
				}
				if (!hasError) {
					setActiveStep((prevActiveStep) => prevActiveStep + 1);
				}
			} else {
				setActiveStep((prevActiveStep) => prevActiveStep + 1);
			}
		} else if (activeStep === steps.length - 1) {
			await handleDbInit();
		}
	};

	const handleDbInit = async () => {
		setIsSetup(false);
		await initAppDb();
		var obj = {};
		obj.cong_name = congName;
		obj.cong_number = congNumber;
		obj.class_count = classCount;
		obj.meeting_day = meetingDay;
		obj.liveEventClass = false;
		await dbUpdateAppSettings(obj);

		await checkSrcUpdate();
		setTimeout(() => {
			setIsAppLoad(false);
		}, 1000);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	useEffect(() => {
		const isExist = async () => {
			const isDataExist = await isDbExist();
			if (isDataExist) {
				setIsSetup(false);
				await initAppDb();
				await checkSrcUpdate();

				let {
					cong_number,
					cong_name,
					class_count,
					meeting_day,
					cong_id,
					app_lang,
					liveEventClass,
				} = await dbGetAppSettings();
				setCongNumber(cong_number);
				setCongName(cong_name);
				setClassCount(class_count);
				setMeetingDay(meeting_day);
				setCongID(cong_id || '');
				setAppLang(app_lang || 'e');
				setLiveClass(liveEventClass);

				i18n.changeLanguage(app_lang);

				const weekTypeList = await dbGetListWeekType();
				setWeekTypeList(weekTypeList);

				const assTypeList = await dbGetListAssType();
				setAssTypeList(assTypeList);

				const data = await dbGetStudents();
				setDbStudents(data);
				setStudents(data);

				const years = await dbGetYearList();
				setYearsList(years);

				setTimeout(() => {
					setIsAppLoad(false);
				}, 1000);
			} else {
				setIsSetup(true);
			}
		};

		isExist();

		return () => {
			//clean up
		};
	}, [
		i18n,
		setIsAppLoad,
		setClassCount,
		setCongID,
		setCongName,
		setCongNumber,
		setLiveClass,
		setMeetingDay,
		setAppLang,
		setDbStudents,
		setStudents,
		setYearsList,
		setAssTypeList,
		setWeekTypeList,
	]);

	if (isSetup) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						right: 0,
					}}
				>
					<AppLanguage isStartup />
				</Box>
				<Box
					sx={{
						maxWidth: '500px',
						marginTop: '20px',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<img
							src='/img/appLogo.png'
							alt='App logo'
							className={'appLogoMini'}
						/>
						<Typography variant='h6'>LMM-OA App</Typography>
					</Box>
					<Stepper activeStep={activeStep} orientation='vertical'>
						{steps.map((label, index) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
								<StepContent>
									{getStepContent(index)}
									<div>
										<div>
											<Button
												disabled={activeStep === 0}
												onClick={handleBack}
												sx={{
													marginTop: '10px',
													marginRight: '10px',
												}}
											>
												{t('startup.back')}
											</Button>
											<Button
												disabled={
													activeStep === 1 &&
													(isErrorCongName || isErrorCongNumber)
												}
												variant='contained'
												color='primary'
												onClick={handleNext}
												sx={{
													marginTop: '10px',
													marginRight: '10px',
												}}
											>
												{activeStep === steps.length - 1
													? t('startup.openApp')
													: t('startup.next')}
											</Button>
										</div>
									</div>
								</StepContent>
							</Step>
						))}
					</Stepper>
				</Box>
			</Box>
		);
	}

	return (
		<div className='app-splash-screen'>
			<div className='app-logo-container'>
				<img src='/img/appLogo.png' alt='App logo' className='appLogo' />
			</div>
			<CircularProgress />
		</div>
	);
};

export default Startup;
