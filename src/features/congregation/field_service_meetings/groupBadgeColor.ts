import { GroupBadgeProps } from '@components/group_badge/index.types';

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
