import { Text, View } from '@react-pdf/renderer';
import { DoNotCall } from '@definition/territory';
import { TerritoryPrintData } from '../index.types';
import styles, { COLORS } from '../index.styles';

// a column only draws the lines it needs: the addresses it carries plus a
// couple of spares to write on. An empty column stays empty
const Column = ({ entries, rows }: { entries: DoNotCall[]; rows: number }) => {
  if (rows === 0) return <View style={{ flexGrow: 1, flexBasis: 0 }} />;

  return (
    <View style={{ flexGrow: 1, flexBasis: 0 }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <Text style={[styles.columnTitle, { flexGrow: 2, flexBasis: 0 }]}>
          Address
        </Text>
        <Text style={[styles.columnTitle, { flexGrow: 2, flexBasis: 0 }]}>
          Name
        </Text>
        <Text style={[styles.columnTitle, { width: 54 }]}>Date</Text>
      </View>

      {Array.from({ length: rows }, (_, index) => {
        const entry = entries[index];

        return (
          <View key={entry?.id ?? `blank-${index}`} style={styles.row}>
            <Text style={[styles.rowAddress, { flexGrow: 2, flexBasis: 0 }]}>
              {entry?.address ?? ''}
            </Text>
            <Text style={[styles.rowText, { flexGrow: 2, flexBasis: 0 }]}>
              {entry?.name ?? ''}
            </Text>
            <Text style={[styles.rowText, { width: 54 }]}>
              {entry?.date ?? ''}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const CardBack = ({
  territory,
  width,
  height,
  rowsPerColumn,
  notes,
  printedOn,
}: {
  territory: TerritoryPrintData;
  width: number;
  height: number;
  rowsPerColumn: number;
  notes?: string;
  printedOn: string;
}) => {
  const entries = territory.doNotCalls;

  const half = Math.ceil(entries.length / 2);
  const left = entries.slice(0, half);
  const right = entries.slice(half);

  // spare lines to write on, but never a column of empty rules on its own
  const rows = (column: DoNotCall[]) =>
    column.length === 0 ? 0 : Math.min(rowsPerColumn, column.length + 2);

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        padding: 12,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ gap: 2 }}>
        {entries.length > 0 && (
          <View style={[styles.chip, { backgroundColor: COLORS.dncChip }]}>
            <Text style={[styles.chipText, { color: COLORS.dncText }]}>
              Do not call
            </Text>
          </View>
        )}

        {entries.length > 0 && (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Column entries={left} rows={rows(left)} />
            <Column entries={right} rows={rows(right)} />
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 15 }}>
        <View style={{ gap: 5, flexGrow: 1, flexBasis: 0 }}>
          {!!notes && (
            <>
              <View style={[styles.chip, { backgroundColor: COLORS.chip }]}>
                <Text style={[styles.chipText, { color: COLORS.text }]}>
                  Notes
                </Text>
              </View>
              <Text style={styles.notes}>{notes}</Text>
            </>
          )}
        </View>

        <View style={{ gap: 8, width: 140 }}>
          <Text style={styles.qrText}>
            The latest info about this area is available in the Organized app.
          </Text>
          <Text style={styles.printedOn}>Printed on {printedOn}</Text>
        </View>
      </View>
    </View>
  );
};

export default CardBack;
