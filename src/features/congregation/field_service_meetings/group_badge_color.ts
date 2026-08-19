import { GroupBadgeProps } from '@components/group_badge/index.types';
import { FieldServiceGroupType } from '@definition/field_service_groups';

/**
 * Map a field-service group's `sort_index` to its badge color token.
 *
 * Colors cycle `group-1 … group-10` (1-based) so any number of groups stays
 * within the available palette. Shared by the meeting card and the month view
 * so both surfaces color a group identically.
 */
export const getGroupBadgeColor = (
  sortIndex: number
): GroupBadgeProps['color'] =>
  `group-${(sortIndex % 10) + 1}` as GroupBadgeProps['color'];

/**
 * Badge color for a meeting's group: the group's cycled color when the group
 * exists, `accent-main` for joint / service-overseer meetings without one.
 */
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
