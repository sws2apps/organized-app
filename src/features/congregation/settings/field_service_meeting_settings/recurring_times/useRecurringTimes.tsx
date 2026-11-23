import { useAtomValue, useSetAtom } from 'jotai';
import { settingsState } from '@states/settings';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { fieldServiceMeetingTimeSaveState } from '@states/field_service_meetings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
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
  const saveTime = useSetAtom(fieldServiceMeetingTimeSaveState);
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
        weekday: weekday ?? '',
        time: time ? generateDateFromTime(time) : null,
        readOnly: !canEditGroupTimes(group.group_id),
      };
    });

  const handleDayChange = async (groupId: string, value: number) => {
    try {
      await saveTime({ groupId, weekday: value });
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error instanceof Error ? error.message : String(error),
        severity: 'error',
      });
    }
  };

  const handleTimeChange = async (groupId: string, value: Date | null) => {
    const time = value ? formatDate(value, 'HH:mm') : '';
    try {
      await saveTime({ groupId, time });
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error instanceof Error ? error.message : String(error),
        severity: 'error',
      });
    }
  };

  return { rows, handleDayChange, handleTimeChange };
};

export default useRecurringTimes;
