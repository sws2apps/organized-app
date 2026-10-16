import { Text } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

type S140NamePairType = {
  primary?: string;
  secondary?: string;
  width: number;
  primaryStyle: Style;
  secondaryStyle: Style;
  lang: string;
};

const GAP = 3;

// rough Inter widths at 7pt, enough to decide how two names share the cell
const estimateWidth = (text: string, weight: number) =>
  text.length * (weight >= 500 ? 3.9 : 3.7);

const fixedWidth = (width: number): Style => ({
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: `${width}px`,
});

// once two names do not fit, each keeps at least half of the cell
const S140NamePair = ({
  primary,
  secondary,
  width,
  primaryStyle,
  secondaryStyle,
  lang,
}: S140NamePairType) => {
  const rlm = isRTL(lang) ? '‏' : '';
  const available = width - GAP;
  const half = available / 2;
  const primaryWidth = estimateWidth(`${primary},`, 500);
  const secondaryWidth = estimateWidth(secondary ?? '', 400);

  if (!secondary || primaryWidth + secondaryWidth <= available) {
    return (
      <Text style={[secondaryStyle, { flex: 1 }]}>
        {rlm}
        <Text style={primaryStyle}>{primary}</Text>
        {secondary && `, ${secondary}`}
      </Text>
    );
  }

  let first = half;

  if (primaryWidth <= half) first = primaryWidth;
  else if (secondaryWidth <= half) first = available - secondaryWidth;

  return (
    <>
      <Text style={[primaryStyle, fixedWidth(first)]}>
        {rlm}
        {primary},
      </Text>
      <Text
        style={[
          secondaryStyle,
          fixedWidth(available - first),
          applyRTL({ marginLeft: `${GAP}px` }, lang),
        ]}
      >
        {rlm}
        {secondary}
      </Text>
    </>
  );
};

export default S140NamePair;
