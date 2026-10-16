import { Text } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';
import { estimateWidth, splitWidth } from './index.utils';

type S140NamePairType = {
  primary?: string;
  secondary?: string;
  width: number;
  primaryStyle: Style;
  secondaryStyle: Style;
  lang: string;
};

const GAP = 3;

const fixedWidth = (width: number): Style => ({
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: `${width}px`,
});

const S140NamePair = ({
  primary,
  secondary,
  width,
  primaryStyle,
  secondaryStyle,
  lang,
}: S140NamePairType) => {
  const rlm = isRTL(lang) ? '\u200f' : '';
  const available = width - GAP;
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

  const first = splitWidth(primaryWidth, secondaryWidth, available);

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
