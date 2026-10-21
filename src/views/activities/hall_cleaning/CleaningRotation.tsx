import { Text, View } from '@react-pdf/renderer';
import { alpha, darken } from '@mui/material/styles';
import type { CleaningMonthCardsProps } from '@views/activities/hall_cleaning/index.types';
import styles, {
  BORDER,
  CONTENT_WIDTH,
  DIVIDER,
  RADIUS,
} from '@views/activities/hall_cleaning/index.styles';

const CARD_WIDTH = (CONTENT_WIDTH - 10) / 2;
const DATE_WIDTH = (CARD_WIDTH - 16) * 0.3;

const RotationGroups = ({
  groups,
}: Pick<CleaningMonthCardsProps, 'groups'>) => (
  <View
    style={{
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      justifyContent: 'flex-start',
    }}
  >
    {groups.map((group) => (
      <Text
        key={group.id}
        style={{
          ...styles.badge,
          maxWidth: '100%',
          backgroundColor: alpha(group.color, 0.15),
          color: darken(group.color, 0.3),
        }}
      >
        {group.name}
      </Text>
    ))}
  </View>
);

const CleaningRotation = ({ groups, turns, rows }: CleaningMonthCardsProps) => {
  const frameStyle = { borderRadius: RADIUS(), overflow: 'hidden' as const };
  const groupById = new Map(groups.map((group) => [group.id, group]));
  const sections = new Map<
    string,
    {
      month: string;
      order: string;
      turns: typeof turns;
      events: typeof rows;
    }
  >();
  for (const turn of turns) {
    const month = turn.month ?? '';
    const section = sections.get(month) ?? {
      month,
      order: turn.startDate ?? turn.id,
      turns: [],
      events: [],
    };
    section.turns.push(turn);
    sections.set(month, section);
  }
  for (const event of rows.filter((row) => row.isMajor)) {
    const month = event.month ?? '';
    const section = sections.get(month) ?? {
      month,
      order: event.dateKey ?? event.id,
      turns: [],
      events: [],
    };
    section.events.push(event);
    sections.set(month, section);
  }
  const cards = [...sections.values()]
    .sort((a, b) => a.order.localeCompare(b.order))
    .flatMap((section) => {
      const items = [
        ...section.turns.map((turn) => ({ turn, event: undefined })),
        ...section.events.map((event) => ({ turn: undefined, event })),
      ];
      return Array.from(
        { length: Math.ceil(items.length / 6) },
        (_, index) => ({
          month: section.month,
          id: `${section.month}_${index}`,
          items: items.slice(index * 6, (index + 1) * 6),
        })
      );
    });
  const pairs = Array.from(
    { length: Math.ceil(cards.length / 2) },
    (_, index) => cards.slice(index * 2, index * 2 + 2)
  );

  return (
    <View style={{ gap: 10 }}>
      {pairs.map((pair) => (
        <View
          key={pair[0].id}
          wrap={false}
          style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}
        >
          {pair.map((card) => {
            const onlyTurn =
              card.items.length === 1 ? card.items[0].turn : undefined;
            const inlineTurn =
              onlyTurn?.label.length === 0 ? onlyTurn : undefined;
            const selectedGroups = (ids: string[]) =>
              ids.flatMap((id) => {
                const group = groupById.get(id);
                return group ? [group] : [];
              });
            return (
              <View
                key={card.id}
                style={{
                  width: CARD_WIDTH,
                  ...frameStyle,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    padding: inlineTurn ? 8 : 0,
                    gap: inlineTurn ? 8 : 0,
                  }}
                >
                  {inlineTurn && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: DATE_WIDTH + 8,
                        backgroundColor: styles.listDate.backgroundColor,
                      }}
                    />
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: 8,
                      padding: inlineTurn ? 0 : 8,
                      backgroundColor: styles.listDate.backgroundColor,
                      width: inlineTurn ? DATE_WIDTH : '100%',
                      flexShrink: 0,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.monthHeading,
                        fontSize: 9,
                        marginBottom: 0,
                        flexShrink: 1,
                      }}
                    >
                      {card.month}
                    </Text>
                  </View>
                  {inlineTurn && (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        minWidth: 0,
                      }}
                    >
                      <RotationGroups
                        groups={selectedGroups(inlineTurn.groups)}
                      />
                    </View>
                  )}
                </View>
                {!inlineTurn && (
                  <View style={{ padding: 8, gap: 8 }}>
                    {card.items.map(({ turn, event }, index) =>
                      turn ? (
                        <View
                          key={turn.id}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 8,
                          }}
                        >
                          {turn.label.length > 0 && (
                            <View
                              style={{
                                width: DATE_WIDTH,
                                flexShrink: 0,
                                gap: 2,
                              }}
                            >
                              {turn.label.map((label) => (
                                <Text
                                  key={label}
                                  style={{ fontSize: 8, color: '#606D93' }}
                                >
                                  {label}
                                </Text>
                              ))}
                            </View>
                          )}
                          <View style={{ flex: 1 }}>
                            <RotationGroups
                              groups={selectedGroups(turn.groups)}
                            />
                          </View>
                        </View>
                      ) : (
                        event && (
                          <View
                            key={event.id}
                            style={{
                              ...(index > 0 && {
                                borderTop: DIVIDER,
                                paddingTop: 8,
                              }),
                              flexDirection: 'row',
                              gap: 8,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 8,
                                color: '#606D93',
                                width: DATE_WIDTH,
                                flexShrink: 0,
                              }}
                            >
                              {event.date}
                            </Text>
                            <View style={{ flex: 1, gap: 3 }}>
                              <Text
                                style={{
                                  fontSize: 9,
                                  fontWeight: 600,
                                  color: styles.monthHeading.color,
                                }}
                              >
                                {event.label}
                              </Text>
                              {(!!event.participants?.length ||
                                !!event.group) && (
                                <Text style={{ fontSize: 9 }}>
                                  {event.participants?.length
                                    ? event.participants.join(', ')
                                    : event.group?.name}
                                </Text>
                              )}
                              {!!event.responsible && (
                                <Text style={{ fontSize: 9, fontWeight: 600 }}>
                                  {event.responsible}
                                </Text>
                              )}
                              {!!event.persons.length && (
                                <Text style={{ fontSize: 9 }}>
                                  {event.persons.join(', ')}
                                </Text>
                              )}
                            </View>
                          </View>
                        )
                      )
                    )}
                  </View>
                )}
                <View
                  style={{
                    ...frameStyle,
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    border: BORDER,
                  }}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
export default CleaningRotation;
