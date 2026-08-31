import { GroupBadgeProps } from '@components/group_badge/index.types';
import { FieldServiceGroupType } from '@definition/field_service_groups';

/**
 * Badge color token for a group's `sort_index`, cycling `group-1 … group-10`
 * so any number of groups stays within the palette.
 */
export const getGroupBadgeColor = (
  sortIndex: number
): GroupBadgeProps['color'] =>
  `group-${(sortIndex % 10) + 1}` as GroupBadgeProps['color'];

/** The group's color, or `accent-main` for a meeting without a group. */
export const resolveGroupBadgeColor = (
  groups: FieldServiceGroupType[],
  groupId?: string
): GroupBadgeProps['color'] => {
  const group = groupId
    ? groups.find((record) => record.group_id === groupId)
    : undefined;

  return group
    ? getGroupBadgeColor(group.group_data.sort_index)
    : 'accent-main';
};
