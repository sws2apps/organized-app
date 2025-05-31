import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { AuxClassGroupProps } from './index.types';
import { fieldGroupsState } from '@states/field_service_groups';
import { midweekMeetingAssigFSGState } from '@states/settings';

export default function useAuxClassGroup({ week }: AuxClassGroupProps) {
  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const fieldGroups = useAtomValue(fieldGroupsState);
  const enabled = useAtomValue(midweekMeetingAssigFSGState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const aux_fsg = useMemo(() => {
    if (!schedule) return '';

    return schedule.midweek_meeting.aux_fsg?.value || '';
  }, [schedule]);

  const value = useMemo(() => {
    if (!enabled) return;

    if (aux_fsg.length === 0) return;

    const group = fieldGroups.find((record) => record.group_id === aux_fsg);

    if (!group) return;

    if (group.group_data.name.length === 0) {
      return t('tr_groupNumber', {
        groupNumber: group.group_data.sort_index + 1,
      });
    }

    return t('tr_groupName', { groupName: group.group_data.name });
  }, [aux_fsg, enabled, fieldGroups, t]);

  return { value };
}
