import { Image, Text, View } from '@react-pdf/renderer';
import { TerritoryPrintData } from '../index.types';
import styles, { CARD, COLORS } from '../index.styles';

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
        <View style={{ flexDirection: 'row', gap: 4, flexGrow: 1 }}>
          <Text style={styles.metaLabel}>Locality:</Text>
          <Text style={styles.metaValue}>{territory.city}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 4 }}>
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
        {showMap && territory.mapImage && (
          <Image
            src={territory.mapImage}
            style={{ width: inner, height: mapHeight, objectFit: 'cover' }}
          />
        )}

        {(!showMap || !territory.mapImage) && (
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
