import { SchemaFieldServiceGroup } from '@services/dexie/schema';
import {
  FieldServiceGroupType,
  FieldServiceGroupMemberType,
} from '@definition/field_service_groups';

export const addPersonToGroupBySortIndex = (
  groupsArray: FieldServiceGroupType[],
  person_uuid: string,
  sort_index: number
) => {
  //1. Testing whether sortIndex exists in groupsArray
  if (!groupsArray.some((g) => g.group_data.sort_index === sort_index)) {
    //2. If not, create new group with that id and push to groupsArray
    const newGroup = structuredClone(SchemaFieldServiceGroup);
    newGroup.group_id = crypto.randomUUID();
    newGroup.group_data.sort_index = sort_index;
    newGroup.group_data.updatedAt = new Date().toISOString();
    groupsArray.push(newGroup);
  }

  const group = groupsArray.find((g) => g.group_data.sort_index === sort_index);
  //3. Add person to that group if not already there
  if (!group.group_data.members.some((m) => m.person_uid === person_uuid)) {
    const members = group.group_data.members;
    const nextSortIndex = members.length
      ? Math.max(...members.map((m) => m.sort_index)) + 1
      : 2;
    const newMember = {
      isAssistant: false,
      isOverseer: false,
      person_uid: person_uuid,
      sort_index: nextSortIndex,
    };
    group.group_data.members.push(newMember);
    group.group_data.updatedAt = new Date().toISOString();
  }
};

export const addGroupMembersToGroup = (
  group: FieldServiceGroupType,
  newMembers: FieldServiceGroupMemberType[]
) => {
  const members = group.group_data.members;
  //1. determine start sort index for new memebers
  const nextSortIndex = members.length
    ? Math.max(...members.map((m) => m.sort_index)) + 1
    : 2;

  //2. assign correct sort index to new members
  newMembers.forEach((member, index) => {
    member.sort_index = index + nextSortIndex;
  });

  //3. add new members to group
  group.group_data.members = [...members, ...newMembers];
  group.group_data.updatedAt = new Date().toISOString();
};
