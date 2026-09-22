import { Image, Text, View } from '@react-pdf/renderer';
import { TerritoryPrintData } from '../index.types';
import styles, { CARD, COLORS } from '../index.styles';

const COLUMNS = 4;

const digits = (value: string) => value.replace(/\D/g, '');

const PhoneGrid = ({
  numbers,
  blocked,
  width,
}: {
  numbers: string[];
  // do-not-call numbers, struck through so they read on a black and white print
  blocked: string[];
  width: number;
}) => {
  const cell = (width - (COLUMNS - 1) * 4) / COLUMNS;
  const skip = new Set(blocked.map(digits));

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
      {numbers.map((number, index) => (
        <View
          key={`${index}-${number}`}
          style={{
            width: cell,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 4,
            paddingRight: 4,
            border: `1px solid ${COLORS.line}`,
            borderRadius: 4,
          }}
        >
          <View
            style={{
              minWidth: 15,
              height: 15,
              borderRadius: 999,
              backgroundColor: COLORS.numberChip,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 3,
              paddingRight: 3,
            }}
          >
            <Text style={styles.number}>{index + 1}</Text>
          </View>
          <Text
            style={[
              styles.phone,
              skip.has(digits(number))
                ? { color: COLORS.dncText, textDecoration: 'line-through' }
                : {},
            ]}
          >
            {number}
          </Text>
        </View>
      ))}
    </View>
  );
};

const CardFront = ({
  territory,
  width,
  height,
  showMap = true,
}: {
  territory: TerritoryPrintData;
  width: number;
  height: number;
  showMap?: boolean;
}) => {
  const inner = width - CARD.padding * 2;
  const mapHeight = height - CARD.mapTop - CARD.footerHeight;

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        paddingLeft: CARD.padding,
        paddingRight: CARD.padding,
        paddingTop: CARD.headerTop,
      }}
    >
      <Text style={styles.title}>Territory Map Card</Text>

      <View style={{ flexDirection: 'row', gap: 16, marginTop: 2 }}>
        <View style={[styles.metaField, { flexGrow: 1 }]}>
          <Text style={styles.metaLabel}>Locality:</Text>
          <Text style={styles.metaValue}>{territory.city}</Text>
        </View>

        <View style={[styles.metaField, { width: 110 }]}>
          <Text style={styles.metaLabel}>Terr. no:</Text>
          <Text style={styles.metaValue}>{territory.number}</Text>
        </View>
      </View>

      <View
        style={{
          position: 'relative',
          width: inner,
          height: mapHeight,
          marginTop: CARD.mapTop - CARD.headerTop - 24,
        }}
      >
        {territory.type === 'phone' && (
          <PhoneGrid
            numbers={territory.phoneNumbers ?? []}
            blocked={territory.doNotCalls.map((entry) => entry.address)}
            width={inner}
          />
        )}

        {territory.type !== 'phone' && showMap && territory.mapImage && (
          <Image
            src={territory.mapImage}
            style={{ width: inner, height: mapHeight, objectFit: 'cover' }}
          />
        )}

        {territory.type !== 'phone' && (!showMap || !territory.mapImage) && (
          <View
            style={{
              width: inner,
              height: mapHeight,
              border: `1px dashed ${COLORS.line}`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.fine}>
              This territory has no borders on the map yet
            </Text>
          </View>
        )}

        {territory.type !== 'phone' && (
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              backgroundColor: COLORS.paper,
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 6,
              paddingRight: 6,
            }}
          >
            <Text style={styles.households}>
              Households: {territory.households}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.fine, { marginTop: 5, width: inner }]}>
        Please keep this card in the envelope. Do not soil, mark, or bend it.
        Each time the territory is covered, please inform the brother who cares
        for the territory files.
      </Text>
    </View>
  );
};

export default CardFront;
