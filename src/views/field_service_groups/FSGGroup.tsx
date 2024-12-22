import { View, Text } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';
import { FSGGroupType } from './index.types';
import FSGGroupMember from './FSGGroupMember';
import styles from './index.styles';

const FSGGroup = ({ group }: FSGGroupType) => {
  return (
    <View style={styles.groupContainer}>
      <View
        style={{
          ...styles.groupTitleContainer,
          backgroundColor: getCSSPropertyValue(`--group-${group.group_number}`),
        }}
      >
        <Text style={styles.groupTitle}>{group.group_name}</Text>
        <View style={styles.membersCountContainer}>
          <Text
            style={{
              ...styles.membersCount,
              color: getCSSPropertyValue(`--group-${group.group_number}`),
            }}
          >
            {group.overseers.length + group.publishers.length}
          </Text>
        </View>
      </View>

      <View style={styles.groupListContainer}>
        {group.overseers.length > 0 && (
          <>
            <View style={styles.groupOverseers}>
              {group.overseers.map((person) => (
                <Text
                  key={person}
                  style={{
                    ...styles.groupOverseerText,
                    color: getCSSPropertyValue(`--group-${group.group_number}`),
                  }}
                >
                  {person}
                </Text>
              ))}
            </View>
            <View style={styles.dashedDivider} />
          </>
        )}

        <View style={styles.groupMemberList}>
          {group.publishers.map((publisher) => (
            <FSGGroupMember key={publisher} member={publisher} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default FSGGroup;
