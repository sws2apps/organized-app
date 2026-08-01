import { View, Text } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';
import { FSGGroupProps } from './index.types';
import FSGGroupMember from './FSGGroupMember';
import { cardWidth, columnWidth } from './packGroups';
import styles from './index.styles';

const FSGGroup = ({ card, fontSize }: FSGGroupProps) => {
  const { group, span, columns, membersCount } = card;

  const groupColor = getCSSPropertyValue(`--group-${group.group_number}`);

  return (
    <View wrap={false} style={{ width: cardWidth(span) }}>
      <View
        style={{
          ...styles.groupTitleContainer,
          backgroundColor: groupColor,
        }}
      >
        <Text style={{ ...styles.groupTitle, fontSize }}>
          {group.group_name}
        </Text>
        <View style={styles.membersCountContainer}>
          <Text
            style={{
              ...styles.membersCount,
              fontSize: fontSize - 2,
              color: groupColor,
            }}
          >
            {membersCount}
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
                    fontSize,
                    color: groupColor,
                  }}
                >
                  {group.overseer}
                </Text>
              )}
              {group.overseerAssistant && (
                <Text
                  style={{
                    ...styles.groupOverseerAssistantText,
                    fontSize,
                    color: groupColor,
                  }}
                >
                  {group.overseerAssistant}
                </Text>
              )}
            </View>
            <View style={styles.dashedDivider} />
          </>
        )}

        <View style={styles.groupColumns}>
          {columns.map((column, index) => (
            <View
              key={index}
              style={{ ...styles.groupMemberList, width: columnWidth(span) }}
            >
              {column.map((publisher) => (
                <FSGGroupMember
                  key={publisher}
                  member={publisher}
                  fontSize={fontSize}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FSGGroup;
