import { Text, View } from '@react-pdf/renderer';
import styles from './styles';
import { Setting } from '../../../classes/Setting';

const ScheduleTableHeader = ({
  weekText,
  chairmanText,
  openingPrayerText,
  publicTalkText,
  speakerText,
  wtReaderText,
}) => {
  const noOpeningPrayer = Setting.opening_prayer_WM_autoAssign;

  const personStyles = () => {
    const result = structuredClone(styles.tableColumn);

    Object.assign(result, styles.tableHeaderText);
    if (noOpeningPrayer) {
      Object.assign(result, styles.personExtendedColumn);
    }
    if (!noOpeningPrayer) {
      Object.assign(result, styles.personColumn);
    }
    Object.assign(result, styles.borderTop);
    Object.assign(result, styles.borderBottom);

    return result;
  };

  const publicTalkStyles = () => {
    const result = structuredClone(styles.tableColumn);

    Object.assign(result, styles.tableHeaderText);
    if (noOpeningPrayer) {
      Object.assign(result, styles.talkExtendedColumn);
    }
    if (!noOpeningPrayer) {
      Object.assign(result, styles.talkColumn);
    }
    Object.assign(result, styles.borderTop);
    Object.assign(result, styles.borderBottom);
    Object.assign(result, styles.borderRight);

    return result;
  };

  return (
    <View style={styles.row}>
      <View
        style={{
          ...styles.tableColumn,
          ...styles.tableHeaderText,
          ...styles.dateColumn,
          ...styles.borderTop,
          ...styles.borderBottom,
          ...styles.borderLeft,
          ...styles.borderRight,
        }}
      >
        <Text>{weekText}</Text>
      </View>
      <View style={{ ...personStyles(), ...styles.borderRight }}>
        <Text>{chairmanText}</Text>
      </View>
      {!noOpeningPrayer && (
        <View
          style={{
            ...styles.tableColumn,
            ...styles.tableHeaderText,
            ...styles.personColumn,
            ...styles.borderTop,
            ...styles.borderBottom,
            ...styles.borderRight,
          }}
        >
          <Text>{openingPrayerText}</Text>
        </View>
      )}

      <View style={publicTalkStyles()}>
        <Text>{publicTalkText}</Text>
      </View>
      <View style={{ ...personStyles(), ...styles.borderRight }}>
        <Text>{speakerText}</Text>
      </View>
      <View style={{ ...personStyles(), ...styles.borderRight }}>
        <Text>{wtReaderText}</Text>
      </View>
    </View>
  );
};

export default ScheduleTableHeader;
