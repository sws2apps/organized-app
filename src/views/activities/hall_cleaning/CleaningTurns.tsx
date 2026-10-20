import { alpha, darken } from '@mui/material/styles';
import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { CleaningTurnsProps } from './index.types';
import styles, {
  BLUE_MAIN,
  BORDER,
  BORDER_WIDTH,
  RADIUS,
  CONTENT_WIDTH,
  tableRow,
} from './index.styles';
import rowEdges from './rowEdges';
import RowPageProbe from './RowPageProbe';

const TURNS_PER_TABLE = 8;
const GROUP_WIDTH = 100;
const TURN_WIDTH =
  (CONTENT_WIDTH - GROUP_WIDTH - 2 * BORDER_WIDTH) / TURNS_PER_TABLE;

// room for the labels and a first group, so the labels never end a page alone
const LABELS_PRESENCE_AHEAD = 60;

const CleaningTurns = ({
  groups,
  turns,
  rowPages,
  onRowPage,
}: CleaningTurnsProps) => {
  const { t } = useAppTranslation();
  const tables = Array.from(
    { length: Math.ceil(turns.length / TURNS_PER_TABLE) },
    (_, index) =>
      turns.slice(index * TURNS_PER_TABLE, (index + 1) * TURNS_PER_TABLE)
  );

  const sections = tables.flatMap((table) => {
    const assigned = new Set(table.flatMap((turn) => turn.groups));
    const visibleGroups = groups.filter((group) => assigned.has(group.id));
    const sections: { table: typeof table; sectionGroups: typeof groups }[] =
      [];
    let sectionGroups: typeof groups = [];
    let height = 0;
    for (const group of visibleGroups) {
      const texts = [
        group.label,
        ...(group.participants ?? []),
        ...group.leaders,
      ];
      const textLines = texts.reduce(
        (count, text) => count + (text ? Math.ceil(text.length / 12) : 0),
        0
      );
      const badgeLines = (group.badges ?? (group.name ? [group] : [])).reduce(
        (count, badge) => count + Math.ceil(badge.name.length / 12),
        0
      );
      const rowHeight = Math.max(28, 12 + textLines * 14 + badgeLines * 16);
      if (sectionGroups.length && height + rowHeight > 600) {
        sections.push({ table, sectionGroups });
        sectionGroups = [];
        height = 0;
      }
      sectionGroups.push(group);
      height += rowHeight;
    }
    if (sectionGroups.length) sections.push({ table, sectionGroups });
    return sections;
  });
  return (
    <View style={{ gap: 16 }}>
      {sections.map(({ table, sectionGroups }) => {
        const ids = sectionGroups.map((group) => `${table[0].id}_${group.id}`);

        return (
          // a short last table keeps the column width of the full ones
          <View
            key={`${table[0].id}_${sectionGroups[0].id}`}
            wrap={false}
            style={{
              width: GROUP_WIDTH + table.length * TURN_WIDTH + 2 * BORDER_WIDTH,
            }}
          >
            <View
              minPresenceAhead={LABELS_PRESENCE_AHEAD}
              style={{
                ...styles.row,
                border: BORDER,
                borderBottom: 'none',
                borderTopLeftRadius: RADIUS(),
                borderTopRightRadius: RADIUS(),
              }}
            >
              <View
                style={{
                  width: GROUP_WIDTH,
                  justifyContent: 'center',
                  padding: 6,
                  minHeight: 28,
                  backgroundColor: '#D5DFFD',
                  borderTopLeftRadius: RADIUS(),
                }}
              >
                <Text
                  style={{
                    ...styles.monthHeading,
                    fontSize: 9,
                    marginBottom: 0,
                  }}
                >
                  {t('tr_responsible')}
                </Text>
              </View>
              {table.map((turn, index) => (
                <View
                  key={turn.id}
                  style={{
                    ...styles.turnLabel,
                    width: TURN_WIDTH,
                    minHeight: 28,
                    backgroundColor: '#D5DFFD',
                    borderTopRightRadius:
                      index === table.length - 1 ? RADIUS() : 0,
                  }}
                >
                  {turn.label.map((line) => (
                    <Text key={line}>{line}</Text>
                  ))}
                </View>
              ))}
            </View>

            {sectionGroups.map((group, index) => (
              <View
                key={ids[index]}
                wrap={false}
                style={{
                  ...styles.row,
                  ...tableRow({
                    ...rowEdges(ids, index, rowPages),
                    first: false,
                  }),
                }}
              >
                <RowPageProbe id={ids[index]} onRowPage={onRowPage} />

                <View style={{ ...styles.turnsGroup, width: GROUP_WIDTH }}>
                  <View
                    style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}
                  >
                    {(group.badges ?? (group.name ? [group] : [])).map(
                      (badge) => (
                        <Text
                          key={`${badge.name}_${badge.color}`}
                          style={{
                            ...styles.badge,
                            maxWidth: '100%',
                            backgroundColor: alpha(badge.color, 0.15),
                            color: darken(badge.color, 0.3),
                          }}
                        >
                          {badge.name}
                        </Text>
                      )
                    )}
                  </View>
                  {!!group.label && (
                    <Text style={styles.responsible}>{group.label}</Text>
                  )}
                  {group.participants?.map((name) => (
                    <Text key={name} style={styles.leader}>
                      {name}
                    </Text>
                  ))}
                  {group.leaders.map((name, position) => (
                    <Text
                      key={name}
                      style={
                        (
                          group.badges
                            ? name === group.responsible
                            : position === 0
                        )
                          ? styles.responsible
                          : styles.leader
                      }
                    >
                      {name}
                    </Text>
                  ))}
                </View>

                {table.map((turn) => (
                  <View
                    key={turn.id}
                    style={{
                      ...styles.turnCell,
                      width: TURN_WIDTH,
                      ...(turn.groups.includes(group.id) && {
                        backgroundColor: BLUE_MAIN(),
                      }),
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};

export default CleaningTurns;
