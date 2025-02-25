import { Text, View } from '@react-pdf/renderer';
import { fontSize } from './fontOverride';
import { S140SourceSimpleType } from '../shared/index.types';
import styles from './index.styles';

const S140SourceSimple = ({
  source,
  bulletColor,
  lang,
}: S140SourceSimpleType) => {
  return (
    <View
      style={{
        width: '270px',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: '-1px',
      }}
    >
      <Text style={{ ...styles.bulletPoint, color: bulletColor }}>
        {'\u2022'}
      </Text>
      <Text
        style={{ fontSize: fontSize.source[lang] || fontSize.source.default }}
      >
        {source}
      </Text>
    </View>
  );
};

export default S140SourceSimple;
