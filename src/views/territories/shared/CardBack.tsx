import { Text, View } from '@react-pdf/renderer';
import { TerritoryPrintData } from '../index.types';
import styles, { COLORS } from '../index.styles';
import DoNotCallTable, { DoNotCallChip, MoreEntries } from './DoNotCallTable';
import QrNote from './QrNote';

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
  const phone = territory.type === 'phone';

  // split evenly, so the list uses the card's width instead of growing tall
  const shown = entries.slice(0, rowsPerColumn * 2);
  const half = Math.ceil(shown.length / 2);
  const left = shown.slice(0, half);
  const right = shown.slice(half);

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
      {entries.length > 0 ? (
        <View style={{ gap: 2 }}>
          <DoNotCallChip />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flexGrow: 1, flexBasis: 0 }}>
              <DoNotCallTable entries={left} phone={phone} />
            </View>
            <View style={{ flexGrow: 1, flexBasis: 0 }}>
              {right.length > 0 && (
                <DoNotCallTable entries={right} phone={phone} />
              )}
            </View>
          </View>

          <MoreEntries count={entries.length - shown.length} />
        </View>
      ) : (
        <View />
      )}

      <View style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-end' }}>
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

        <QrNote qrImage={territory.qrImage} printedOn={printedOn} />
      </View>
    </View>
  );
};

export default CardBack;
