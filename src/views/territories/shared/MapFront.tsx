import { useAppTranslation } from '@hooks/index';
import { Image, Text, View } from '@react-pdf/renderer';
import { TerritoryPrintData } from '@views/territories/index.types';
import styles, { CHIP_HEIGHT, COLORS } from '@views/territories/index.styles';
import { titleOf } from '@views/territories/shared/title';
import Shadow from '@views/territories/shared/Shadow';
import WarningChip from '@views/territories/shared/WarningChip';
import { fits, textWidth } from '@views/territories/shared/textWidth';

const INSET = 9;
const PADDING = 9;

const Chip = ({ text }: { text: string }) => (
  <View
    style={{
      // a step darker than the screen chip: printers drop the lightest greys
      backgroundColor: COLORS.divider,
      borderRadius: 2,
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
);

// the A5 map fills the card, and a white label floats over its bottom edge
const MapFront = ({
  territory,
  width,
  height,
}: {
  territory: TerritoryPrintData;
  width: number;
  height: number;
}) => {
  const { t } = useAppTranslation();

  const title = titleOf(territory);
  const households =
    territory.showHouseholds !== false && territory.households > 0
      ? t('tr_territoryHouseholdsWithCount', { n: territory.households })
      : '';
  const warning = territory.warning ?? '';

  const titleWidth = textWidth(title, 9, true);
  const householdsWidth = households ? textWidth(households, 7) + 10 + 4 : 0;
  const warningWidth = warning ? textWidth(warning, 7, true) + 20 + 4 : 0;
  // a long title keeps the households beside it; the warning gets its own row
  const row = width - 2 * INSET - 2 * PADDING;
  const warningInline = fits(
    titleWidth + 8 + warningWidth + householdsWidth,
    row
  );

  const warningChip = warning && <WarningChip text={warning} maxWidth={row} />;

  return (
    <View style={{ position: 'relative', width, height }}>
      {territory.mapImage ? (
        <Image
          src={territory.mapImage}
          style={{ width, height, objectFit: 'contain' }}
        />
      ) : (
        <View
          style={{
            width,
            height,
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

      <View
        style={{
          position: 'absolute',
          left: INSET,
          right: INSET,
          bottom: INSET,
        }}
      >
        <Shadow radius={6} drop={6} spread={10} opacity={0.0065} />

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 6,
            // one inset on every side: the badges sit as far from the top as from the right
            padding: PADDING,
            gap: 6,
          }}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}
          >
            <View style={{ flexDirection: 'row', flexShrink: 0, gap: 4 }}>
              {households && <Chip text={households} />}
              {warningInline && warningChip}
            </View>
            <Text style={{ flexGrow: 1, flexBasis: 0, textAlign: 'right' }}>
              <Text style={styles.frameName}>{title}</Text>
            </Text>
          </View>

          {!warningInline && warningChip && (
            <View style={{ flexDirection: 'row' }}>{warningChip}</View>
          )}

          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              paddingTop: 5,
              // react-pdf drops borders under 0.5 pt; 0.5 pt still prints on a home printer
              borderTop: `0.5px solid ${COLORS.divider}`,
            }}
          >
            <Text style={[styles.frameNote, { flexGrow: 1, flexBasis: 0 }]}>
              {t('tr_territoryPleaseKeepThisCardInTheEnvelopeDoNot')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MapFront;
