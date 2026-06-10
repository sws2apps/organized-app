import { useAtomValue } from 'jotai';
import { settingsState } from '@states/settings';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { formatDate, generateDateFromTime } from '@utils/date';
import { buildFieldServiceGroupLabel } from '@utils/common';
import { useAppTranslation } from '@hooks/index';
import useFieldServiceMeetingsPermissions from '@features/congregation/field_service_meetings/usePermissions';

export type RecurringTimeRow = {
  groupId: string;
  label: string;
  weekday: number | '';
  time: Date | null;
  readOnly: boolean;
};

const useRecurringTimes = () => {
  const { t } = useAppTranslation();
  const settings = useAtomValue(settingsState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const { canEditGroupTimes } = useFieldServiceMeetingsPermissions();

  const times = settings.cong_settings.field_service_meeting_times ?? [];

  const rows: RecurringTimeRow[] = groups
    .filter((group) => !group.group_data._deleted)
    .map((group) => {
      const record = times.find((item) => item.type === group.group_id);
      const weekday = record?.weekday.value;
      const time = record?.time.value;

      return {
        groupId: group.group_id,
        label: buildFieldServiceGroupLabel(
          t('tr_group'),
          group.group_data.sort_index + 1,
          group.group_data.name
        ),
        weekday: weekday === null || weekday === undefined ? '' : weekday,
        time: time ? generateDateFromTime(time) : null,
        readOnly: !canEditGroupTimes(group.group_id),
      };
    });

  const upsert = async (
    groupId: string,
    mutate: (
      record: NonNullable<
        typeof settings.cong_settings.field_service_meeting_times
      >[number]
    ) => void
  ) => {
    const arr = structuredClone(
      settings.cong_settings.field_service_meeting_times ?? []
    );

    let record = arr.find((item) => item.type === groupId);
    if (!record) {
      record = {
        type: groupId,
        weekday: { value: null, updatedAt: '' },
        time: { value: '', updatedAt: '' },
      };
      arr.push(record);
    }

    mutate(record);

    await dbAppSettingsUpdate({
      'cong_settings.field_service_meeting_times': arr,
    });
  };

  const handleDayChange = async (groupId: string, value: number) => {
    await upsert(groupId, (record) => {
      record.weekday.value = value;
      record.weekday.updatedAt = new Date().toISOString();
    });
  };

  const handleTimeChange = async (groupId: string, value: Date | null) => {
    const time = value ? formatDate(value, 'HH:mm') : '';
    await upsert(groupId, (record) => {
      record.time.value = time;
      record.time.updatedAt = new Date().toISOString();
    });
  };

  return { rows, handleDayChange, handleTimeChange };
};

export default useRecurringTimes;
