import { View, Text, Svg, Line } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';
import { FSGGroupProps } from './index.types';
import FSGGroupMember from './FSGGroupMember';
import {
  DIVIDER_HEIGHT,
  cardWidth,
  columnWidth,
  contentWidth,
  dividerDash,
} from './packGroups';
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
            <Svg width={contentWidth(span)} height={DIVIDER_HEIGHT}>
              <Line
                x1={0}
                y1={DIVIDER_HEIGHT / 2}
                x2={contentWidth(span)}
                y2={DIVIDER_HEIGHT / 2}
                style={{
                  ...styles.dashedDivider,
                  strokeDasharray: dividerDash(span),
                }}
              />
            </Svg>
          </>
        )}

        <View style={styles.groupColumns}>
          {columns.map((column) => (
            <View
              key={column.id}
              style={{ ...styles.groupMemberList, width: columnWidth(span) }}
            >
              {column.publishers.map((publisher) => (
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
