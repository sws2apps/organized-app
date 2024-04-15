import { useTranslation } from 'react-i18next';
import { Text, View } from '@react-pdf/renderer';
import { Setting } from '../../classes/Setting';
import styles from './styles';

const S140MeetingPartHeading = ({ weekItem, meetingPart, backgroundColor, classroomHeading }) => {
  const { t } = useTranslation('source');

  const { source_lang, class_count } = Setting;

  return (
    <View
      style={{
        ...styles.rowBase,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginBottom: '5px',
      }}
    >
      <Text style={{ ...styles.meetingSectionText, backgroundColor }}>{t(meetingPart, { lng: source_lang })}</Text>
      <Text style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}>
        {classroomHeading && class_count === 2 && weekItem.scheduleData.week_type !== 2
          ? t('auxClass', { lng: source_lang })
          : ''}
      </Text>
      <Text style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}>
        {classroomHeading ? t('mainHall', { lng: source_lang }) : ''}
      </Text>
    </View>
  );
};

export default S140MeetingPartHeading;
