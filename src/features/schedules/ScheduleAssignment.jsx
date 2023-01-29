import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ScheduleMeetingPart from './ScheduleMeetingPart';
import ScheduleRowAssignment from './ScheduleRowAssignment';
import SingleAssignment from './SingleAssignment';
import StudentSelector from './StudentSelector';
import { classCountState } from '../../states/congregation';
import { dbGetScheduleData } from '../../indexedDb/dbSchedule';
import { dbGetSourceMaterial } from '../../indexedDb/dbSourceMaterial';
import { dbSaveAss } from '../../indexedDb/dbAssignment';

const ScheduleAssignment = ({ edit }) => {
  const { weekToFormat } = useParams();

  const { t } = useTranslation('ui');

  const classCount = useRecoilValue(classCountState);

  const theme = useTheme();
  const lgDown = useMediaQuery(theme.breakpoints.down('lg'), { noSsr: true });

  const [tgwTalkSrc, setTgwTalkSrc] = useState('');
  const [bibleReadingSrc, setBibleReadingSrc] = useState('');
  const [bibleReadingStudy, setBibleReadingStudy] = useState('');
  const [ass1Type, setAss1Type] = useState('');
  const [ass1TypeName, setAss1TypeName] = useState('');
  const [ass1Time, setAss1Time] = useState('');
  const [ass1Study, setAss1Study] = useState('');
  const [ass1Src, setAss1Src] = useState('');
  const [ass2Type, setAss2Type] = useState('');
  const [ass2TypeName, setAss2TypeName] = useState('');
  const [ass2Time, setAss2Time] = useState('');
  const [ass2Study, setAss2Study] = useState('');
  const [ass2Src, setAss2Src] = useState('');
  const [ass3Type, setAss3Type] = useState('');
  const [ass3TypeName, setAss3TypeName] = useState('');
  const [ass3Time, setAss3Time] = useState('');
  const [ass3Study, setAss3Study] = useState('');
  const [ass3Src, setAss3Src] = useState('');
  const [ass4Type, setAss4Type] = useState('');
  const [ass4TypeName, setAss4TypeName] = useState('');
  const [ass4Time, setAss4Time] = useState('');
  const [ass4Study, setAss4Study] = useState('');
  const [ass4Src, setAss4Src] = useState('');
  const [lcCount, setLcCount] = useState(1);
  const [lcPart1Time, setLcPart1Time] = useState('');
  const [lcPart1Src, setLcPart1Src] = useState('');
  const [lcPart1Content, setLcPart1Content] = useState('');
  const [lcPart2Time, setLcPart2Time] = useState('');
  const [lcPart2Src, setLcPart2Src] = useState('');
  const [lcPart2Content, setLcPart2Content] = useState('');
  const [cbsSrc, setCbsSrc] = useState('');
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

  const week = weekToFormat.replaceAll('-', '/');

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
    const obj = {};
    obj.assID = assID;
    obj.assType = '';
    obj.studentId = undefined;
    obj.studentName = '';
    await setSelectedStudent(obj);
  };

  const setSelectedStudent = async (selectedStudent) => {
    const assID = selectedStudent.assID;
    let studentID = undefined;
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
      setBibleReadingStudy(sourceData.bibleReading_study);
      setStuBReadA(scheduleData.bRead_stu_A_dispName);
      setStuBReadB(scheduleData.bRead_stu_B_dispName);
      setAss1Type(sourceData.ass1_type);
      setAss1TypeName(sourceData.ass1_type_name);
      setAss1Time(sourceData.ass1_time);
      setAss1Study(sourceData.ass1_study);
      setAss1Src(sourceData.ass1_src);
      setStu1A(scheduleData.ass1_stu_A_dispName);
      setAss1A(scheduleData.ass1_ass_A_dispName);
      setStu1B(scheduleData.ass1_stu_B_dispName);
      setAss1B(scheduleData.ass1_ass_B_dispName);
      setAss2Type(sourceData.ass2_type);
      setAss2TypeName(sourceData.ass2_type_name);
      setAss2Time(sourceData.ass2_time);
      setAss2Study(sourceData.ass2_study);
      setAss2Src(sourceData.ass2_src);
      setStu2A(scheduleData.ass2_stu_A_dispName);
      setAss2A(scheduleData.ass2_ass_A_dispName);
      setStu2B(scheduleData.ass2_stu_B_dispName);
      setAss2B(scheduleData.ass2_ass_B_dispName);
      setAss3Type(sourceData.ass3_type);
      setAss3TypeName(sourceData.ass3_type_name);
      setAss3Time(sourceData.ass3_time);
      setAss3Study(sourceData.ass3_study);
      setAss3Src(sourceData.ass3_src);
      setStu3A(scheduleData.ass3_stu_A_dispName);
      setAss3A(scheduleData.ass3_ass_A_dispName);
      setStu3B(scheduleData.ass3_stu_B_dispName);
      setAss3B(scheduleData.ass3_ass_B_dispName);
      setAss4Type(sourceData.ass4_type);
      setAss4TypeName(sourceData.ass4_type_name);
      setAss4Time(sourceData.ass4_time);
      setAss4Study(sourceData.ass4_study);
      setAss4Src(sourceData.ass4_src);
      setStu4A(scheduleData.ass4_stu_A_dispName);
      setAss4A(scheduleData.ass4_ass_A_dispName);
      setStu4B(scheduleData.ass4_stu_B_dispName);
      setAss4B(scheduleData.ass4_ass_B_dispName);
      setLcCount(sourceData.lcCount);
      setLcPart1Time(sourceData.lcPart1_time);
      setLcPart1Src(sourceData.lcPart1_src);
      setLcPart1Content(sourceData.lcPart1_content);
      setLcPart1(scheduleData.lc_part1_dispName);
      setLcPart2Time(sourceData.lcPart2_time);
      setLcPart2Src(sourceData.lcPart2_src);
      setLcPart2Content(sourceData.lcPart2_content);
      setLcPart2(scheduleData.lc_part2_dispName);
      setCbsSrc(sourceData.cbs_src);
      setCbsConductor(scheduleData.cbs_conductor_dispName);
      setCbsReader(scheduleData.cbs_reader_dispName);
      setClosingPrayer(scheduleData.closing_prayer_dispName);
      setWeekType(scheduleData.week_type);
    };

    if (week !== '') {
      loadCurrentWeekData();
    }
  }, [t, week]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
      }}
    >
      {edit && isAssign && (
        <Dialog open={lgDown ? isDlgOpen : false} onClose={handleDlgClose} aria-labelledby="dialog-title">
          <DialogTitle id="dialog-title" sx={{ padding: '5px 10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 'bold' }}>{t('assignStudent')}</Typography>
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

      <Box
        sx={{
          overflow: { xs: 'none', lg: edit ? 'auto' : 'none' },
          width: { xs: '100%', lg: edit ? 'calc(100% - 400px)' : '100%' },
          height: { xs: 'auto', lg: edit ? '77vh' : 'auto' },
          paddingRight: { xs: 0, lg: edit ? '5px' : 0 },
        }}
      >
        {/* Intro Parts */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {/* Chairman */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Chairman A */}
            <SingleAssignment
              edit={edit}
              header={t('chairmanMidweekMeeting')}
              isAssign={isChairmanA}
              person={chairmanA}
              loadStudentPicker={() =>
                loadStudentPicker({
                  assID: 18,
                  assType: 110,
                  assTypeName: t('chairmanMidweekMeeting'),
                  currentStudent: chairmanA,
                })
              }
            />
            {/* Chairman B */}
            {classCount === 2 && weekType === 1 && (
              <SingleAssignment
                edit={edit}
                header={t('auxClassCounselor')}
                isAssign={isChairmanB}
                person={chairmanB}
                loadStudentPicker={() =>
                  loadStudentPicker({
                    assID: 19,
                    assType: 110,
                    assTypeName: t('auxClassCounselor'),
                    currentStudent: chairmanB,
                  })
                }
              />
            )}
          </Box>

          {/* Opening Prayer */}
          <SingleAssignment
            edit={edit}
            header={t('prayerMidweekMeeting')}
            isAssign={isOpeningPrayer}
            person={openingPrayer}
            loadStudentPicker={() =>
              loadStudentPicker({
                assID: 20,
                assType: 111,
                assTypeName: t('prayerMidweekMeeting'),
                currentStudent: openingPrayer,
              })
            }
          />
        </Box>

        {/* TGW */}
        <ScheduleMeetingPart type="tgwPart" part={t('treasuresPart')} />

        {/* TGW Talk */}
        <ScheduleRowAssignment
          edit={edit}
          isAssignA={isTgwTalk}
          personA={tgwTalk}
          source={tgwTalkSrc}
          loadStudentPickerA={() =>
            loadStudentPicker({
              assID: 21,
              assType: 112,
              assTypeName: t('tgwTalk'),
              currentStudent: tgwTalk,
            })
          }
        />

        {/* TGW Gems */}
        <ScheduleRowAssignment
          edit={edit}
          isAssignA={isTgwGems}
          personA={tgwGems}
          source={t('tgwGems')}
          loadStudentPickerA={() =>
            loadStudentPicker({
              assID: 22,
              assType: 113,
              assTypeName: t('tgwGems'),
              currentStudent: tgwGems,
            })
          }
        />

        {/* Bible Reading */}
        <ScheduleRowAssignment
          edit={edit}
          isAssignA={isStuBReadA}
          personA={stuBReadA}
          isAssignB={isStuBReadB}
          personB={stuBReadB}
          source={t('bibleReadingText')}
          student={true}
          studentPart={`${bibleReadingSrc}${
            bibleReadingStudy && bibleReadingStudy !== '' ? ` [${bibleReadingStudy}]` : ''
          }`}
          loadStudentPickerA={() =>
            loadStudentPicker({
              assID: 0,
              assType: 100,
              assTypeName: t('bibleReading'),
              currentStudent: stuBReadA,
            })
          }
          loadStudentPickerB={() =>
            loadStudentPicker({
              assID: 1,
              assType: 100,
              assTypeName: t('bibleReading'),
              currentStudent: stuBReadB,
            })
          }
        />

        {/* AYF */}
        <ScheduleMeetingPart type="ayfPart" part={t('applyFieldMinistryPart')} />

        {/* AYF 1 */}
        <ScheduleRowAssignment
          ayf={true}
          edit={edit}
          assType={ass1Type}
          assTypeName={ass1TypeName}
          assTime={ass1Time}
          isAssignA={isStu1A}
          personA={stu1A}
          isAssignAssistantA={isAss1A}
          assistantA={ass1A}
          isAssignB={isStu1B}
          personB={stu1B}
          isAssignAssistantB={isAss1B}
          assistantB={ass1B}
          source={ass1Src}
          student={true}
          studentPart={`${ass1Src}${ass1Study && ass1Study !== '' ? ` [${ass1Study}]` : ''}`}
          loadStudentAyfPicker={(value) => loadStudentPicker(value)}
          studentAID={2}
          assistantAID={3}
          studentBID={4}
          assistantBID={5}
        />

        {/* AYF 2 */}
        {ass2Type !== '' && !isNaN(ass2Type) && (
          <ScheduleRowAssignment
            ayf={true}
            edit={edit}
            assType={ass2Type}
            assTypeName={ass2TypeName}
            assTime={ass2Time}
            isAssignA={isStu2A}
            personA={stu2A}
            isAssignAssistantA={isAss2A}
            assistantA={ass2A}
            isAssignB={isStu2B}
            personB={stu2B}
            isAssignAssistantB={isAss2B}
            assistantB={ass2B}
            source={ass2Src}
            student={true}
            studentPart={`${ass2Src}${ass2Study && ass2Study !== '' ? ` [${ass2Study}]` : ''}`}
            loadStudentAyfPicker={(value) => loadStudentPicker(value)}
            studentAID={6}
            assistantAID={7}
            studentBID={8}
            assistantBID={9}
          />
        )}

        {/* AYF 3 */}
        {ass3Type !== '' && !isNaN(ass3Type) && (
          <ScheduleRowAssignment
            ayf={true}
            edit={edit}
            assType={ass3Type}
            assTypeName={ass3TypeName}
            assTime={ass3Time}
            isAssignA={isStu3A}
            personA={stu3A}
            isAssignAssistantA={isAss3A}
            assistantA={ass3A}
            isAssignB={isStu3B}
            personB={stu3B}
            isAssignAssistantB={isAss3B}
            assistantB={ass3B}
            source={ass3Src}
            student={true}
            studentPart={`${ass3Src}${ass3Study && ass3Study !== '' ? ` [${ass3Study}]` : ''}`}
            loadStudentAyfPicker={(value) => loadStudentPicker(value)}
            studentAID={10}
            assistantAID={11}
            studentBID={12}
            assistantBID={13}
          />
        )}

        {/* AYF 4 */}
        {ass4Type !== '' && !isNaN(ass4Type) && (
          <ScheduleRowAssignment
            ayf={true}
            edit={edit}
            assType={ass4Type}
            assTypeName={ass4TypeName}
            assTime={ass4Time}
            isAssignA={isStu4A}
            personA={stu4A}
            isAssignAssistantA={isAss4A}
            assistantA={ass4A}
            isAssignB={isStu4B}
            personB={stu4B}
            isAssignAssistantB={isAss4B}
            assistantB={ass4B}
            source={ass4Src}
            student={true}
            studentPart={`${ass4Src}${ass4Study && ass4Study !== '' ? ` [${ass4Study}]` : ''}`}
            loadStudentAyfPicker={(value) => loadStudentPicker(value)}
            studentAID={14}
            assistantAID={15}
            studentBID={16}
            assistantBID={17}
          />
        )}

        {/* LC */}
        <ScheduleMeetingPart type="lcPart" part={t('livingPart')} />

        {/* LC1 */}
        <ScheduleRowAssignment
          edit={edit}
          isAssignA={isLcPart1}
          personA={lcPart1}
          source={`(${lcPart1Time} min.) ${lcPart1Src}`}
          lcPart={lcPart1Content}
          loadStudentPickerA={() =>
            loadStudentPicker({
              assID: 23,
              assType: 114,
              assTypeName: t('lcPart'),
              currentStudent: lcPart1,
            })
          }
        />

        {/* LC2 */}
        {lcCount > 1 && (
          <ScheduleRowAssignment
            edit={edit}
            isAssignA={isLcPart2}
            personA={lcPart2}
            source={`(${lcPart2Time} min.) ${lcPart2Src}`}
            lcPart={lcPart2Content}
            loadStudentPickerA={() =>
              loadStudentPicker({
                assID: 24,
                assType: 114,
                assTypeName: t('lcPart'),
                currentStudent: lcPart2,
              })
            }
          />
        )}

        {/* CBS */}
        {weekType === 1 && (
          <ScheduleRowAssignment
            cbs={true}
            edit={edit}
            isAssignA={isCbsConductor}
            personA={cbsConductor}
            isAssignB={isCbsReader}
            personB={cbsReader}
            source={t('cbs')}
            lcPart={cbsSrc}
            loadStudentPickerA={() =>
              loadStudentPicker({
                assID: 25,
                assType: 115,
                assTypeName: t('cbsConductor'),
                currentStudent: cbsConductor,
              })
            }
            loadStudentPickerB={() =>
              loadStudentPicker({
                assID: 26,
                assType: 116,
                assTypeName: t('cbsReader'),
                currentStudent: cbsReader,
              })
            }
          />
        )}

        {/* Closing Prayer */}
        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, marginTop: '20px' }}>
          <SingleAssignment
            edit={edit}
            header={t('prayerMidweekMeeting')}
            isAssign={isClosingPrayer}
            person={closingPrayer}
            loadStudentPicker={() =>
              loadStudentPicker({
                assID: 27,
                assType: 111,
                assTypeName: t('prayerMidweekMeeting'),
                currentStudent: closingPrayer,
              })
            }
          />
        </Box>
      </Box>

      {!lgDown && (
        <Box
          sx={{
            marginTop: '10px',
            width: '600px',
            overflow: { xs: 'none', lg: edit ? 'auto' : 'none' },
            display: { xs: 'none', lg: edit ? 'block' : 'none' },
            height: { xs: 'auto', lg: edit ? '77vh' : 'auto' },
            paddingRight: { xs: 0, lg: edit ? '5px' : 0 },
          }}
        >
          {edit && isAssign && (
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
  );
};

export default ScheduleAssignment;
