import { Text, View } from '@react-pdf/renderer';
import { DoNotCall } from '@definition/territory';
import styles, { COLORS } from '../index.styles';

const cells = {
  wide: { flexGrow: 2, flexBasis: 0 },
  date: { width: 54 },
};

// only the lines that carry an address are drawn, so a short list stays short
const DoNotCallTable = ({ entries }: { entries: DoNotCall[] }) => (
  <View>
    <View
      style={{ flexDirection: 'row', gap: 8, paddingTop: 4, paddingBottom: 4 }}
    >
      <Text style={[styles.columnTitle, cells.wide]}>Address</Text>
      <Text style={[styles.columnTitle, cells.wide]}>Name</Text>
      <Text style={[styles.columnTitle, cells.date]}>Date</Text>
    </View>

    {entries.map((entry) => (
      <View key={entry.id} style={[styles.row, { gap: 8 }]}>
        <Text style={[styles.rowAddress, cells.wide]}>{entry.address}</Text>
        <Text style={[styles.rowText, cells.wide]}>{entry.name ?? ''}</Text>
        <Text style={[styles.rowText, cells.date]}>{entry.date}</Text>
      </View>
    ))}
  </View>
);

export const DoNotCallChip = () => (
  <View style={[styles.chip, { backgroundColor: COLORS.dncChip }]}>
    <Text style={[styles.chipText, { color: COLORS.dncText }]}>
      Do not call
    </Text>
  </View>
);

// a card has room for so many lines; what does not fit is at least counted
export const MoreEntries = ({ count }: { count: number }) =>
  count > 0 ? (
    <Text style={[styles.fine, { marginTop: 4 }]}>
      +{count} more in the Organized app
    </Text>
  ) : null;

export default DoNotCallTable;
