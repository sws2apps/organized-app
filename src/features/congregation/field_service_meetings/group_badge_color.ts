import { GroupBadgeProps } from '@components/group_badge/index.types';
import { FieldServiceGroupType } from '@definition/field_service_groups';

/**
 * Color token for a group's displayed position, cycling `group-1 … group-10`
 * so any number of groups stays within the palette.
 */
export const getGroupBadgeColor = (
  groupIndex: number
): GroupBadgeProps['color'] =>
  `group-${(groupIndex % 10) + 1}` as GroupBadgeProps['color'];

/** The group's color, or `accent-main` for a meeting without a group. */
export const resolveGroupBadgeColor = (
  groups: FieldServiceGroupType[],
  groupId?: string
): GroupBadgeProps['color'] => {
  // Match the Groups page: deleted groups do not occupy a displayed color slot.
  const index = groupId
    ? groups
        .filter((group) => !group.group_data._deleted)
        .toSorted((a, b) => a.group_data.sort_index - b.group_data.sort_index)
        .findIndex((group) => group.group_id === groupId)
    : -1;

  return index >= 0 ? getGroupBadgeColor(index) : 'accent-main';
};
