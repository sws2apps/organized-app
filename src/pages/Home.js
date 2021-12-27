import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Typography from '@mui/material/Typography';
import { dbGetAppSettings } from '../indexedDb/dbAppSettings';
import { dbGetScheduleData } from '../indexedDb/dbSchedule';
import { dbIsWeekExist, dbGetSourceMaterial } from '../indexedDb/dbSourceMaterial';

const sharedStyles = {
    typoLineHeight: {
        lineHeight: 1.3,
        padding: '3px 0',
    },
    studentPartWrapper1: {
        width: {
            xs: '100%',
            sm: 'calc(100% - 200px)',
        },
    },
    studentPartWrapper2: {
        width: {
            xs: '100%',
            sm: 'calc(100% - 200px)',
            sm800: 'calc(100% - 400px)',
            lg: 'calc(100% - 200px)',
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
        }
    },
}

const BoxMeetingPart = styled(Box)(() => ({
    maxWidth: '100%',
    minWidth: '320px',
    borderRadius: '10px',
    padding: '0 10px',
    color: 'white',
    marginTop: '10px',
    marginBottom: '5px',
}));

const BoxPartContainer = styled(Box)(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '10px',
}));

const BoxStudentAYF = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '8px',
}));

const BoxStudentFldContainer = styled(Box)(() => ({
    display: 'flex',
    marginRight: '5px',
    marginBottom: '1px',
    alignItems: 'flex-end',
}));

const TypoStudentField = styled(Typography)(() => ({
    height: '25px',
    lineHeight: '25px',
    width: '165px',
    backgroundColor: 'lightblue',
    color: 'purple',
    padding: '2px 2px 2px 5px',
    borderRadius: 5,
    fontWeight: 'bold',
}));

const TypoStudentPart = styled(Typography)(() => ({
    fontWeight: 'bold',
    fontSize: '16px',
}));

const Home = () => {
    const { t } = useTranslation();

    const [classCount, setClassCount]= useState(1);
    const [bibleReadingSrc, setBibleReadingSrc] = useState("");
    const [ass1Type, setAss1Type] = useState("");
    const [ass1TypeName, setAss1TypeName] = useState("");
    const [ass1Time, setAss1Time] = useState("");
    const [ass1Src, setAss1Src] = useState("");
    const [ass2Type, setAss2Type] = useState("");
    const [ass2TypeName, setAss2TypeName] = useState("");
    const [ass2Time, setAss2Time] = useState("");
    const [ass2Src, setAss2Src] = useState("");
    const [ass3Type, setAss3Type] = useState("");
    const [ass3TypeName, setAss3TypeName] = useState("");
    const [ass3Time, setAss3Time] = useState("");
    const [ass3Src, setAss3Src] = useState("");
    const [ass4Type, setAss4Type] = useState("");
    const [ass4TypeName, setAss4TypeName] = useState("");
    const [ass4Time, setAss4Time] = useState("");
    const [ass4Src, setAss4Src] = useState("");
    const [noMeeting, setNoMeeting] = useState(false);
    const [stuBReadA, setStuBReadA] = useState("");
    const [stuBReadB, setStuBReadB] = useState("");
    const [stu1A, setStu1A] = useState("");
    const [ass1A, setAss1A] = useState("");
    const [stu1B, setStu1B] = useState("");
    const [ass1B, setAss1B] = useState("");
    const [stu2A, setStu2A] = useState("");
    const [ass2A, setAss2A] = useState("");
    const [stu2B, setStu2B] = useState("");
    const [ass2B, setAss2B] = useState("");
    const [stu3A, setStu3A] = useState("");
    const [ass3A, setAss3A] = useState("");
    const [stu3B, setStu3B] = useState("");
    const [ass3B, setAss3B] = useState("");
    const [stu4A, setStu4A] = useState("");
    const [ass4A, setAss4A] = useState("");
    const [stu4B, setStu4B] = useState("");
    const [ass4B, setAss4B] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentWeek, setCurrentWeek] = useState("");
    const [fCurrentWeek, setFCurrentWeek] = useState("");
    const [disablePrevious, setDisablePrevious] = useState(false);
    const [disableNext, setDisableNext] = useState(false);

    const handleActiveWeek = () => {
        var today = new Date();
        var day = today.getDay();
        var diff = today.getDate() - day + (day === 0 ? -6:1);
        var monDay = new Date(today.setDate(diff));
        setCurrentWeek(monDay);
    }

    const getPreviousWeek = () => {
        var result = new Date(currentWeek);
        result.setDate(currentWeek.getDate() - 7);
        return result;
    }

    const getNextWeek = () => {
        var result = new Date(currentWeek);
        result.setDate(currentWeek.getDate() + 7);
        return result;
    }

    const handlePreviousWeek = () => {
        var result = getPreviousWeek();
        setCurrentWeek(result);
    }

    const handleNextWeek = () => {
        var result = getNextWeek();
        setCurrentWeek(result);
    }

    useEffect(() => {
        const loadCurrentWeekData = async () => {
            var dateFormat = require("dateformat");

            var result = new Date(currentWeek);
            result.setDate(currentWeek.getDate() - 7);
            const previousWeek = dateFormat(result, "mm/dd/yyyy");

            result = new Date(currentWeek);
            result.setDate(currentWeek.getDate() + 7);
            const nextWeek = dateFormat(result, "mm/dd/yyyy");

            const hasPrevious = await dbIsWeekExist(previousWeek);
            setDisablePrevious(!hasPrevious);
            const hasNext = await dbIsWeekExist(nextWeek);
            setDisableNext(!hasNext);

            const appSettings = await dbGetAppSettings();
            setClassCount(appSettings.class_count);

            const weekValue = dateFormat(currentWeek, "mm/dd/yyyy");
            const weekValueFormatted = dateFormat(currentWeek, t("global.shortDateFormat"));
            setFCurrentWeek(weekValueFormatted);

            const scheduleData = await dbGetScheduleData(weekValue);
            const sourceData = await dbGetSourceMaterial(weekValue);

            if (typeof sourceData.bibleReading_src === "undefined") {
                setBibleReadingSrc("")
            } else {
                setBibleReadingSrc(sourceData.bibleReading_src);
            }
            setStuBReadA(scheduleData.bRead_stu_A_dispName);
            setStuBReadB(scheduleData.bRead_stu_B_dispName);
            setAss1Type(parseInt(sourceData.ass1_type, 10));
            setAss1TypeName(sourceData.ass1_type_name);
            setAss1Time(sourceData.ass1_time);
            if (typeof sourceData.ass1_src === "undefined") {
                setAss1Src("")
            } else {
                setAss1Src(sourceData.ass1_src);
            }
            setStu1A(scheduleData.ass1_stu_A_dispName);
            setAss1A(scheduleData.ass1_ass_A_dispName);
            setStu1B(scheduleData.ass1_stu_B_dispName);
            setAss1B(scheduleData.ass1_ass_B_dispName);
            setAss2Type(parseInt(sourceData.ass2_type, 10));
            setAss2TypeName(sourceData.ass2_type_name);
            setAss2Time(sourceData.ass2_time);
            if (typeof sourceData.ass2_src === "undefined") {
                setAss2Src("")
            } else {
                setAss2Src(sourceData.ass2_src);
            }
            setStu2A(scheduleData.ass2_stu_A_dispName);
            setAss2A(scheduleData.ass2_ass_A_dispName);
            setStu2B(scheduleData.ass2_stu_B_dispName);
            setAss2B(scheduleData.ass2_ass_B_dispName);
            setAss3Type(parseInt(sourceData.ass3_type, 10));
            setAss3TypeName(sourceData.ass3_type_name);
            setAss3Time(sourceData.ass3_time);
            if (typeof sourceData.ass3_src === "undefined") {
                setAss3Src("")
            } else {
                setAss3Src(sourceData.ass3_src);
            }
            setStu3A(scheduleData.ass3_stu_A_dispName);
            setAss3A(scheduleData.ass3_ass_A_dispName);
            setStu3B(scheduleData.ass3_stu_B_dispName);
            setAss3B(scheduleData.ass3_ass_B_dispName);
            setAss4Type(parseInt(sourceData.ass4_type, 10));
            setAss4TypeName(sourceData.ass4_type_name);
            setAss4Time(sourceData.ass4_time);
            if (typeof sourceData.ass4_src === "undefined") {
                setAss4Src("")
            } else {
                setAss4Src(sourceData.ass4_src);
            }
            setStu4A(scheduleData.ass4_stu_A_dispName);
            setAss4A(scheduleData.ass4_ass_A_dispName);
            setStu4B(scheduleData.ass4_stu_B_dispName);
            setAss4B(scheduleData.ass4_ass_B_dispName);
            setNoMeeting(scheduleData.noMeeting);
            setIsLoading(false);
        }
        setIsLoading(true);

        if (currentWeek !== "") {
            loadCurrentWeekData();
        }
    }, [t, currentWeek])

    useEffect( () => {
        var today = new Date();
        var day = today.getDay();
        var diff = today.getDate() - day + (day === 0 ? -6:1);
        var monDay = new Date(today.setDate(diff));
        setCurrentWeek(monDay);
    }, []);

    return (
        <Box
            sx={{
                paddingRight: '5px',
                width: {
                    xs: '100%',
                    lg: 'calc(100% - 400px)',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <IconButton onClick={handlePreviousWeek} disabled={disablePrevious} >
                    <SkipPreviousIcon sx={{fontSize: '40px'}} />
                </IconButton>
                <IconButton onClick={handleActiveWeek}>
                    <HomeIcon sx={{fontSize: '40px'}} />
                </IconButton>
                <IconButton onClick={handleNextWeek} disabled={disableNext} >
                    <SkipNextIcon sx={{fontSize: '40px'}} />
                </IconButton>
            </Box>

            <Typography variant="h6" align="center" sx={{lineHeight: 1.3}}>
                {t("home.currentSchedule", {currentWeek: fCurrentWeek})}
            </Typography>
            
            {isLoading && (
                <CircularProgress
                    color="secondary"
                    size={80}
                    disableShrink={true}
                    sx={{
                        display: 'flex',
                        margin: '20vh auto',
                    }}
                />
            )}
            {!isLoading && (
                <>
                    {noMeeting && (
                        <Container
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '60vh',
                            }}
                        >
                            <NoMeetingRoomIcon color="error" sx={{fontSize: '150px'}} />
                            <Typography variant="body1" align="center">
                                Tsy misy fivoriana amin’io herinandro io.
                            </Typography>
                        </Container>
                    )}
                    {!noMeeting && (
                        <>
                            <BoxMeetingPart className={"tgwPart"}>
                                <Typography variant="h6" sx={sharedStyles.typoLineHeight}>
                                    {t("global.treasuresPart")}
                                </Typography>
                            </BoxMeetingPart>
                            <BoxPartContainer>
                                <Grid item sx={classCount === 1 ? sharedStyles.studentPartWrapper1 : sharedStyles.studentPartWrapper2}>
                                    <TypoStudentPart variant="body1">
                                        {t("global.bibleReadingText")}
                                    </TypoStudentPart>
                                    <Typography variant="body1">
                                        {bibleReadingSrc}
                                    </Typography>
                                </Grid>
                                <Grid item sx={classCount === 1 ? sharedStyles.studentContainer1 : sharedStyles.studentContainer2}>
                                    <BoxStudentFldContainer>
                                        <TypoStudentField variant="body1">
                                            {stuBReadA}
                                        </TypoStudentField>           
                                    </BoxStudentFldContainer>
                                    {classCount === 2 && (
                                        <BoxStudentFldContainer>
                                            <TypoStudentField variant="body1">
                                                {stuBReadB}
                                            </TypoStudentField>       
                                        </BoxStudentFldContainer>
                                    )}                        
                                </Grid>
                            </BoxPartContainer>
                            <BoxMeetingPart className={"ayfPart"}>
                                <Typography variant="h6" sx={sharedStyles.typoLineHeight}>
                                    {t("global.applyFieldMinistryPart")}
                                </Typography>
                            </BoxMeetingPart>
                            {ass1Src && (
                                <BoxPartContainer>
                                    <Grid item sx={classCount === 1 ? sharedStyles.studentPartWrapper1 : sharedStyles.studentPartWrapper2}>
                                        {ass1Type !== 7 && (
                                            <TypoStudentPart variant="body1">
                                                {ass1TypeName} ({ass1Time} min.)
                                            </TypoStudentPart>
                                        )}
                                        <Typography variant="body1">
                                            {ass1Src}
                                        </Typography>
                                    </Grid>
                                    {((ass1Type !== 5) && (ass1Type !== 6) && (ass1Type !== 7)) && (
                                        <Grid item sx={classCount === 1 ? sharedStyles.studentContainer1 : sharedStyles.studentContainer2}>
                                            <BoxStudentAYF>
                                                <BoxStudentFldContainer>
                                                    <TypoStudentField variant="body1">
                                                        {stu1A}
                                                    </TypoStudentField>            
                                                </BoxStudentFldContainer>
                                                {ass1Type !== 4 && (
                                                    <BoxStudentFldContainer>
                                                        <TypoStudentField variant="body1">
                                                            {ass1A}
                                                        </TypoStudentField>
                                                    </BoxStudentFldContainer>
                                                )}
                                            </BoxStudentAYF>
                                            {classCount === 2 && (
                                                <BoxStudentAYF>
                                                    <BoxStudentFldContainer>
                                                        <TypoStudentField variant="body1">
                                                            {stu1B}
                                                        </TypoStudentField>
                                                    </BoxStudentFldContainer>
                                                    {ass1Type !== 4 && (
                                                        <BoxStudentFldContainer>
                                                            <TypoStudentField variant="body1">
                                                                {ass1B}
                                                            </TypoStudentField>       
                                                        </BoxStudentFldContainer>
                                                    )}
                                                </BoxStudentAYF>
                                            )}                        
                                        </Grid>
                                    )}
                                </BoxPartContainer>
                            )}
                            {ass2Src && (
                                <BoxPartContainer>
                                    <Grid item sx={classCount === 1 ? sharedStyles.studentPartWrapper1 : sharedStyles.studentPartWrapper2}>
                                        {ass2Type !== 7 && (
                                            <TypoStudentPart variant="body1">
                                                {ass2TypeName} ({ass2Time} min.)
                                            </TypoStudentPart>
                                        )}
                                        <Typography variant="body1">
                                            {ass2Src}
                                        </Typography>
                                    </Grid>
                                    {((ass2Type !== 5) && (ass2Type !== 6) && (ass2Type !== 7)) && (
                                        <Grid item sx={classCount === 1 ? sharedStyles.studentContainer1 : sharedStyles.studentContainer2}>
                                            <BoxStudentAYF>
                                                <BoxStudentFldContainer>
                                                    <TypoStudentField variant="body1">
                                                        {stu2A}
                                                    </TypoStudentField>            
                                                </BoxStudentFldContainer>
                                                {ass2Type !== 4 && (
                                                    <BoxStudentFldContainer>
                                                        <TypoStudentField variant="body1">
                                                            {ass2A}
                                                        </TypoStudentField>
                                                    </BoxStudentFldContainer>
                                                )}
                                            </BoxStudentAYF>
                                            {classCount === 2 && (
                                                <BoxStudentAYF>
                                                    <BoxStudentFldContainer>
                                                        <TypoStudentField variant="body1">
                                                            {stu2B}
                                                        </TypoStudentField>
                                                    </BoxStudentFldContainer>
                                                    {ass2Type !== 4 && (
                                                        <BoxStudentFldContainer>
                                                            <TypoStudentField variant="body1">
                                                                {ass2B}
                                                            </TypoStudentField>       
                                                        </BoxStudentFldContainer>
                                                    )}
                                                </BoxStudentAYF>
                                            )}                        
                                        </Grid>
                                    )}
                                </BoxPartContainer>
                            )}
                            {ass3Src && (
                                <BoxPartContainer>
                                    <Grid item sx={classCount === 1 ? sharedStyles.studentPartWrapper1 : sharedStyles.studentPartWrapper2}>
                                        {ass3Type !== 7 && (
                                            <TypoStudentPart variant="body1">
                                                {ass3TypeName} ({ass3Time} min.)
                                            </TypoStudentPart>
                                        )}
                                        <Typography variant="body1">
                                            {ass3Src}
                                        </Typography>
                                    </Grid>
                                    {((ass3Type !== 5) && (ass3Type !== 6) && (ass3Type !== 7)) && (
                                        <Grid item sx={classCount === 1 ? sharedStyles.studentContainer1 : sharedStyles.studentContainer2}>
                                            <BoxStudentAYF>
                                                <BoxStudentFldContainer>
                                                    <TypoStudentField variant="body1">
                                                        {stu3A}
                                                    </TypoStudentField>            
                                                </BoxStudentFldContainer>
                                                {ass3Type !== 4 && (
                                                    <BoxStudentFldContainer>
                                                        <TypoStudentField variant="body1">
                                                            {ass3A}
                                                        </TypoStudentField>
                                                    </BoxStudentFldContainer>
                                                )}
                                            </BoxStudentAYF>
                                            {classCount === 2 && (
                                                <BoxStudentAYF>
                                                    <BoxStudentFldContainer>
                                                        <TypoStudentField variant="body1">
                                                            {stu3B}
                                                        </TypoStudentField>
                                                    </BoxStudentFldContainer>
                                                    {ass3Type !== 4 && (
                                                        <BoxStudentFldContainer>
                                                            <TypoStudentField variant="body1">
                                                                {ass3B}
                                                            </TypoStudentField>       
                                                        </BoxStudentFldContainer>
                                                    )}
                                                </BoxStudentAYF>
                                            )}                        
                                        </Grid>
                                    )}
                                </BoxPartContainer>
                            )}
                            {ass4Src && (
                                <BoxPartContainer>
                                    <Grid item sx={classCount === 1 ? sharedStyles.studentPartWrapper1 : sharedStyles.studentPartWrapper2}>
                                        {ass4Type !== 7 && (
                                            <TypoStudentPart variant="body1">
                                                {ass4TypeName} ({ass4Time} min.)
                                            </TypoStudentPart>
                                        )}
                                        <Typography variant="body1">
                                            {ass4Src}
                                        </Typography>
                                    </Grid>
                                    {((ass4Type !== 5) && (ass4Type !== 6) && (ass4Type !== 7)) && (
                                        <Grid item sx={classCount === 1 ? sharedStyles.studentContainer1 : sharedStyles.studentContainer2}>
                                            <BoxStudentAYF>
                                                <BoxStudentFldContainer>
                                                    <TypoStudentField variant="body1">
                                                        {stu4A}
                                                    </TypoStudentField>            
                                                </BoxStudentFldContainer>
                                                {ass4Type !== 4 && (
                                                    <BoxStudentFldContainer>
                                                        <TypoStudentField variant="body1">
                                                            {ass4A}
                                                        </TypoStudentField>
                                                    </BoxStudentFldContainer>
                                                )}
                                            </BoxStudentAYF>
                                            {classCount === 2 && (
                                                <BoxStudentAYF>
                                                    <BoxStudentFldContainer>
                                                        <TypoStudentField variant="body1">
                                                            {stu4B}
                                                        </TypoStudentField>
                                                    </BoxStudentFldContainer>
                                                    {ass4Type !== 4 && (
                                                        <BoxStudentFldContainer>
                                                            <TypoStudentField variant="body1">
                                                                {ass4B}
                                                            </TypoStudentField>       
                                                        </BoxStudentFldContainer>
                                                    )}
                                                </BoxStudentAYF>
                                            )}                        
                                        </Grid>
                                    )}
                                </BoxPartContainer>
                            )}
                        </>
                    )}
                </>
            )}
        </Box>
    )
}

export default Home;