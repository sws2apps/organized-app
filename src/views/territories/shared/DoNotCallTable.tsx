import { useAppTranslation } from '@hooks/index';
import { Path, Svg, Text, View } from '@react-pdf/renderer';
import { CANCEL_CIRCLE_PATH } from '@icons/cancel_circle_path';
import { DoNotCall } from '@definition/territory';
import styles, { COLORS } from '@views/territories/index.styles';

export const ROW = 16;

const cells = {
  wide: { flexGrow: 2, flexBasis: 0 },
  date: { width: 74 },
};

const Cell = ({
  text,
  style,
  last = false,
  head = false,
  strong = false,
}: {
  text?: string;
  style: { flexGrow?: number; flexBasis?: number; width?: number };
  last?: boolean;
  head?: boolean;
  strong?: boolean;
}) => (
  <View
    style={{
      ...style,
      justifyContent: 'center',
      paddingLeft: 6,
      paddingRight: 6,
      borderRight: last ? undefined : `1px solid ${COLORS.line}`,
    }}
  >
    <Text
      style={[
        strong ? styles.rowAddress : styles.rowText,
        head ? styles.columnTitle : {},
      ]}
    >
      {text ?? ''}
    </Text>
  </View>
);

const Row = ({
  values,
  phone,
  head = false,
  last = false,
  shaded = false,
}: {
  values: [string?, string?, string?];
  phone: boolean;
  head?: boolean;
  last?: boolean;
  shaded?: boolean;
}) => (
  <View
    style={{
      flexDirection: 'row',
      height: ROW,
      flexShrink: 0,
      // react-pdf drops text in clipped views, so the corners are rounded here instead
      borderBottom: last ? undefined : `1px solid ${COLORS.line}`,
      backgroundColor: head ? COLORS.chip : undefined,
      ...(shaded && !head ? { backgroundColor: COLORS.zebra } : {}),
      borderTopLeftRadius: head ? 2 : 0,
      borderTopRightRadius: head ? 2 : 0,
      borderBottomLeftRadius: last ? 2 : 0,
      borderBottomRightRadius: last ? 2 : 0,
    }}
  >
    <Cell text={values[0]} style={cells.wide} head={head} strong />
    {!phone && <Cell text={values[1]} style={cells.wide} head={head} />}
    <Cell text={values[2]} style={cells.date} head={head} last />
  </View>
);

// empty ruled lines fill the rest of the card, so new addresses can be written in by hand
// a phone territory lists numbers, which have no householder name
const DoNotCallTable = ({
  entries,
  blank,
  phone = false,
}: {
  entries: DoNotCall[];
  blank: number;
  phone?: boolean;
}) => {
  const { t } = useAppTranslation();
  return (
    <View
      style={{
        border: `1px solid ${COLORS.line}`,
        borderRadius: 3,
      }}
    >
      <Row
        head
        phone={phone}
        values={[
          phone ? t('tr_number') : t('tr_address'),
          t('tr_name'),
          t('tr_date'),
        ]}
      />
      {entries.map((entry, index) => (
        <Row
          key={entry.id}
          phone={phone}
          last={!blank && index === entries.length - 1}
          shaded={index % 2 === 1}
          values={[entry.address, entry.name, entry.date]}
        />
      ))}
      {Array.from({ length: blank }, (_, index) => (
        <Row
          key={index}
          phone={phone}
          values={[]}
          last={index === blank - 1}
          shaded={(entries.length + index) % 2 === 1}
        />
      ))}
    </View>
  );
};

export const DoNotCallHeader = ({ count }: { count: number }) => {
  const { t } = useAppTranslation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: COLORS.dncChip,
        borderRadius: 3,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      <Svg width={11} height={11} viewBox="0 0 24 24">
        <Path d={CANCEL_CIRCLE_PATH} fill={COLORS.dncText} />
      </Svg>
      <Text style={[styles.chipText, { color: COLORS.dncText, flexGrow: 1 }]}>
        {t('tr_territoryDoNotCallLabel')}
      </Text>
      {count > 0 && (
        <View
          style={{
            minWidth: 14,
            height: 12,
            borderRadius: 2,
            backgroundColor: COLORS.dncText,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <Text style={{ fontSize: 7, fontWeight: 600, color: '#FFFFFF' }}>
            {count}
          </Text>
        </View>
      )}
    </View>
  );
};

// a card has room for so many lines; the older ones that do not fit are counted
export const MoreEntries = ({ count }: { count: number }) => {
  const { t } = useAppTranslation();
  return count > 0 ? (
    <Text style={styles.fine}>
      {t('tr_territoryOlderInTheApp', { n: count })}
    </Text>
  ) : null;
};

export default DoNotCallTable;
