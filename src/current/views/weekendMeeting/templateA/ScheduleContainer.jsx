import { useTranslation } from 'react-i18next';
import { Page } from '@react-pdf/renderer';
import styles from './styles';
import ScheduleHeader from './ScheduleHeader';
import ScheduleTableHeader from './ScheduleTableHeader';
import ScheduleRow from './ScheduleRow';
import { Setting } from '../../../classes/Setting';

const ScheduleContainer = ({ data }) => {
  const { t } = useTranslation('source');

  return (
    <Page size="A4" style={styles.page} orientation="landscape">
      {/* Header */}
      <ScheduleHeader />

      {/* Table Header */}
      <ScheduleTableHeader
        weekText={t('date')}
        chairmanText={t('chairmanWeekendMeeting')}
        openingPrayerText={t('openingPrayerWeekendMeeting')}
        publicTalkText={t('publicTalk')}
        speakerText={t('speaker')}
        wtReaderText={t('wtStudyReader')}
      />

      {/* Schedule item */}
      {data.map((schedule) => (
        <ScheduleRow
          key={schedule.weekOf}
          weekText={schedule.weekend_meeting_date_formatted}
          chairmanText={schedule.chairman_WM_name}
          openingPrayerText={schedule.opening_prayerWM_name}
          publicTalkText={schedule.week_type === 2 ? schedule.w_co_talk_title : schedule.public_talk_title}
          speakerText={schedule.week_type === 2 ? Setting.co_name : schedule.speakers}
          wtReaderText={schedule.week_type === 2 ? '' : schedule.wtstudy_reader_name}
          weekType={schedule.week_type}
          eventName={schedule.event_name}
          noMeeting={schedule.noWMeeting}
        />
      ))}
    </Page>
  );
};

export default ScheduleContainer;
