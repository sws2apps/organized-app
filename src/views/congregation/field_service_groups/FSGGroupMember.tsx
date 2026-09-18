import { Text } from '@react-pdf/renderer';
import { FSGGroupMemberProps } from './index.types';
import styles from './index.styles';

const FSGGroupMember = ({ member, fontSize }: FSGGroupMemberProps) => {
  return <Text style={{ ...styles.groupMember, fontSize }}>{member}</Text>;
};

export default FSGGroupMember;
