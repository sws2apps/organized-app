import { Text, View } from '@react-pdf/renderer';
import { S89ClassType } from './index.types';
import styles from './index.styles';
import Checkbox from '@views/components/checkbox';

const CHECKBOX_SIZE = 13;

const S89Class = ({ name = '', checked = false }: S89ClassType) => {
  return (
    <View style={styles.classItem}>
      <Checkbox size={CHECKBOX_SIZE} checked={checked} />

      <Text style={styles.classLabel}>{name}</Text>
    </View>
  );
};

export default S89Class;
