import { useRecoilValue } from 'recoil';
import { Text, View } from '@react-pdf/renderer';
import { S140MeetingPartHeadingType } from './index.types';
import { midweekMeetingClassCountState } from '@states/settings';
import { Week } from '@definition/week_type';
import { useAppTranslation } from '@hooks/index';
import styles from './index.styles';

const S140MeetingPartHeading = ({
  meetingData,
  meetingPart,
  backgroundColor,
  classroomHeading,
}: S140MeetingPartHeadingType) => {
  const { t } = useAppTranslation();

  const class_count = useRecoilValue(midweekMeetingClassCountState);

  return (
    <View
      style={{
        ...styles.rowBase,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginBottom: '5px',
      }}
    >
      <Text style={{ ...styles.meetingSectionText, backgroundColor }}>
        {t(meetingPart)}
      </Text>
      <Text
        style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}
      >
        {classroomHeading &&
        class_count === 2 &&
        meetingData.week_type !== Week.CO_VISIT
          ? t('auxClass')
          : ''}
      </Text>
      <Text
        style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}
      >
        {classroomHeading ? t('mainHall') : ''}
      </Text>
    </View>
  );
};

export default S140MeetingPartHeading;
