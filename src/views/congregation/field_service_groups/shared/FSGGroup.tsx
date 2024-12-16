import { View, Text } from '@react-pdf/renderer';
import { FSGGroupType } from './index.types';
import styles from './index.styles';
import { useAppTranslation } from '@hooks/index';
import FSGGroupMember from './FSGGroupMember';
import useFSGGroup from './useFSGGroup';
import { getCSSPropertyValue } from '@utils/common';

const FSGGroup = ({
  data,
  groupNumber,
  persons,
  fullnameOption,
}: FSGGroupType) => {
  const { t } = useAppTranslation();

  const groupName = data.group_data.name;
  const groupMembers = data.group_data.members;

  const { group_overseer, group_overseer_assistent, getMemberName } =
    useFSGGroup({ data, groupNumber, persons, fullnameOption });

  const getGroupTitle = () => {
    if (groupName !== '') {
      return (
        t('tr_groupNumber', { groupNumber: groupNumber }) + ` - ${groupName}`
      );
    }
    return t('tr_groupNumber', { groupNumber: groupNumber });
  };

  return (
    <View style={styles.groupContainer}>
      <View
        style={{
          ...styles.groupTitleContainer,
          backgroundColor: getCSSPropertyValue(`--group-${groupNumber}`),
        }}
      >
        <Text style={styles.groupTitle}>{getGroupTitle()}</Text>
        <View style={styles.membersCountContainer}>
          <Text
            style={{
              ...styles.membersCount,
              color: getCSSPropertyValue(`--group-${groupNumber}`),
            }}
          >
            {groupMembers.length}
          </Text>
        </View>
      </View>

      <View style={styles.groupListContainer}>
        {(group_overseer || group_overseer_assistent) && (
          <>
            <View style={styles.groupOverseers}>
              <Text
                style={{
                  ...styles.groupOverseerText,
                  color: getCSSPropertyValue(`--group-${groupNumber}`),
                }}
              >
                {getMemberName(group_overseer)}
              </Text>
              <Text
                style={{
                  ...styles.groupOverseerAssistentText,
                  color: getCSSPropertyValue(`--group-${groupNumber}`),
                }}
              >
                {getMemberName(group_overseer_assistent)}
              </Text>
            </View>
            <View style={styles.dashedDivider} />
          </>
        )}
        <View style={styles.groupMemberList}>
          {groupMembers.map(
            (member, index) =>
              !member.isOverseer &&
              !member.isAssistant && (
                <FSGGroupMember
                  data={member}
                  persons={persons}
                  fullnameOption={fullnameOption}
                  key={`fsg-group-member-${index}`}
                />
              )
          )}
        </View>
      </View>
    </View>
  );
};

export default FSGGroup;
