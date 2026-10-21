import { Text, View } from '@react-pdf/renderer';
import { MajorCleaningDetailsProps } from '@views/activities/hall_cleaning/index.types';
import styles from '@views/activities/hall_cleaning/index.styles';

const MajorCleaningDetails = ({ row }: MajorCleaningDetailsProps) => {
  let participants = row.participants ?? [];
  if (!participants.length && row.group) participants = [row.group.name];

  return (
    <View style={{ ...styles.majorDetails, gap: 2 }}>
      {participants.length > 0 && (
        <Text style={styles.person}>{participants.join(', ')}</Text>
      )}
      {row.responsible && (
        <Text style={styles.responsible}>{row.responsible}</Text>
      )}
      {row.persons.length > 0 && (
        <Text style={styles.person}>{row.persons.join(', ')}</Text>
      )}
    </View>
  );
};

export default MajorCleaningDetails;
