import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import dateFormat from 'dateformat';
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
import { ScheduleAYF } from '../features/schedules';
import { classCountState } from '../states/congregation';
import { dbGetSourceMaterial, dbIsWeekExist } from '../indexedDb/dbSourceMaterial';
import { dbGetScheduleData } from '../indexedDb/dbSchedule';
import { shortDateFormatState } from '../states/main';
import { themeOptionsState } from '../states/theme';

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
    gap: '5px',
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
  margin: '20px 0',
};

const typoStudentField = {
  height: '25px',
  lineHeight: '25px',
  width: '165px',
  padding: '2px 2px 2px 5px',
  borderRadius: 5,
  fontWeight: 'bold',
};

const boxStudentFldContainer = {
  display: 'flex',
  marginRight: '5px',
  alignItems: 'flex-end',
};

const WeeklyAssignments = () => {
  const { t } = useTranslation();

  const theme = useTheme();

  const [tgwTalkSrc, setTgwTalkSrc] = useState('');
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
  const [lcCount, setLcCount] = useState(1);
  const [lcPart1Time, setLcPart1Time] = useState('');
  const [lcPart1Src, setLcPart1Src] = useState('');
  const [lcPart2Time, setLcPart2Time] = useState('');
  const [lcPart2Src, setLcPart2Src] = useState('');
  const [cbsSrc, setCbsSrc] = useState('');
  const [noMeeting, setNoMeeting] = useState(false);
  const [chairmanA, setChairmanA] = useState('');
  const [chairmanB, setChairmanB] = useState('');
  const [openingPrayer, setOpeningPrayer] = useState('');
  const [tgwTalk, setTgwTalk] = useState('');
  const [tgwGems, setTgwGems] = useState('');
  const [stuBReadA, setStuBReadA] = useState('');
  const [stuBReadB, setStuBReadB] = useState('');
  const [stu1A, setStu1A] = useState('');
  const [ass1A, setAss1A] = useState('');
  const [stu1B, setStu1B] = useState('');
  const [ass1B, setAss1B] = useState('');
  const [stu2A, setStu2A] = useState('');
  const [ass2A, setAss2A] = useState('');
  const [stu2B, setStu2B] = useState('');
  const [ass2B, setAss2B] = useState('');
  const [stu3A, setStu3A] = useState('');
  const [ass3A, setAss3A] = useState('');
  const [stu3B, setStu3B] = useState('');
  const [ass3B, setAss3B] = useState('');
  const [stu4A, setStu4A] = useState('');
  const [ass4A, setAss4A] = useState('');
  const [stu4B, setStu4B] = useState('');
  const [ass4B, setAss4B] = useState('');
  const [lcPart1, setLcPart1] = useState('');
  const [lcPart2, setLcPart2] = useState('');
  const [cbsConductor, setCbsConductor] = useState('');
  const [cbsReader, setCbsReader] = useState('');
  const [closingPrayer, setClosingPrayer] = useState('');
  const [weekType, setWeekType] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState('');
  const [fCurrentWeek, setFCurrentWeek] = useState('');
  const [previousWeek, setPreviousWeek] = useState('');
  const [nextWeek, setNextWeek] = useState('');
  const [disablePrevious, setDisablePrevious] = useState(false);
  const [disableNext, setDisableNext] = useState(false);

  const classCount = useRecoilValue(classCountState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);
  const themeOptions = useRecoilValue(themeOptionsState);

  const handleActiveWeek = () => {
    var today = new Date();
    var day = today.getDay();
    var diff = today.getDate() - day + (day === 0 ? -6 : 1);
    var monDay = new Date(today.setDate(diff));
    setCurrentWeek(monDay);
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(previousWeek);
  };

  const handleNextWeek = () => {
    setCurrentWeek(nextWeek);
  };

  useEffect(() => {
    const loadCurrentWeekData = async () => {
      var result = new Date(currentWeek);
      result.setDate(currentWeek.getDate() - 7);
      let previousWeek = dateFormat(result, 'mm/dd/yyyy');

      let hasPrevious = await dbIsWeekExist(previousWeek);

      if (!hasPrevious) {
        result.setDate(result.getDate() - 7);
        previousWeek = dateFormat(result, 'mm/dd/yyyy');
        hasPrevious = await dbIsWeekExist(previousWeek);
        setDisablePrevious(!hasPrevious);
      }

      setPreviousWeek(result);

      result = new Date(currentWeek);
      result.setDate(currentWeek.getDate() + 7);
      let nextWeek = dateFormat(result, 'mm/dd/yyyy');

      let hasNext = await dbIsWeekExist(nextWeek);
      if (!hasNext) {
        result.setDate(result.getDate() + 7);
        nextWeek = dateFormat(result, 'mm/dd/yyyy');
        hasNext = await dbIsWeekExist(nextWeek);
        setDisableNext(!hasNext);
      }

      setNextWeek(result);

      const weekValue = dateFormat(currentWeek, 'mm/dd/yyyy');
      const weekValueFormatted = dateFormat(weekValue, shortDateFormat);
      setFCurrentWeek(weekValueFormatted);

      const scheduleData = await dbGetScheduleData(weekValue);
      const sourceData = await dbGetSourceMaterial(weekValue);

      setChairmanA(scheduleData.chairmanMM_A_dispName);
      setChairmanB(scheduleData.chairmanMM_B_dispName);
      setOpeningPrayer(scheduleData.opening_prayer_dispName);
      setTgwTalkSrc(sourceData.tgwTalk_src);
      setTgwTalk(scheduleData.tgw_talk_dispName);
      setTgwGems(scheduleData.tgw_gems_dispName);
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
      setLcCount(sourceData.lcCount);
      setLcPart1Time(sourceData.lcPart1_time);
      setLcPart1Src(sourceData.lcPart1_src);
      setLcPart1(scheduleData.lc_part1_dispName);
      setLcPart2Time(sourceData.lcPart2_time);
      setLcPart2Src(sourceData.lcPart2_src);
      setLcPart2(scheduleData.lc_part2_dispName);
      setCbsSrc(sourceData.cbs_src);
      setCbsConductor(scheduleData.cbs_conductor_dispName);
      setCbsReader(scheduleData.cbs_reader_dispName);
      setClosingPrayer(scheduleData.closing_prayer_dispName);
      setWeekType(scheduleData.week_type);
      setNoMeeting(scheduleData.noMeeting);
      setIsLoading(false);
    };
    setIsLoading(true);

    if (currentWeek !== '') {
      loadCurrentWeekData();
    }
  }, [shortDateFormat, currentWeek]);

  useEffect(() => {
    var today = new Date();
    var day = today.getDay();
    var diff = today.getDate() - day + (day === 0 ? -6 : 1);
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
        <IconButton onClick={handlePreviousWeek} disabled={disablePrevious}>
          <SkipPreviousIcon sx={{ fontSize: '40px' }} />
        </IconButton>
        <IconButton onClick={handleActiveWeek}>
          <HomeIcon sx={{ fontSize: '40px' }} />
        </IconButton>
        <IconButton onClick={handleNextWeek} disabled={disableNext}>
          <SkipNextIcon sx={{ fontSize: '40px' }} />
        </IconButton>
      </Box>

      <Typography variant="h6" align="center" sx={{ lineHeight: 1.3 }}>
        {t('home.currentSchedule', { currentWeek: fCurrentWeek })}
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
              <NoMeetingRoomIcon color="error" sx={{ fontSize: '150px' }} />
              <Typography variant="body1" align="center">
                Tsy misy fivoriana amin’io herinandro io.
              </Typography>
            </Container>
          )}
          {!noMeeting && (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>
                      {t('global.chairmanMidweekMeeting')}
                    </Typography>
                    <Box sx={boxStudentFldContainer}>
                      <Typography
                        sx={{
                          ...typoStudentField,
                          backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                        }}
                        variant="body1"
                      >
                        {chairmanA}
                      </Typography>
                    </Box>
                  </Box>
                  {classCount === 2 && weekType === 1 && (
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>
                        {t('global.auxClassCounselor')}
                      </Typography>
                      <Box sx={boxStudentFldContainer}>
                        <Typography
                          sx={{
                            ...typoStudentField,
                            backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                          }}
                          variant="body1"
                        >
                          {chairmanB}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>
                    {t('global.prayerMidweekMeeting')}
                  </Typography>
                  <Box sx={boxStudentFldContainer}>
                    <Typography
                      sx={{
                        ...typoStudentField,
                        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                      }}
                      variant="body1"
                    >
                      {openingPrayer}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={boxMeetingPart} className={'tgwPart'}>
                <Typography variant="h6">{t('global.treasuresPart')}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <Grid item sx={sharedStyles.studentPartWrapper1}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                    {tgwTalkSrc}
                  </Typography>
                </Grid>
                <Grid item sx={sharedStyles.studentContainer1}>
                  <Box sx={boxStudentFldContainer}>
                    <Typography
                      sx={{
                        ...typoStudentField,
                        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                      }}
                      variant="body1"
                    >
                      {tgwTalk}
                    </Typography>
                  </Box>
                </Grid>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <Grid item sx={sharedStyles.studentPartWrapper1}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                    {t('global.tgwGems')}
                  </Typography>
                </Grid>
                <Grid item sx={sharedStyles.studentContainer1}>
                  <Box sx={boxStudentFldContainer}>
                    <Typography
                      sx={{
                        ...typoStudentField,
                        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                      }}
                      variant="body1"
                    >
                      {tgwGems}
                    </Typography>
                  </Box>
                </Grid>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <Grid item sx={classCount === 1 ? sharedStyles.studentPartWrapper1 : sharedStyles.studentPartWrapper2}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}
                  >
                    {t('global.bibleReadingText')}
                  </Typography>
                  <Typography variant="body1">{bibleReadingSrc}</Typography>
                </Grid>
                <Grid item sx={classCount === 1 ? sharedStyles.studentContainer1 : sharedStyles.studentContainer2}>
                  <Box sx={boxStudentFldContainer}>
                    <Typography
                      sx={{
                        ...typoStudentField,
                        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                      }}
                      variant="body1"
                    >
                      {stuBReadA}
                    </Typography>
                  </Box>
                  {classCount === 2 && (
                    <Box sx={boxStudentFldContainer}>
                      <Typography
                        sx={{
                          ...typoStudentField,
                          backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                        }}
                        variant="body1"
                      >
                        {stuBReadB}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Box>
              <Box sx={boxMeetingPart} className="ayfPart">
                <Typography variant="h6">{t('global.applyFieldMinistryPart')}</Typography>
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
                }}
                readOnly={true}
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
                  }}
                  readOnly={true}
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
                  }}
                  readOnly={true}
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
                  }}
                  readOnly={true}
                />
              )}
              <Box sx={boxMeetingPart} className="lcPart">
                <Typography variant="h6">{t('global.livingPart')}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <Grid item sx={sharedStyles.studentPartWrapper1}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                    {`(${lcPart1Time} min.) ${lcPart1Src}`}
                  </Typography>
                </Grid>
                <Grid item sx={sharedStyles.studentContainer1}>
                  <Box sx={boxStudentFldContainer}>
                    <Typography
                      sx={{
                        ...typoStudentField,
                        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                      }}
                      variant="body1"
                    >
                      {lcPart1}
                    </Typography>
                  </Box>
                </Grid>
              </Box>
              {lcCount > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <Grid item sx={sharedStyles.studentPartWrapper1}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                      {`(${lcPart2Time} min.) ${lcPart2Src}`}
                    </Typography>
                  </Grid>
                  <Grid item sx={sharedStyles.studentContainer1}>
                    <Box sx={boxStudentFldContainer}>
                      <Typography
                        sx={{
                          ...typoStudentField,
                          backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                        }}
                        variant="body1"
                      >
                        {lcPart2}
                      </Typography>
                    </Box>
                  </Grid>
                </Box>
              )}
              {weekType === 1 && (
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
                    sx={classCount === 1 ? sharedStyles.studentPartWrapper1 : sharedStyles.studentPartWrapper2}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      {t('global.cbs')}
                    </Typography>
                    <Typography variant="body1">{cbsSrc}</Typography>
                  </Grid>
                  <Grid item sx={sharedStyles.studentContainer2}>
                    <Box sx={boxStudentFldContainer}>
                      <Typography
                        sx={{
                          ...typoStudentField,
                          backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                        }}
                        variant="body1"
                      >
                        {cbsConductor}
                      </Typography>
                    </Box>
                    <Box sx={boxStudentFldContainer}>
                      <Typography
                        sx={{
                          ...typoStudentField,
                          backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                        }}
                        variant="body1"
                      >
                        {cbsReader}
                      </Typography>
                    </Box>
                  </Grid>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>
                    {t('global.prayerMidweekMeeting')}
                  </Typography>
                  <Box sx={boxStudentFldContainer}>
                    <Typography
                      sx={{
                        ...typoStudentField,
                        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                      }}
                      variant="body1"
                    >
                      {closingPrayer}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default WeeklyAssignments;
