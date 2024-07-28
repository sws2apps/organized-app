import { Text, View } from '@react-pdf/renderer';
import { S140SourceType } from './index.types';
import styles from './index.styles';

const S140Source = ({
  node,
  secondary,
  source,
  color,
  duration,
}: S140SourceType) => {
  return (
    <View style={styles.sourceContainer}>
      {source && (
        <View style={styles.sourceTextContainer}>
          <Text style={{ ...styles.sourceText, color }}>{source}</Text>
          {duration && <Text style={styles.sourceDuration}>({duration})</Text>}
        </View>
      )}

      {node}

      {secondary && <Text style={styles.sourceSecondary}>{secondary}</Text>}
    </View>
  );
};

export default S140Source;
