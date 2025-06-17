import { Text, View } from '@react-pdf/renderer';
import { S140MeetingPartHeadingType } from '../shared/index.types';
import { useAppTranslation } from '@hooks/index';
import styles from './index.styles';

const S140MeetingPartHeading = ({
  meetingData,
  meetingPart,
  backgroundColor,
  classroomHeading,
  lang,
}: S140MeetingPartHeadingType) => {
  const { t } = useAppTranslation();

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
        {t(meetingPart, { lng: lang })}
      </Text>
      <Text
        style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}
      >
        {classroomHeading && meetingData.aux_class
          ? t('tr_auxClass', { lng: lang })
          : ''}
      </Text>
      <Text
        style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}
      >
        {classroomHeading ? t('tr_mainHall', { lng: lang }) : ''}
      </Text>
    </View>
  );
};

export default S140MeetingPartHeading;
