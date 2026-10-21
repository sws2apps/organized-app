import { Text, View } from '@react-pdf/renderer';
import IconCalendar from '@views/components/icons/IconCalendar';
import { CleaningRowsProps } from './index.types';
import { cleaningCardLines } from '@views/activities/hall_cleaning/cardLines';
import { cleaningMonths } from '@views/activities/hall_cleaning/cleaningMonths';
import styles, {
  BLUE_MAIN,
  CONTENT_WIDTH,
  DIVIDER,
  RADIUS,
} from './index.styles';

const CARDS_PER_LINE = 4;
const CARD_GAP = 12;
const CARD_WIDTH =
  (CONTENT_WIDTH - (CARDS_PER_LINE - 1) * CARD_GAP) / CARDS_PER_LINE;

const CleaningCards = ({ rows }: CleaningRowsProps) => {
  const renderLine = (line: CleaningRowsProps['rows']) => {
    const cards = line.map((row) => {
      const entries = [
        ...(row.participants ?? []).map((text) => ({
          text,
          style: row.isMajor ? styles.person : styles.responsible,
        })),
        ...(row.responsible
          ? [{ text: row.responsible, style: styles.responsible }]
          : []),
        ...row.persons.map((name) => ({ text: name, style: styles.person })),
      ];
      let groups = row.groups ?? [];
      if (!groups.length && row.group) groups = [row.group];
      return {
        row,
        entries,
        headerLabel: row.isMajor
          ? row.label
          : groups.map((group) => group.name).join(', '),
      };
    });

    return (
      <View key={line[0].id} wrap={false}>
        <View style={{ ...styles.row, alignItems: 'stretch', gap: CARD_GAP }}>
          {cards.map(({ row, entries, headerLabel }) => (
            <View
              key={row.id}
              style={{
                ...styles.cardTitle,
                width: CARD_WIDTH,
                borderTopLeftRadius: RADIUS(),
                borderTopRightRadius: RADIUS(),
                backgroundColor:
                  (row.groups?.length ?? 0) > 1
                    ? BLUE_MAIN()
                    : (row.group?.color ?? BLUE_MAIN()),
                borderBottomLeftRadius: entries.length ? 0 : RADIUS(),
                borderBottomRightRadius: entries.length ? 0 : RADIUS(),
              }}
            >
              <Text style={{ flexShrink: 0 }}>{row.date}</Text>
              {headerLabel && (
                <Text style={{ flex: 1, textAlign: 'right', fontSize: 8 }}>
                  {headerLabel}
                </Text>
              )}
            </View>
          ))}
        </View>
        <View
          style={{ ...styles.row, alignItems: 'flex-start', gap: CARD_GAP }}
        >
          {cards.map(({ row, entries }) => (
            <View key={row.id} style={{ width: CARD_WIDTH }}>
              {entries.length > 0 && (
                <View
                  style={{
                    ...styles.cardRows,
                    borderBottomLeftRadius: RADIUS(),
                    borderBottomRightRadius: RADIUS(),
                  }}
                >
                  {entries.map((entry, index) => (
                    <Text
                      key={`${row.id}_${index}`}
                      style={{
                        ...styles.cardRow,
                        ...entry.style,
                        fontSize: 9,
                        borderTop: index > 0 ? DIVIDER : 'none',
                      }}
                    >
                      {entry.text}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ gap: 14 }}>
      {cleaningMonths(rows).map(({ month, rows: entries }, index) => {
        const lines = cleaningCardLines(entries, CARDS_PER_LINE);
        return (
          <View key={month || index} style={{ gap: CARD_GAP }}>
            <View wrap={false} style={{ gap: CARD_GAP }}>
              {month && (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#D5DFFD',
                    borderRadius: RADIUS(),
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    gap: 8,
                  }}
                >
                  <IconCalendar color={styles.monthHeading.color} />
                  <Text
                    style={{ ...styles.monthHeading, marginBottom: 0, flex: 1 }}
                  >
                    {month}
                  </Text>
                </View>
              )}
              {renderLine(lines[0])}
            </View>
            {lines.slice(1).map(renderLine)}
          </View>
        );
      })}
    </View>
  );
};

export default CleaningCards;
