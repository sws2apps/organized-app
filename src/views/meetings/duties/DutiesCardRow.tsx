import { Text, View } from '@react-pdf/renderer';
import { DutiesCardRowProps } from './index.types';
import { dateWidth } from './packDuties';
import styles, {
  DIVIDER_BORDER,
  EVENT_COLOR,
  TEXT_COLOR,
} from './index.styles';

const DutiesCardRow = ({ row, fontSize, divided }: DutiesCardRowProps) => {
  const color = row?.event ? EVENT_COLOR : TEXT_COLOR;

  return (
    <View
      style={{
        ...styles.cell,
        borderLeft: divided ? DIVIDER_BORDER : 'none',
      }}
    >
      {row && (
        <>
          <View style={{ ...styles.cellDate, width: dateWidth(fontSize) }}>
            <Text style={{ ...styles.date, fontSize, color }}>{row.date}</Text>
          </View>

          <View style={styles.cellPersons}>
            {row.event && (
              <Text style={{ ...styles.person, fontSize, color }}>
                {row.event}
              </Text>
            )}

            {!row.event &&
              row.persons.map((person) => (
                <Text
                  key={person.id}
                  style={{ ...styles.person, fontSize, color }}
                >
                  {person.name}
                </Text>
              ))}
          </View>
        </>
      )}
    </View>
  );
};

export default DutiesCardRow;
