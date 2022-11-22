import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import dateFormat from 'dateformat';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { ScheduleAYF, StudentSelector } from '../features/schedules';
import { dbSaveAss } from '../indexedDb/dbAssignment';
import { isReloadScheduleState } from '../states/schedule';
import { classCountState } from '../states/congregation';
import { dbGetSourceMaterial } from '../indexedDb/dbSourceMaterial';
import { dbGetScheduleData } from '../indexedDb/dbSchedule';
import { monthNamesState, shortDateFormatState } from '../states/main';
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

const ScheduleWeekDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { schedule, weekToFormat } = useParams();

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
  const [isChairmanA, setIsChairmanA] = useState(false);
  const [chairmanB, setChairmanB] = useState('');
  const [isChairmanB, setIsChairmanB] = useState(false);
  const [openingPrayer, setOpeningPrayer] = useState('');
  const [isOpeningPrayer, setIsOpeningPrayer] = useState(false);
  const [tgwTalk, setTgwTalk] = useState('');
  const [isTgwTalk, setIsTgwTalk] = useState(false);
  const [tgwGems, setTgwGems] = useState('');
  const [isTgwGems, setIsTgwGems] = useState(false);
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
  const [lcPart1, setLcPart1] = useState('');
  const [isLcPart1, setIsLcPart1] = useState(false);
  const [lcPart2, setLcPart2] = useState('');
  const [isLcPart2, setIsLcPart2] = useState(false);
  const [cbsConductor, setCbsConductor] = useState('');
  const [isCbsConductor, setIsCbsCondcutor] = useState(false);
  const [cbsReader, setCbsReader] = useState('');
  const [isCbsReader, setIsCbsReader] = useState(false);
  const [closingPrayer, setClosingPrayer] = useState('');
  const [isClosingPrayer, setIsClosingPrayer] = useState(false);
  const [weekType, setWeekType] = useState(1);
  const [isAssign, setIsAssign] = useState(false);
  const [assInfo, setAssInfo] = useState({});
  const [isDlgOpen, setIsDlgOpen] = useState(false);

  const [isReload, setIsReload] = useRecoilState(isReloadScheduleState);

  const classCount = useRecoilValue(classCountState);
  const monthNames = useRecoilValue(monthNamesState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);
  const themeOptions = useRecoilValue(themeOptionsState);

  const scheduleFormatted = schedule.replace('-', '/');
  const monthIndex = parseInt(scheduleFormatted.split('/')[0], 10);
  const scheduleName = `${monthNames[monthIndex - 1]} ${scheduleFormatted.split('/')[1]}`;

  const week = weekToFormat.replaceAll('-', '/');
  const weekFormatted = dateFormat(new Date(week), shortDateFormat);

  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'), { noSsr: true });

  const handleNavigateSchedule = () => {
    navigate(`/schedules/${schedule}`);
  };

  const loadStudentPicker = (obj) => {
    const args = { ...obj, isAssign: true };
    setAssInfo(args);
    setIsAssign(true);
    setIsDlgOpen(true);
  };

  const handleDlgClose = () => {
    setIsAssign(false);
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
    } else if (assID === 18) {
      setIsChairmanA(true);
      await dbSaveAss(week, studentID, 'chairmanMM_A');
      setChairmanA(studentName);
      setIsChairmanA(false);
    } else if (assID === 19) {
      setIsChairmanB(true);
      await dbSaveAss(week, studentID, 'chairmanMM_B');
      setChairmanB(studentName);
      setIsChairmanB(false);
    } else if (assID === 20) {
      setIsOpeningPrayer(true);
      await dbSaveAss(week, studentID, 'opening_prayer');
      setOpeningPrayer(studentName);
      setIsOpeningPrayer(false);
    } else if (assID === 21) {
      setIsTgwTalk(true);
      await dbSaveAss(week, studentID, 'tgw_talk');
      setTgwTalk(studentName);
      setIsTgwTalk(false);
    } else if (assID === 22) {
      setIsTgwGems(true);
      await dbSaveAss(week, studentID, 'tgw_gems');
      setTgwGems(studentName);
      setIsTgwGems(false);
    } else if (assID === 23) {
      setIsLcPart1(true);
      await dbSaveAss(week, studentID, 'lc_part1');
      setLcPart1(studentName);
      setIsLcPart1(false);
    } else if (assID === 24) {
      setIsLcPart2(true);
      await dbSaveAss(week, studentID, 'lc_part2');
      setLcPart2(studentName);
      setIsLcPart2(false);
    } else if (assID === 25) {
      setIsCbsCondcutor(true);
      await dbSaveAss(week, studentID, 'cbs_conductor');
      setCbsConductor(studentName);
      setIsCbsCondcutor(false);
    } else if (assID === 26) {
      setIsCbsReader(true);
      await dbSaveAss(week, studentID, 'cbs_reader');
      setCbsReader(studentName);
      setIsCbsReader(false);
    } else if (assID === 27) {
      setIsClosingPrayer(true);
      await dbSaveAss(week, studentID, 'closing_prayer');
      setClosingPrayer(studentName);
      setIsClosingPrayer(false);
    }
  };

  useEffect(() => {
    const loadCurrentWeekData = async () => {
      const scheduleData = await dbGetScheduleData(week);
      const sourceData = await dbGetSourceMaterial(week);

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
    };

    if (week !== '' || isReload) {
      loadCurrentWeekData();
      setIsReload(false);
    }
  }, [t, week, isReload, setIsReload]);

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
        <NoMeetingRoomIcon color="error" sx={{ fontSize: '150px' }} />
        <Typography variant="body1" align="center">
          {t('global.noMidweekMeeting')}
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton onClick={handleNavigateSchedule}>
          <ArrowBackIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          {`${t('dashboard.schedule')} > ${scheduleName} > ${weekFormatted}`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {isAssign && (
          <Dialog open={mdDown ? isDlgOpen : false} onClose={handleDlgClose} aria-labelledby="dialog-title">
            <DialogTitle id="dialog-title" sx={sharedStyles.pickerDlgTitleContainer}>
              <Box sx={sharedStyles.pickerDlgTitleSub}>
                <Typography sx={sharedStyles.pickerDlgTitleText}>{t('schedule.assignStudent')}</Typography>
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
                  {isChairmanA && (
                    <CircularProgress
                      sx={sharedStyles.fieldBtnContainer}
                      color="secondary"
                      size={26}
                      disableShrink={true}
                    />
                  )}
                  {!isChairmanA && (
                    <IconButton
                      sx={iconButtonContainer}
                      onClick={() =>
                        loadStudentPicker({
                          assID: 18,
                          assType: 110,
                          assTypeName: t('global.chairmanMidweekMeeting'),
                          currentStudent: chairmanA,
                        })
                      }
                    >
                      <EditIcon sx={editIconButton} />
                    </IconButton>
                  )}
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
                    {isChairmanB && (
                      <CircularProgress
                        sx={sharedStyles.fieldBtnContainer}
                        color="secondary"
                        size={26}
                        disableShrink={true}
                      />
                    )}
                    {!isChairmanB && (
                      <IconButton
                        sx={iconButtonContainer}
                        onClick={() =>
                          loadStudentPicker({
                            assID: 19,
                            assType: 110,
                            assTypeName: t('global.auxClassCounselor'),
                            currentStudent: chairmanB,
                          })
                        }
                      >
                        <EditIcon sx={editIconButton} />
                      </IconButton>
                    )}
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
                {isOpeningPrayer && (
                  <CircularProgress
                    sx={sharedStyles.fieldBtnContainer}
                    color="secondary"
                    size={26}
                    disableShrink={true}
                  />
                )}
                {!isOpeningPrayer && (
                  <IconButton
                    sx={iconButtonContainer}
                    onClick={() =>
                      loadStudentPicker({
                        assID: 20,
                        assType: 111,
                        assTypeName: t('global.prayerMidweekMeeting'),
                        currentStudent: openingPrayer,
                      })
                    }
                  >
                    <EditIcon sx={editIconButton} />
                  </IconButton>
                )}
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
                {isTgwTalk && (
                  <CircularProgress
                    sx={sharedStyles.fieldBtnContainer}
                    color="secondary"
                    size={26}
                    disableShrink={true}
                  />
                )}
                {!isTgwTalk && (
                  <IconButton
                    sx={iconButtonContainer}
                    onClick={() =>
                      loadStudentPicker({
                        assID: 21,
                        assType: 112,
                        assTypeName: t('global.tgwTalk'),
                        currentStudent: tgwTalk,
                      })
                    }
                  >
                    <EditIcon sx={editIconButton} />
                  </IconButton>
                )}
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
                {isTgwGems && (
                  <CircularProgress
                    sx={sharedStyles.fieldBtnContainer}
                    color="secondary"
                    size={26}
                    disableShrink={true}
                  />
                )}
                {!isTgwGems && (
                  <IconButton
                    sx={iconButtonContainer}
                    onClick={() =>
                      loadStudentPicker({
                        assID: 22,
                        assType: 113,
                        assTypeName: t('global.tgwGems'),
                        currentStudent: tgwGems,
                      })
                    }
                  >
                    <EditIcon sx={editIconButton} />
                  </IconButton>
                )}
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
                {isStuBReadA && (
                  <CircularProgress
                    sx={sharedStyles.fieldBtnContainer}
                    color="secondary"
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
                  <Typography
                    sx={{
                      ...typoStudentField,
                      backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                    }}
                    variant="body1"
                  >
                    {stuBReadB}
                  </Typography>
                  {isStuBReadB && (
                    <CircularProgress
                      sx={sharedStyles.fieldBtnContainer}
                      color="secondary"
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
                {isLcPart1 && (
                  <CircularProgress
                    sx={sharedStyles.fieldBtnContainer}
                    color="secondary"
                    size={26}
                    disableShrink={true}
                  />
                )}
                {!isLcPart1 && (
                  <IconButton
                    sx={iconButtonContainer}
                    onClick={() =>
                      loadStudentPicker({
                        assID: 23,
                        assType: 114,
                        assTypeName: t('global.lcPart'),
                        currentStudent: lcPart1,
                      })
                    }
                  >
                    <EditIcon sx={editIconButton} />
                  </IconButton>
                )}
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
                  {isLcPart2 && (
                    <CircularProgress
                      sx={sharedStyles.fieldBtnContainer}
                      color="secondary"
                      size={26}
                      disableShrink={true}
                    />
                  )}
                  {!isLcPart2 && (
                    <IconButton
                      sx={iconButtonContainer}
                      onClick={() =>
                        loadStudentPicker({
                          assID: 24,
                          assType: 114,
                          assTypeName: t('global.lcPart'),
                          currentStudent: lcPart2,
                        })
                      }
                    >
                      <EditIcon sx={editIconButton} />
                    </IconButton>
                  )}
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
              <Grid item sx={classCount === 1 ? sharedStyles.studentPartWrapper1 : sharedStyles.studentPartWrapper2}>
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
                  {isCbsConductor && (
                    <CircularProgress
                      sx={sharedStyles.fieldBtnContainer}
                      color="secondary"
                      size={26}
                      disableShrink={true}
                    />
                  )}
                  {!isCbsConductor && (
                    <IconButton
                      sx={iconButtonContainer}
                      onClick={() =>
                        loadStudentPicker({
                          assID: 25,
                          assType: 115,
                          assTypeName: t('global.cbsConductor'),
                          currentStudent: cbsConductor,
                        })
                      }
                    >
                      <EditIcon sx={editIconButton} />
                    </IconButton>
                  )}
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
                  {isCbsReader && (
                    <CircularProgress
                      sx={sharedStyles.fieldBtnContainer}
                      color="secondary"
                      size={26}
                      disableShrink={true}
                    />
                  )}
                  {!isCbsReader && (
                    <IconButton
                      sx={iconButtonContainer}
                      onClick={() =>
                        loadStudentPicker({
                          assID: 26,
                          assType: 116,
                          assTypeName: t('global.cbsReader'),
                          currentStudent: cbsReader,
                        })
                      }
                    >
                      <EditIcon sx={editIconButton} />
                    </IconButton>
                  )}
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
                {isClosingPrayer && (
                  <CircularProgress
                    sx={sharedStyles.fieldBtnContainer}
                    color="secondary"
                    size={26}
                    disableShrink={true}
                  />
                )}
                {!isClosingPrayer && (
                  <IconButton
                    sx={iconButtonContainer}
                    onClick={() =>
                      loadStudentPicker({
                        assID: 27,
                        assType: 111,
                        assTypeName: t('global.prayerMidweekMeeting'),
                        currentStudent: closingPrayer,
                      })
                    }
                  >
                    <EditIcon sx={editIconButton} />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
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
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ScheduleWeekDetails;
