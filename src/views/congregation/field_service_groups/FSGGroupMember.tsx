import { Text } from '@react-pdf/renderer';
import { FSGGroupMemberProps } from './index.types';
import styles from './index.styles';

const FSGGroupMember = ({ member }: FSGGroupMemberProps) => {
  return <Text style={styles.groupMember}>{member}</Text>;
};

export default FSGGroupMember;
