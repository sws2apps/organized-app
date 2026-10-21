import {
  type HallCleaningExportRowType,
  CleaningRowsProps,
} from '@views/activities/hall_cleaning/index.types';
import { Text, View } from '@react-pdf/renderer';
import IconCalendar from '@views/components/icons/IconCalendar';
import styles, {
  BLUE_MAIN,
  BORDER_WIDTH,
  DIVIDER,
  RADIUS,
  tableRow,
} from '@views/activities/hall_cleaning/index.styles';
import rowEdges from '@views/activities/hall_cleaning/rowEdges';
import RowPageProbe from '@views/activities/hall_cleaning/RowPageProbe';
import { cleaningMonths } from '@views/activities/hall_cleaning/cleaningMonths';
import MajorCleaningDetails from '@views/activities/hall_cleaning/MajorCleaningDetails';

const rowDetails = (row: HallCleaningExportRowType) => {
  if (row.isMajor) return <MajorCleaningDetails row={row} />;
  return (
    <>
      {!!row.participants?.length && (
        <Text style={styles.responsible}>{row.participants.join(', ')}</Text>
      )}
      {row.responsible && (
        <Text style={styles.responsible}>{row.responsible}</Text>
      )}
      {row.persons.length > 0 && (
        <Text style={styles.person}>{row.persons.join(', ')}</Text>
      )}
    </>
  );
};

const rowBadges = (row: HallCleaningExportRowType, hasNames: boolean) => {
  if (row.isMajor)
    return (
      <Text
        style={{
          ...styles.badge,
          backgroundColor: BLUE_MAIN(),
          maxWidth: '100%',
          flexShrink: 1,
        }}
      >
        {row.label}
      </Text>
    );
  let groups = row.groups ?? [];
  if (!groups.length && row.group) groups = [row.group];
  if (row.participants?.length || !groups.length) return null;
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: hasNames ? 'flex-end' : 'flex-start',
        alignItems: 'center',
        gap: 4,
        maxWidth: hasNames ? '40%' : '100%',
        flexShrink: 1,
      }}
    >
      {groups.map((group) => (
        <Text
          key={`${group.name}:${group.color}`}
          style={{
            ...styles.badge,
            backgroundColor: group.color,
          }}
        >
          {group.name}
        </Text>
      ))}
    </View>
  );
};

const CleaningList = ({ rows, rowPages, onRowPage }: CleaningRowsProps) => {
  // Keep one date-column width throughout the document, allowing longer weekdays
  // more room without letting them crowd the assignment details.
  const dateWidth = Math.min(
    100,
    Math.max(
      64,
      ...rows.map((row) => Array.from(row.weekday ?? '').length * 4.8 + 16)
    )
  );

  return (
    <View>
      {cleaningMonths(rows).map(({ month, rows: entries }, monthIndex) => {
        const ids = entries.map((row) => row.id);
        const renderRow = (
          row: CleaningRowsProps['rows'][number],
          index: number
        ) => {
          const edges = rowEdges(ids, index, rowPages);
          const attachedHeader = !!month && index === 0;
          const first = edges.first && !attachedHeader;
          const hasNames = !!(
            row.isMajor ||
            row.participants?.length ||
            row.responsible ||
            row.persons.length
          );
          return (
            <View
              key={row.id}
              wrap={false}
              style={{
                ...styles.row,
                ...tableRow({
                  ...edges,
                  first,
                  overlap: false,
                }),
                ...(!first && {
                  borderTop: 'none',
                  paddingTop: BORDER_WIDTH,
                }),
                ...(!edges.last && {
                  borderBottom: 'none',
                  paddingBottom: BORDER_WIDTH,
                }),
              }}
            >
              <RowPageProbe id={row.id} onRowPage={onRowPage} />
              <View
                style={{
                  ...styles.listDate,
                  width: dateWidth,
                  flexShrink: 0,
                  gap: 2,
                  alignItems: 'flex-start',
                  paddingLeft: 10,
                  paddingRight: 6,
                  borderTopLeftRadius: first ? RADIUS() : 0,
                  borderBottomLeftRadius: edges.last ? RADIUS() : 0,
                }}
              >
                {row.weekday && (
                  <Text
                    style={{ fontSize: 8, fontWeight: 400, color: '#606D93' }}
                  >
                    {row.weekday}
                  </Text>
                )}
                <Text>{row.date}</Text>
              </View>
              <View style={styles.listContent}>
                {hasNames && (
                  <View style={styles.persons}>{rowDetails(row)}</View>
                )}
                {rowBadges(row, hasNames)}
              </View>
              {(!edges.first || attachedHeader) && (
                <View
                  style={{
                    position: 'absolute',
                    left: 0.5,
                    right: 0.5,
                    top: 0,
                    borderTop: DIVIDER,
                  }}
                />
              )}
            </View>
          );
        };
        return (
          <View
            key={month || monthIndex}
            style={{ marginTop: monthIndex > 0 ? 14 : 0 }}
          >
            <View wrap={false}>
              {month && (
                <View
                  style={{
                    ...tableRow({ first: true, last: false, overlap: false }),
                    borderBottom: 'none',
                    backgroundColor: '#D5DFFD',
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
              {renderRow(entries[0], 0)}
            </View>
            {entries.slice(1).map((row, index) => renderRow(row, index + 1))}
          </View>
        );
      })}
    </View>
  );
};
export default CleaningList;
