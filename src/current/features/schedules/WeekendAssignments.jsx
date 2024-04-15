import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import { Setting } from '../../classes/Setting';
import { Sources } from '../../classes/Sources';
import { Schedules } from '../../classes/Schedules';
import SingleAssignment from './SingleAssignment';
import ScheduleRowAssignment from './ScheduleRowAssignment';

const WeekendAssignments = () => {
  const { t } = useTranslation('ui');

  const { weekToFormat } = useParams();
  const week = weekToFormat.replaceAll('-', '/');

  const [weekType, setWeekType] = useState(1);
  const [chairman, setChairman] = useState('');
  const [prayer, setPrayer] = useState('');
  const [publicTalk, setPublicTalk] = useState('');
  const [speaker1, setSpeaker1] = useState('');
  const [speaker2, setSpeaker2] = useState('');
  const [wsReader, setWsReader] = useState('');
  const [wsArticle, setWsArticle] = useState('');
  const [coTalkTitle, setCoTalkTitle] = useState('');

  const { opening_prayer_WM_autoAssign } = Setting;

  useEffect(() => {
    if (week !== '') {
      const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
      const secretaryRole = Setting.cong_role.includes('secretary');
      const coordinatorRole = Setting.cong_role.includes('coordinator');
      const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');
      const elderRole = Setting.cong_role.includes('elder');
      const viewMeetingScheduleRole =
        !lmmoRole &&
        !secretaryRole &&
        !coordinatorRole &&
        !publicTalkCoordinatorRole &&
        !elderRole &&
        Setting.cong_role.includes('view_meeting_schedule');
      const pocketRole = Setting.account_type === 'pocket' || viewMeetingScheduleRole;

      const currentSource = Sources.get(week);
      const sourceData = currentSource.local();

      const scheduleData = Schedules.get(week);

      setChairman('');

      setWeekType(scheduleData.week_type);
      setChairman(pocketRole ? scheduleData.chairman_WM_dispName : scheduleData.chairman_WM);
      setPrayer(pocketRole ? scheduleData.opening_prayerWM_dispName : scheduleData.opening_prayerWM);
      setPublicTalk(scheduleData.public_talk_title);
      setCoTalkTitle(sourceData.w_co_talk_title);
      setSpeaker1(pocketRole ? scheduleData.speaker_1_dispName : scheduleData.speaker_1);
      setSpeaker2(pocketRole ? scheduleData.speaker_2_dispName : scheduleData.speaker_2);
      setWsArticle(sourceData.w_study_title);
      setWsReader(pocketRole ? scheduleData.wtstudy_reader_dispName : scheduleData.wtstudy_reader);
    }
  }, [week]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* Chairman*/}
        <SingleAssignment
          edit={false}
          header={t('chairmanWeekendMeeting', { ns: 'source' })}
          person={chairman}
          studentID={28}
          assType={118}
          currentWeek={week}
        />

        {/* Opening Prayer*/}
        {!opening_prayer_WM_autoAssign && (
          <SingleAssignment
            edit={false}
            header={t('prayerWeekendMeeting', { ns: 'source' })}
            person={prayer}
            studentID={29}
            assType={119}
            currentWeek={week}
          />
        )}
      </Box>

      <Box sx={{ margin: '20px 0' }}>
        {/* Public Talk */}
        {weekType !== 2 && (
          <ScheduleRowAssignment
            edit={false}
            talk={true}
            personA={speaker1}
            personB={speaker2}
            publicTalk={publicTalk}
            studentAID={30}
            studentBID={31}
            assType={121}
            assType2={120}
            currentWeek={week}
          />
        )}

        {/* CO Talk */}
        {weekType === 2 && (
          <ScheduleRowAssignment
            co={true}
            edit={false}
            talk={true}
            personA={Setting.co_displayName}
            publicTalk={coTalkTitle}
            studentAID={30}
            studentBID={31}
            assType={121}
            assType2={120}
            currentWeek={week}
          />
        )}
      </Box>

      {/* Watchtower Study */}
      <ScheduleRowAssignment
        ws={true}
        edit={false}
        personA={wsReader}
        header={t('reader')}
        wsArticle={wsArticle}
        studentAID={22}
        assType={113}
        currentWeek={week}
      />
    </Box>
  );
};

export default WeekendAssignments;
