import { Text } from '@react-pdf/renderer';
import { FSGGroupMemberType } from './index.types';
import styles from './index.styles';
import useFSGGroupMember from './useFSGGroupMember';

const FSGGroupMember = (props: FSGGroupMemberType) => {
  const { member_name } = useFSGGroupMember(props);

  return <Text style={styles.groupMember}>{member_name}</Text>;
};

export default FSGGroupMember;
