import { Text, View } from '@react-pdf/renderer';
import { S140SourceType } from './index.types';
import styles from './index.styles';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

const S140Source = ({
  node,
  secondary,
  source,
  color,
  duration,
  lang,
}: S140SourceType) => {
  const stylesSmart = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <View style={stylesSmart.sourceContainer}>
      {source && (
        <View style={[stylesSmart.sourceTextContainer, { maxWidth: 330 }]}>
          <Text style={{ ...stylesSmart.sourceText, color }}>
            {rtl && '\u200f'}
            {source}
          </Text>
          {duration && (
            <Text style={stylesSmart.sourceDurationText}>
              {rtl && '\u200f'}({duration})
            </Text>
          )}
        </View>
      )}

      {node}

      {secondary && (
        <Text style={stylesSmart.sourceSecondary}>
          {rtl && '\u200f'}
          {secondary}
        </Text>
      )}
    </View>
  );
};

export default S140Source;
