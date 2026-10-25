import { useAppTranslation } from '@hooks/index';
import { Image, Text, View } from '@react-pdf/renderer';
import { TerritoryPrintData } from '@views/territories/index.types';
import styles, {
  CARD,
  CHIP_HEIGHT,
  COLORS,
} from '@views/territories/index.styles';
import { titleOf } from '@views/territories/shared/title';
import Shadow from '@views/territories/shared/Shadow';
import WarningChip from '@views/territories/shared/WarningChip';

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

const MapBadge = ({ text, radius = 4 }: { text: string; radius?: number }) => (
  <View style={{ position: 'relative' }}>
    <Shadow radius={radius} spread={3} drop={2} />
    <View
      style={{
        backgroundColor: COLORS.paper,
        border: `0.5px solid ${COLORS.line}`,
        borderRadius: radius,
        height: CHIP_HEIGHT,
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      <Text style={[styles.households, { fontSize: 7, fontWeight: 400 }]}>
        {text}
      </Text>
    </View>
  </View>
);

const CardFront = ({
  territory,
  width,
  height,
  printedOn,
  titleAtBottom = false,
}: {
  territory: TerritoryPrintData;
  width: number;
  height: number;
  // the A5 card has its date on the back, so only the S-12 shows it here
  printedOn?: string;
  // A5 titles sit at the outer bottom corner for browsing cards in sleeves.
  titleAtBottom?: boolean;
}) => {
  const { t } = useAppTranslation();

  const inner = width - CARD.padding * 2;
  const mapHeight = height - CARD.mapTop - CARD.footerHeight;

  const heading = (
    <View
      style={{
        height: CARD.mapTop,
        paddingTop: titleAtBottom ? 0 : 9,
        alignItems: titleAtBottom ? 'center' : 'flex-start',
        flexDirection: 'row',
      }}
    >
      <Text
        style={{ width: inner, textAlign: titleAtBottom ? 'right' : 'left' }}
      >
        {!titleAtBottom && (
          <Text style={[styles.frameTitle, { fontSize: 11 }]}>
            {t('tr_territoryTerritoryMapCard')}
            {'\u2002'}
          </Text>
        )}
        <Text style={[styles.frameName, { fontSize: 11 }]}>
          {titleOf(territory)}
        </Text>
      </Text>
    </View>
  );

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        paddingLeft: CARD.padding,
        paddingRight: CARD.padding,
      }}
    >
      {!titleAtBottom && heading}

      <View
        style={{
          position: 'relative',
          width: inner,
          height: mapHeight,
        }}
      >
        {territory.type === 'phone' && (
          <PhoneGrid
            numbers={territory.phoneNumbers ?? []}
            blocked={territory.doNotCalls.map((entry) => entry.address)}
            width={inner}
          />
        )}

        {territory.type !== 'phone' && territory.mapImage && (
          <Image
            src={territory.mapImage}
            style={{
              width: inner,
              height: mapHeight,
              objectFit: 'contain',
              borderRadius: 6,
            }}
          />
        )}

        {territory.type !== 'phone' && !territory.mapImage && (
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
              {t('tr_territoryThisTerritoryHasNoBordersOnTheMapYet')}
            </Text>
          </View>
        )}

        {territory.type !== 'phone' && (
          <View
            style={{
              position: 'absolute',
              left: 8,
              right: 8,
              bottom: 8,
              alignItems: titleAtBottom ? 'flex-start' : 'flex-end',
              gap: 4,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {printedOn && (
                <MapBadge
                  text={t('tr_territoryPrintedOn', { date: printedOn })}
                />
              )}
              {territory.showHouseholds !== false &&
                territory.households > 0 && (
                  <MapBadge
                    radius={titleAtBottom ? 2 : 4}
                    text={t('tr_territoryHouseholdsWithCount', {
                      n: territory.households,
                    })}
                  />
                )}
            </View>
            {/* the warning gets the whole bottom row to itself */}
            {territory.warning && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: titleAtBottom ? 'flex-start' : 'flex-end',
                  width: '100%',
                }}
              >
                <WarningChip
                  text={territory.warning}
                  maxWidth={inner - 16}
                  radius={titleAtBottom ? 2 : 4}
                />
              </View>
            )}
          </View>
        )}
      </View>

      {titleAtBottom && heading}

      <View style={{ height: CARD.footerHeight, justifyContent: 'center' }}>
        <Text style={[styles.a5CareMessage, { width: inner }]}>
          {t('tr_territoryPleaseKeepThisCardInTheEnvelopeDoNot')}
        </Text>
      </View>
    </View>
  );
};

export default CardFront;
