import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import { dbGetUserKey, dbSavePersoCode, initAppDb, initUserDb, isDbExist } from '../indexedDb/dbUtility';
import StepperWelcome from '../components/startup/StepperWelcome';
import StepperCongregation from '../components/startup/StepperCongregation';
import StepperMeetingDetails from '../components/startup/StepperMeetingDetails';
import StepperAboutMe from '../components/startup/StepperAboutMe';
import { checkSrcUpdate } from '../indexedDb/dbSourceMaterial';
import { dbGetAppSettings, dbUpdateAppSettings } from '../indexedDb/dbAppSettings';
import { classCountState, congIDState, congNameState, congNumberState, congPINState, isErrorCongNameState, isErrorCongNumberState, meetingDayState } from '../appStates/appCongregation';
import { isErrorPersoCodeState, userPersoCodeState } from '../appStates/appMe';
import { isAppLoadState } from '../appStates/appSettings';
import { allStudentsState, filteredStudentsState } from '../appStates/appStudents';
import { dbGetStudents } from '../indexedDb/dbPersons';

const Startup = () => {
    const [isSetup, setIsSetup] = useState(false);

    const [persoCode, setPersoCode] = useRecoilState(userPersoCodeState);
    const [isErrorPersoCode, setIsErrorPersoCode] = useRecoilState(isErrorPersoCodeState);
    const [congName, setCongName] = useRecoilState(congNameState);
    const [congNumber, setCongNumber] = useRecoilState(congNumberState);
    const [isErrorCongName, setIsErrorCongName] = useRecoilState(isErrorCongNameState);
    const [isErrorCongNumber, setIsErrorCongNumber] = useRecoilState(isErrorCongNumberState);
    const [meetingDay, setMeetingDay] = useRecoilState(meetingDayState);
    const [classCount, setClassCount] = useRecoilState(classCountState);

    const setCongID = useSetRecoilState(congIDState);
    const setCongPIN = useSetRecoilState(congPINState);
    const setIsAppLoad = useSetRecoilState(isAppLoadState);
    const setDbStudents = useSetRecoilState(allStudentsState);
    const setStudents = useSetRecoilState(filteredStudentsState);

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Tongasoa eto amin’ny LMM-OA",
        "Mombamomba ahy",
        "Fanazavana momba ny fiangonana",
        "Fanazavana momba ny fivoriana",
        "Vita ny fanamboarana"
    ];

    const getStepContent = (step) => {
        if (step === 0) {
            return <StepperWelcome />
        } else if (step === 1) {
            return <StepperAboutMe />
        } else if (step === 2) {
            return <StepperCongregation />
        } else if (step === 3) {
            return <StepperMeetingDetails />
        } else if (step === 4) {
            return (
                <Typography variant="body2">Vita ny fanamboarana voalohany ilain’ny LMM-OA. Mbola azonao ovana izy ireo rehefa mampiasa ny LMM-OA ianao.</Typography>
            )
        }
    }

    const handleNext = async () => {
        setIsErrorPersoCode(false);
        setIsErrorCongName(false);
        setIsErrorCongNumber(false);
        if (activeStep < steps.length - 1) {
            let hasError = false;

            if (activeStep === 1) {
                if (persoCode === "" || persoCode.length < 6) {
                    setIsErrorPersoCode(true)
                    hasError = true;
                }
                if (!hasError) {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
            } else if (activeStep === 2) {
                if (congName === "") {
                    setIsErrorCongName(true)
                    hasError = true;
                }
                if (congNumber === "") {
                    setIsErrorCongNumber(true)
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
        await initUserDb();
        await dbSavePersoCode(persoCode);
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
    }
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect (() => {
        const isExist = async () => {
            const isDataExist = await isDbExist();
            if (isDataExist) {
                setIsSetup(false);
                await initAppDb();
                await checkSrcUpdate();
                
                const {cong_number, cong_name, class_count, meeting_day, cong_ID, cong_PIN} = await dbGetAppSettings();
                setCongNumber(cong_number);
                setCongName(cong_name);
                setClassCount(class_count);
                setMeetingDay(meeting_day);
                setCongID(cong_ID);
                setCongPIN(cong_PIN);

                const userCode = await dbGetUserKey();
                setPersoCode(userCode);
                
                const data = await dbGetStudents();
                setDbStudents(data);
                setStudents(data);
                
                setTimeout(() => {
                    setIsAppLoad(false);
                }, 1000);
            } else {
                setIsSetup(true);
            };
        }

        isExist();

        return () => {
            //clean up
        }
    }, [setIsAppLoad, setClassCount, setCongID, setCongName, setCongNumber, setCongPIN, setMeetingDay, setPersoCode, setDbStudents, setStudents])


    if (isSetup) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box sx={{maxWidth: 500}}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <img src="/img/appLogo.png" alt="App logo" className={"appLogoMini"} />
                        <Typography variant="h6">LMM-OA App</Typography>
                    </Box>
                    <Stepper activeStep={activeStep} orientation="vertical">
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
                                            Hiverina
                                        </Button>
                                        <Button
                                            disabled={(activeStep === 1 && isErrorPersoCode) || (activeStep === 2 && (isErrorCongName || isErrorCongNumber))}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            sx={{
                                                marginTop: '10px',
                                                marginRight: '10px',
                                            }}
                                        >
                                            {activeStep === steps.length - 1 ? 'Hanokatra' : 'Manaraka'}
                                        </Button>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>
        )
    }

    return ( 
        <div className="app-splash-screen">
            <div className="app-logo-container">
                <img src="/img/appLogo.png" alt="App logo" className="appLogo" />
            </div>
            <CircularProgress />
        </div>
     );
}
 
export default Startup;