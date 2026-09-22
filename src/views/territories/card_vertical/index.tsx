import { Image, Page, Text, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { TerritoryPrintData, TerritoryTemplateProps } from '../index.types';
import styles, { COLORS } from '../index.styles';
import DoNotCallTable, {
  DoNotCallChip,
  MoreEntries,
} from '../shared/DoNotCallTable';
import { PhoneGrid } from '../shared/CardFront';

// an A4 sheet on its side, cut into two A5 halves: the map, and what goes with it
const HALF = 421;
const MAP_HEIGHT = 530;
const ROWS = 19;

const titleOf = (territory: TerritoryPrintData) =>
  [territory.number, territory.city].filter(Boolean).join(' – ');

const MapSide = ({
  territory,
  showMap,
}: {
  territory: TerritoryPrintData;
  showMap: boolean;
}) => (
  <View style={{ width: HALF, height: '100%' }}>
    <View style={{ position: 'relative', width: HALF, height: MAP_HEIGHT }}>
      {territory.type === 'phone' && (
        <View style={{ padding: 12 }}>
          <PhoneGrid
            numbers={territory.phoneNumbers ?? []}
            width={HALF - 24}
            columns={3}
          />
        </View>
      )}

      {territory.type !== 'phone' && showMap && territory.mapImage && (
        <Image
          src={territory.mapImage}
          style={{ width: HALF, height: MAP_HEIGHT, objectFit: 'cover' }}
        />
      )}

      {territory.type !== 'phone' && (!showMap || !territory.mapImage) && (
        <View
          style={{
            width: HALF,
            height: MAP_HEIGHT,
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
            right: 8,
            bottom: 8,
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

    <View
      style={{
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingLeft: territory.qrImage ? 8 : 20,
        paddingRight: 12,
      }}
    >
      {territory.qrImage && (
        <Image src={territory.qrImage} style={{ width: 56, height: 56 }} />
      )}

      <View style={{ gap: 3, flexGrow: 1, flexBasis: 0 }}>
        <Text style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>
          {titleOf(territory)}
        </Text>
        {territory.qrImage && (
          <Text style={styles.qrText}>
            The latest info about this area is available in the Organized app.
            Scan the QR code to view it.
          </Text>
        )}
      </View>
    </View>
  </View>
);

const DetailsSide = ({
  territory,
  printedOn,
}: {
  territory: TerritoryPrintData;
  printedOn: string;
}) => {
  const entries = territory.doNotCalls;
  const shown = entries.slice(0, ROWS);

  return (
    <View
      style={{
        width: HALF,
        height: '100%',
        padding: 12,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.text,
              flexGrow: 1,
            }}
          >
            {titleOf(territory)}
          </Text>
          <Text style={styles.fine}>Printed on {printedOn}</Text>
        </View>

        {entries.length > 0 && (
          <View style={{ gap: 2 }}>
            <DoNotCallChip />
            <DoNotCallTable entries={shown} />
            <MoreEntries count={entries.length - shown.length} />
          </View>
        )}
      </View>

      {!!territory.notes && (
        <View style={{ gap: 5 }}>
          <View style={[styles.chip, { backgroundColor: COLORS.chip }]}>
            <Text style={[styles.chipText, { color: COLORS.text }]}>Notes</Text>
          </View>
          <Text style={styles.notes}>{territory.notes}</Text>
        </View>
      )}
    </View>
  );
};

const TemplateTerritoryCardVertical = ({
  territories,
  lang,
  showMap = true,
  printedOn,
}: TerritoryTemplateProps) => (
  <Document title="Territory card" lang={lang}>
    {territories.map((territory) => (
      <Page
        key={territory.id}
        size="A4"
        orientation="landscape"
        style={{ backgroundColor: '#FFFFFF', flexDirection: 'row' }}
      >
        <MapSide territory={territory} showMap={showMap} />
        <DetailsSide territory={territory} printedOn={printedOn} />
      </Page>
    ))}
  </Document>
);

export default TemplateTerritoryCardVertical;
