import { Path, Svg, Text, View } from '@react-pdf/renderer';
import styles, { CHIP_HEIGHT, COLORS } from '@views/territories/index.styles';
import { fitText } from '@views/territories/shared/textWidth';

const SIZE = 7;
// padding, border, sign and gap around the text
const FRAME = 20;

// red like the do-not-call marks, with a sign, so it still reads on a black and white print
const WarningChip = ({
  text,
  maxWidth,
  radius = 2,
}: {
  text: string;
  // the room its row has: past it the text ends in an ellipsis
  maxWidth: number;
  // the badges over the map are rounder than the label's chips
  radius?: number;
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      maxWidth,
      backgroundColor: COLORS.dncChip,
      border: `0.5px solid ${COLORS.dncText}`,
      borderRadius: radius,
      height: CHIP_HEIGHT,
      paddingLeft: 4,
      paddingRight: 5,
    }}
  >
    <Svg width={7} height={7} viewBox="0 0 24 24">
      <Path
        d="M12 3 L22 20 H2 Z"
        fill="none"
        stroke={COLORS.dncText}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <Path
        d="M12 9.5 V14.5 M12 17 V17.4"
        stroke={COLORS.dncText}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </Svg>
    <Text
      style={[
        styles.households,
        {
          fontSize: SIZE,
          fontWeight: 600,
          color: COLORS.dncText,
          // should the estimate run short, the line still breaks at a word
          maxLines: 1,
        },
      ]}
    >
      {fitText(text, SIZE, maxWidth - FRAME, true)}
    </Text>
  </View>
);

export default WarningChip;
