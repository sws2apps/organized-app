import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import ScheduleMeetingPart from './ScheduleMeetingPart';
import ScheduleRowAssignment from './ScheduleRowAssignment';
import SingleAssignment from './SingleAssignment';
import PersonAssignmentHistory from './PersonAssignmentHistory';
import { saveAssignment } from '../../utils/schedule';
import { Sources } from '../../classes/Sources';
import { Schedules } from '../../classes/Schedules';
import { Setting } from '../../classes/Setting';
import { refreshCurrentWeekState } from '../../states/schedule';

const ScheduleAssignment = ({ edit }) => {
  const { weekToFormat } = useParams();

  const { t } = useTranslation('ui');

  const theme = useTheme();
  const lgDown = useMediaQuery(theme.breakpoints.down('lg'), { noSsr: true });

  const [refreshCurrent, setRefreshCurrent] = useRecoilState(refreshCurrentWeekState);

  const { class_count, opening_prayer_MM_autoAssign } = Setting;

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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [assInfo, setAssInfo] = useState({});
  const [isDlgOpen, setIsDlgOpen] = useState(false);
  const [coTalkTitle, setCoTalkTitle] = useState('');
  const [coName, setCoName] = useState('');
  const [isLC1NoAssign, setIsLC1NoAssign] = useState(false);
  const [isLC2NoAssign, setIsLC2NoAssign] = useState(false);
  const [isElderLC1, setIsElderLC1] = useState(false);
  const [isElderLC2, setIsElderLC2] = useState(false);

  const minLabel = t('minuteShortLabel');
  const week = weekToFormat.replaceAll('-', '/');
  const schedYear = week.split('/')[0];

  const loadPersonHistory = (obj) => {
    setAssInfo(obj);
    setIsHistoryOpen(true);
    setIsDlgOpen(true);
  };

  const handleDlgClose = () => {
    setIsHistoryOpen(false);
  };

  const setSelectedStudent = async (selectedStudent) => {
    const assID = selectedStudent.assID;
    const studentID = selectedStudent.person_uid;
    const studentValue = studentID || null;

    if (assID === 0) {
      await saveAssignment(week, studentID, 'bRead_stu_A');
      setStuBReadA(studentValue);
    }

    if (assID === 1) {
      await saveAssignment(week, studentID, 'bRead_stu_B');
      setStuBReadB(studentValue);
    }

    if (assID === 2) {
      await saveAssignment(week, studentID, 'ass1_stu_A');
      setStu1A(studentValue);
    }

    if (assID === 3) {
      await saveAssignment(week, studentID, 'ass1_ass_A');
      setAss1A(studentValue);
    }

    if (assID === 4) {
      await saveAssignment(week, studentID, 'ass1_stu_B');
      setStu1B(studentValue);
    }

    if (assID === 5) {
      await saveAssignment(week, studentID, 'ass1_ass_B');
      setAss1B(studentValue);
    }

    if (assID === 6) {
      await saveAssignment(week, studentID, 'ass2_stu_A');
      setStu2A(studentValue);
    }

    if (assID === 7) {
      await saveAssignment(week, studentID, 'ass2_ass_A');
      setAss2A(studentValue);
    }

    if (assID === 8) {
      await saveAssignment(week, studentID, 'ass2_stu_B');
      setStu2B(studentValue);
    }

    if (assID === 9) {
      await saveAssignment(week, studentID, 'ass2_ass_B');
      setAss2B(studentValue);
    }

    if (assID === 10) {
      await saveAssignment(week, studentID, 'ass3_stu_A');
      setStu3A(studentValue);
    }

    if (assID === 11) {
      await saveAssignment(week, studentID, 'ass3_ass_A');
      setAss3A(studentValue);
    }

    if (assID === 12) {
      await saveAssignment(week, studentID, 'ass3_stu_B');
      setStu3B(studentValue);
    }

    if (assID === 13) {
      await saveAssignment(week, studentID, 'ass3_ass_B');
      setAss3B(studentValue);
    }

    if (assID === 14) {
      await saveAssignment(week, studentID, 'ass4_stu_A');
      setStu4A(studentValue);
    }

    if (assID === 15) {
      await saveAssignment(week, studentID, 'ass4_ass_A');
      setAss4A(studentValue);
    }

    if (assID === 16) {
      await saveAssignment(week, studentID, 'ass4_stu_B');
      setStu4B(studentValue);
    }

    if (assID === 17) {
      await saveAssignment(week, studentID, 'ass4_ass_B');
      setAss4B(studentValue);
    }

    if (assID === 18) {
      await saveAssignment(week, studentID, 'chairmanMM_A');
      setChairmanA(studentValue);
    }

    if (assID === 19) {
      await saveAssignment(week, studentID, 'chairmanMM_B');
      setChairmanB(studentValue);
    }

    if (assID === 20) {
      await saveAssignment(week, studentID, 'opening_prayerMM');
      setOpeningPrayer(studentValue);
    }

    if (assID === 21) {
      await saveAssignment(week, studentID, 'tgw_talk');
      setTgwTalk(studentValue);
    }

    if (assID === 22) {
      await saveAssignment(week, studentID, 'tgw_gems');
      setTgwGems(studentValue);
    }

    if (assID === 23) {
      await saveAssignment(week, studentID, 'lc_part1');
      setLcPart1(studentValue);
    }

    if (assID === 24) {
      await saveAssignment(week, studentID, 'lc_part2');
      setLcPart2(studentValue);
    }

    if (assID === 25) {
      await saveAssignment(week, studentID, 'cbs_conductor');
      setCbsConductor(studentValue);
    }

    if (assID === 26) {
      await saveAssignment(week, studentID, 'cbs_reader');
      setCbsReader(studentValue);
    }

    if (assID === 27) {
      await saveAssignment(week, studentID, 'closing_prayerMM');
      setClosingPrayer(studentValue);
    }

    setIsHistoryOpen(false);
    setRefreshCurrent((prev) => !prev);
  };

  const buildAssignmentDesc = (source, study) => {
    let src = source;

    if (study && study !== '') {
      src += ` [${study}]`;
    }

    return src;
  };

  useEffect(() => {
    if (week !== '') {
      const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
      const secretaryRole = Setting.cong_role.includes('secretary');
      const coordinatorRole = Setting.cong_role.includes('coordinator');
      const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');
      const elderRole = Setting.cong_role.includes('elder');
      const msRole = Setting.cong_role.includes('ms');
      const publisherRole = Setting.cong_role.includes('publisher');
      const viewMeetingScheduleRole =
        !lmmoRole &&
        !secretaryRole &&
        !coordinatorRole &&
        !publicTalkCoordinatorRole &&
        !elderRole &&
        (Setting.cong_role.includes('view_meeting_schedule') || msRole || publisherRole);
      const pocketRole = Setting.account_type === 'pocket' || viewMeetingScheduleRole;

      const currentSource = Sources.get(week);
      const scheduleData = Schedules.get(week);
      const sourceData = currentSource.local();

      setChairmanA(pocketRole ? scheduleData.chairmanMM_A_dispName : scheduleData.chairmanMM_A);
      setChairmanB(pocketRole ? scheduleData.chairmanMM_B_dispName : scheduleData.chairmanMM_B);
      setOpeningPrayer(pocketRole ? scheduleData.opening_prayerMM_dispName : scheduleData.opening_prayerMM);
      setTgwTalkSrc(sourceData.mwb_tgw_talk);
      setTgwTalk(pocketRole ? scheduleData.tgw_talk_dispName : scheduleData.tgw_talk);
      setTgwGems(pocketRole ? scheduleData.tgw_gems_dispName : scheduleData.tgw_gems);
      setBibleReadingSrc(sourceData.mwb_tgw_bread);
      setBibleReadingStudy(sourceData.bibleReading_study);
      setStuBReadA(pocketRole ? scheduleData.bRead_stu_A_dispName : scheduleData.bRead_stu_A);
      setStuBReadB(pocketRole ? scheduleData.bRead_stu_B_dispName : scheduleData.bRead_stu_B);
      setAss1Type(sourceData.mwb_ayf_part1_type);
      setAss1TypeName(sourceData.mwb_ayf_part1_type_name);
      setAss1Time(sourceData.mwb_ayf_part1_time);
      setAss1Study(sourceData.ass1_study);
      setAss1Src(sourceData.mwb_ayf_part1);
      setStu1A(pocketRole ? scheduleData.ass1_stu_A_dispName : scheduleData.ass1_stu_A);
      setAss1A(pocketRole ? scheduleData.ass1_ass_A_dispName : scheduleData.ass1_ass_A);
      setStu1B(pocketRole ? scheduleData.ass1_stu_B_dispName : scheduleData.ass1_stu_B);
      setAss1B(pocketRole ? scheduleData.ass1_ass_B_dispName : scheduleData.ass1_ass_B);
      setAss2Type(sourceData.mwb_ayf_part2_type);
      setAss2TypeName(sourceData.mwb_ayf_part2_type_name);
      setAss2Time(sourceData.mwb_ayf_part2_time);
      setAss2Study(sourceData.ass2_study);
      setAss2Src(sourceData.mwb_ayf_part2);
      setStu2A(pocketRole ? scheduleData.ass2_stu_A_dispName : scheduleData.ass2_stu_A);
      setAss2A(pocketRole ? scheduleData.ass2_ass_A_dispName : scheduleData.ass2_ass_A);
      setStu2B(pocketRole ? scheduleData.ass2_stu_B_dispName : scheduleData.ass2_stu_B);
      setAss2B(pocketRole ? scheduleData.ass2_ass_B_dispName : scheduleData.ass2_ass_B);
      setAss3Type(sourceData.mwb_ayf_part3_type);
      setAss3TypeName(sourceData.mwb_ayf_part3_type_name);
      setAss3Time(sourceData.mwb_ayf_part3_time);
      setAss3Study(sourceData.ass3_study);
      setAss3Src(sourceData.mwb_ayf_part3);
      setStu3A(pocketRole ? scheduleData.ass3_stu_A_dispName : scheduleData.ass3_stu_A);
      setAss3A(pocketRole ? scheduleData.ass3_ass_A_dispName : scheduleData.ass3_ass_A);
      setStu3B(pocketRole ? scheduleData.ass3_stu_B_dispName : scheduleData.ass3_stu_B);
      setAss3B(pocketRole ? scheduleData.ass3_ass_B_dispName : scheduleData.ass3_ass_B);
      setAss4Type(sourceData.mwb_ayf_part4_type);
      setAss4TypeName(sourceData.mwb_ayf_part4_type_name);
      setAss4Time(sourceData.mwb_ayf_part4_time);
      setAss4Study(sourceData.ass4_study);
      setAss4Src(sourceData.mwb_ayf_part4);
      setStu4A(pocketRole ? scheduleData.ass4_stu_A_dispName : scheduleData.ass4_stu_A);
      setAss4A(pocketRole ? scheduleData.ass4_ass_A_dispName : scheduleData.ass4_ass_A);
      setStu4B(pocketRole ? scheduleData.ass4_stu_B_dispName : scheduleData.ass4_stu_B);
      setAss4B(pocketRole ? scheduleData.ass4_ass_B_dispName : scheduleData.ass4_ass_B);
      if (sourceData.mwb_lc_count_override) setLcCount(sourceData.mwb_lc_count_override);
      if (!sourceData.mwb_lc_count_override) setLcCount(sourceData.mwb_lc_count);
      if (sourceData.mwb_lc_part1_time_override) {
        setLcPart1Time(sourceData.mwb_lc_part1_time_override);
        setLcPart1Src(sourceData.mwb_lc_part1_override);
        setLcPart1Content(sourceData.mwb_lc_part1_content_override);
      }
      if (!sourceData.mwb_lc_part1_time_override) {
        setLcPart1Time(sourceData.mwb_lc_part1_time);
        setLcPart1Src(sourceData.mwb_lc_part1);
        setLcPart1Content(sourceData.mwb_lc_part1_content);
      }
      if (sourceData.mwb_lc_part2_time_override) {
        setLcPart2Time(sourceData.mwb_lc_part2_time_override);
        setLcPart2Src(sourceData.mwb_lc_part2_override);
        setLcPart2Content(sourceData.mwb_lc_part2_content_override);
      }
      if (!sourceData.mwb_lc_part2_time_override) {
        setLcPart2Time(sourceData.mwb_lc_part2_time);
        setLcPart2Src(sourceData.mwb_lc_part2);
        setLcPart2Content(sourceData.mwb_lc_part2_content);
      }
      setLcPart1(pocketRole ? scheduleData.lc_part1_dispName : scheduleData.lc_part1);
      setLcPart2(pocketRole ? scheduleData.lc_part2_dispName : scheduleData.lc_part2);
      setIsLC1NoAssign(currentSource.noAssignLC1());
      setIsLC2NoAssign(currentSource.noAssignLC2());
      setIsElderLC1(currentSource.isElderPartLC1());
      setIsElderLC2(currentSource.isElderPartLC2());
      setCbsSrc(sourceData.mwb_lc_cbs);
      setCbsConductor(pocketRole ? scheduleData.cbs_conductor_dispName : scheduleData.cbs_conductor);
      setCbsReader(pocketRole ? scheduleData.cbs_reader_dispName : scheduleData.cbs_reader);
      setClosingPrayer(pocketRole ? scheduleData.closing_prayerMM_dispName : scheduleData.closing_prayerMM);
      setCoTalkTitle(sourceData.mwb_co_talk_title);
      setWeekType(scheduleData.week_type);
      setCoName(Setting.co_displayName);
    }
  }, [refreshCurrent, week]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
      }}
    >
      {edit && isHistoryOpen && (
        <Dialog open={lgDown ? isDlgOpen : false} onClose={handleDlgClose} aria-labelledby="dialog-title">
          <DialogTitle id="dialog-title" sx={{ padding: '5px 10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <IconButton onClick={() => handleDlgClose()}>
                <CancelIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <PersonAssignmentHistory
              assInfo={assInfo}
              setIsHistoryOpen={(value) => setIsHistoryOpen(value)}
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
              header={t('chairmanMidweekMeeting', { ns: 'source' })}
              person={chairmanA}
              studentID={18}
              assType={110}
              setSelectedStudent={(value) => setSelectedStudent(value)}
              currentWeek={week}
              loadPersonHistory={() =>
                loadPersonHistory({
                  assID: 18,
                  assType: 110,
                  assTypeName: t('chairmanMidweekMeeting', { ns: 'source' }),
                  currentStudent: chairmanA,
                })
              }
            />

            {/* Chairman B */}
            {class_count === 2 && weekType === 1 && (
              <SingleAssignment
                edit={edit}
                header={t('auxClassCounselor')}
                person={chairmanB}
                studentID={19}
                assType={110}
                currentWeek={week}
                setSelectedStudent={(value) => setSelectedStudent(value)}
                loadPersonHistory={() =>
                  loadPersonHistory({
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
          {!opening_prayer_MM_autoAssign && (
            <SingleAssignment
              edit={edit}
              header={t('prayerMidweekMeeting', { ns: 'source' })}
              person={openingPrayer}
              studentID={20}
              assType={111}
              currentWeek={week}
              setSelectedStudent={(value) => setSelectedStudent(value)}
              loadPersonHistory={() =>
                loadPersonHistory({
                  assID: 20,
                  assType: 111,
                  assTypeName: t('prayerMidweekMeeting', { ns: 'source' }),
                  currentStudent: openingPrayer,
                })
              }
            />
          )}
        </Box>

        {/* TGW */}
        <ScheduleMeetingPart type={schedYear < 2024 ? 'tgwPart' : 'tgwPart-2024'} part={t('treasuresPart')} />

        {/* TGW Talk */}
        <ScheduleRowAssignment
          edit={edit}
          personA={tgwTalk}
          source={tgwTalkSrc}
          studentAID={21}
          assType={112}
          currentWeek={week}
          setSelectedStudent={(value) => setSelectedStudent(value)}
          loadPersonHistoryA={() =>
            loadPersonHistory({
              assID: 21,
              assType: 112,
              assTypeName: t('tgwTalk', { ns: 'source' }),
              currentStudent: tgwTalk,
            })
          }
        />

        {/* TGW Gems */}
        <ScheduleRowAssignment
          edit={edit}
          personA={tgwGems}
          source={t('tgwGems', { ns: 'source' })}
          studentAID={22}
          assType={113}
          currentWeek={week}
          setSelectedStudent={(value) => setSelectedStudent(value)}
          loadPersonHistoryA={() =>
            loadPersonHistory({
              assID: 22,
              assType: 113,
              assTypeName: t('tgwGems', { ns: 'source' }),
              currentStudent: tgwGems,
            })
          }
        />

        {/* Bible Reading */}
        <ScheduleRowAssignment
          weekType={weekType}
          edit={edit}
          personA={stuBReadA}
          personB={stuBReadB}
          source={t('bibleReadingText')}
          student={true}
          studentAID={0}
          studentBID={1}
          assType={100}
          studentPart={buildAssignmentDesc(bibleReadingSrc, bibleReadingStudy)}
          currentWeek={week}
          setSelectedStudent={(value) => setSelectedStudent(value)}
          loadPersonHistoryA={() =>
            loadPersonHistory({
              assID: 0,
              assType: 100,
              assTypeName: t('bibleReading', { ns: 'source' }),
              currentStudent: stuBReadA,
            })
          }
          loadPersonHistoryB={() =>
            loadPersonHistory({
              assID: 1,
              assType: 100,
              assTypeName: t('bibleReading', { ns: 'source' }),
              currentStudent: stuBReadB,
            })
          }
        />

        {/* AYF */}
        <ScheduleMeetingPart type="ayfPart" part={t('applyFieldMinistryPart')} />

        {/* AYF 1 */}
        <ScheduleRowAssignment
          weekType={weekType}
          ayf={true}
          edit={edit}
          assType={ass1Type}
          assTypeName={ass1TypeName}
          assTime={ass1Time}
          personA={stu1A}
          assistantA={ass1A}
          personB={stu1B}
          assistantB={ass1B}
          source={ass1Src}
          student={true}
          studentPart={buildAssignmentDesc(ass1Src, ass1Study)}
          studentAID={2}
          assistantAID={3}
          studentBID={4}
          assistantBID={5}
          currentWeek={week}
          setSelectedStudent={(value) => setSelectedStudent(value)}
          loadStudentAyfPicker={(value) => loadPersonHistory(value)}
        />

        {/* AYF 2 */}
        {ass2Type !== '' && !isNaN(ass2Type) && (
          <ScheduleRowAssignment
            weekType={weekType}
            ayf={true}
            edit={edit}
            assType={ass2Type}
            assTypeName={ass2TypeName}
            assTime={ass2Time}
            personA={stu2A}
            assistantA={ass2A}
            personB={stu2B}
            assistantB={ass2B}
            source={ass2Src}
            student={true}
            studentPart={buildAssignmentDesc(ass2Src, ass2Study)}
            studentAID={6}
            assistantAID={7}
            studentBID={8}
            assistantBID={9}
            currentWeek={week}
            setSelectedStudent={(value) => setSelectedStudent(value)}
            loadStudentAyfPicker={(value) => loadPersonHistory(value)}
          />
        )}

        {/* AYF 3 */}
        {ass3Type !== '' && !isNaN(ass3Type) && (
          <ScheduleRowAssignment
            weekType={weekType}
            ayf={true}
            edit={edit}
            assType={ass3Type}
            assTypeName={ass3TypeName}
            assTime={ass3Time}
            personA={stu3A}
            assistantA={ass3A}
            personB={stu3B}
            assistantB={ass3B}
            source={ass3Src}
            student={true}
            studentPart={buildAssignmentDesc(ass3Src, ass3Study)}
            studentAID={10}
            assistantAID={11}
            studentBID={12}
            assistantBID={13}
            currentWeek={week}
            setSelectedStudent={(value) => setSelectedStudent(value)}
            loadStudentAyfPicker={(value) => loadPersonHistory(value)}
          />
        )}

        {/* AYF 4 */}
        {ass4Type !== '' && !isNaN(ass4Type) && (
          <ScheduleRowAssignment
            weekType={weekType}
            ayf={true}
            edit={edit}
            assType={ass4Type}
            assTypeName={ass4TypeName}
            assTime={ass4Time}
            personA={stu4A}
            assistantA={ass4A}
            personB={stu4B}
            assistantB={ass4B}
            source={ass4Src}
            student={true}
            studentPart={buildAssignmentDesc(ass4Src, ass4Study)}
            studentAID={14}
            assistantAID={15}
            studentBID={16}
            assistantBID={17}
            currentWeek={week}
            setSelectedStudent={(value) => setSelectedStudent(value)}
            loadStudentAyfPicker={(value) => loadPersonHistory(value)}
          />
        )}

        {/* LC */}
        <ScheduleMeetingPart type="lcPart" part={t('livingPart')} />

        {/* LC1 */}
        {lcPart1Src !== '' && (
          <ScheduleRowAssignment
            isLC={true}
            edit={edit}
            personA={lcPart1}
            source={`${lcPart1Src} (${lcPart1Time} ${minLabel})`}
            lcPart={lcPart1Content}
            studentAID={23}
            assType={114}
            currentWeek={week}
            isLCNoAssign={isLC1NoAssign}
            isLCElder={isElderLC1}
            setSelectedStudent={(value) => setSelectedStudent(value)}
            loadPersonHistoryA={() =>
              loadPersonHistory({
                assID: 23,
                assType: 114,
                assTypeName: t('lcPart', { ns: 'source' }),
                currentStudent: lcPart1,
              })
            }
          />
        )}

        {/* LC2 */}
        {lcCount > 1 && lcPart2Src !== '' && (
          <ScheduleRowAssignment
            isLC={true}
            edit={edit}
            personA={lcPart2}
            source={`${lcPart2Src} (${lcPart2Time} ${minLabel})`}
            lcPart={lcPart2Content}
            studentAID={24}
            assType={114}
            currentWeek={week}
            isLCNoAssign={isLC2NoAssign}
            isLCElder={isElderLC2}
            setSelectedStudent={(value) => setSelectedStudent(value)}
            loadPersonHistoryA={() =>
              loadPersonHistory({
                assID: 24,
                assType: 114,
                assTypeName: t('lcPart', { ns: 'source' }),
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
            personA={cbsConductor}
            personB={cbsReader}
            source={t('cbs')}
            lcPart={cbsSrc}
            studentAID={25}
            studentBID={26}
            assType={115}
            assType2={116}
            currentWeek={week}
            setSelectedStudent={(value) => setSelectedStudent(value)}
            loadPersonHistoryA={() =>
              loadPersonHistory({
                assID: 25,
                assType: 115,
                assTypeName: t('cbsConductor', { ns: 'source' }),
                currentStudent: cbsConductor,
              })
            }
            loadPersonHistoryB={() =>
              loadPersonHistory({
                assID: 26,
                assType: 116,
                assTypeName: t('cbsReader', { ns: 'source' }),
                currentStudent: cbsReader,
              })
            }
          />
        )}

        {/* Talk CO */}
        {weekType === 2 && (
          <ScheduleRowAssignment
            edit={edit}
            co={true}
            source={`${t('coTalk')} (30 ${minLabel})`}
            lcPart={coTalkTitle}
            personA={coName}
            currentWeek={week}
          />
        )}

        {/* Closing Prayer */}
        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, marginTop: '20px' }}>
          <SingleAssignment
            edit={edit}
            header={t('prayerMidweekMeeting', { ns: 'source' })}
            person={closingPrayer}
            studentID={27}
            assType={111}
            currentWeek={week}
            setSelectedStudent={(value) => setSelectedStudent(value)}
            loadPersonHistory={() =>
              loadPersonHistory({
                assID: 27,
                assType: 111,
                assTypeName: t('prayerMidweekMeeting', { ns: 'source' }),
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
          {edit && isHistoryOpen && <PersonAssignmentHistory assInfo={assInfo} />}
        </Box>
      )}
    </Box>
  );
};

export default ScheduleAssignment;
