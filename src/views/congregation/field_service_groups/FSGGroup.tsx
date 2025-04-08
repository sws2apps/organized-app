import { View, Text } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';
import { FSGGroupType } from './index.types';
import FSGGroupMember from './FSGGroupMember';
import styles from './index.styles';

const FSGGroup = ({ group }: FSGGroupType) => {
  const groupMembersCount =
    group.publishers.length +
    (group.overseer && 1) +
    (group.overseerAssistant && 1);

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
            {groupMembersCount}
          </Text>
        </View>
      </View>

      <View style={styles.groupListContainer}>
        {(group.overseer || group.overseerAssistant) && (
          <>
            <View style={styles.groupOverseers}>
              {group.overseer && (
                <Text
                  style={{
                    ...styles.groupOverseerText,
                    color: getCSSPropertyValue(`--group-${group.group_number}`),
                  }}
                >
                  {group.overseer}
                </Text>
              )}
              {group.overseerAssistant && (
                <Text
                  style={{
                    ...styles.groupOverseerAssistantText,
                    color: getCSSPropertyValue(`--group-${group.group_number}`),
                  }}
                >
                  {group.overseerAssistant}
                </Text>
              )}
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
