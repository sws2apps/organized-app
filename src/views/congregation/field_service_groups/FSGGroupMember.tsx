import { Text } from '@react-pdf/renderer';
import { FSGGroupMemberType } from './index.types';
import styles from './index.styles';

const FSGGroupMember = ({ member }: FSGGroupMemberType) => {
  return <Text style={styles.groupMember}>{member}</Text>;
};

export default FSGGroupMember;
