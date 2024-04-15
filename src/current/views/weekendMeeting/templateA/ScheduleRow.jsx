import { useTranslation } from 'react-i18next';
import { Text, View } from '@react-pdf/renderer';
import { Setting } from '../../../classes/Setting';
import styles from './styles';

const ScheduleRow = ({
  weekText,
  chairmanText,
  openingPrayerText,
  publicTalkText,
  speakerText,
  wtReaderText,
  weekType,
  eventName,
}) => {
  const { t } = useTranslation('source');
  const noOpeningPrayer = Setting.opening_prayer_WM_autoAssign;
  const noAssignment = weekType === 3 || weekType === 4;

  const personStyles = () => {
    const result = structuredClone(styles.tableColumn);
    if (noOpeningPrayer) {
      Object.assign(result, styles.personExtendedColumn);
    }
    if (!noOpeningPrayer) {
      Object.assign(result, styles.personColumn);
    }

    return result;
  };

  const publicTalkStyles = () => {
    const result = structuredClone(styles.tableColumn);
    if (noOpeningPrayer) {
      Object.assign(result, styles.talkExtendedColumn);
    }
    if (!noOpeningPrayer) {
      Object.assign(result, styles.talkColumn);
    }
    if (weekType === 2) {
      Object.assign(result, styles.talkCO);
    }
    Object.assign(result, styles.borderRight);

    return result;
  };

  const getEventName = () => {
    let result = '';

    if (weekType === 3) result = t('conventionWeek');
    if (weekType === 4) result = t('assemblyWeek');

    if (eventName && eventName !== '') {
      result += '\u000A';
      result += eventName;
    }

    return result;
  };

  return (
    <View style={styles.row}>
      <View
        style={{
          ...styles.tableColumn,
          ...styles.dateColumn,
          ...styles.borderRight,
        }}
      >
        <Text>{weekText}</Text>
      </View>

      {noAssignment && (
        <View style={styles.noMeetingColumn}>
          <Text>{getEventName()}</Text>
        </View>
      )}

      {!noAssignment && (
        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
          <View
            style={{
              ...personStyles(),
              ...styles.borderRight,
            }}
          >
            <Text>{chairmanText}</Text>
          </View>
          {!noOpeningPrayer && (
            <View
              style={{
                ...personStyles(),
                ...styles.borderRight,
              }}
            >
              <Text>{openingPrayerText}</Text>
            </View>
          )}
          <View style={publicTalkStyles()}>
            <Text>{publicTalkText}</Text>
          </View>
          <View
            style={{
              ...personStyles(),
              ...styles.borderRight,
            }}
          >
            <Text>{speakerText}</Text>
          </View>
          <View style={personStyles()}>
            <Text>{wtReaderText}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ScheduleRow;
