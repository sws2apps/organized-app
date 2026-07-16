import { useCallback, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingLocation,
  FieldServiceMeetingType,
  FieldServiceMeetingFormattedType,
} from '@definition/field_service_meetings';
import { dbFieldServiceMeetingsSave } from '@services/dexie/field_service_meetings';
import {
  fieldServiceMeetingsActiveState,
  fieldServiceMeetingsEditingIdState,
  fieldServiceMeetingsFilterState,
  fieldServiceMeetingsState,
  fieldServiceMeetingsWeekRangeState,
} from '@states/field_service_meetings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { settingsState, userDataViewState } from '@states/settings';
import { fieldServiceMeetingData } from '@services/app/field_service_meetings';
import { formatDate, getWeekDate } from '@utils/date';
import useFieldServiceMeetingsPermissions from './usePermissions';
import { getGroupRecurringStart } from './recurring_prefill';
import { filterMeetingsByDataView } from './filter_meetings_by_data_view';

const createEmptyMeeting = (dataView: string): FieldServiceMeetingType => {
  const start = new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  // Note: top-level _deleted/updatedAt are legacy-only fields (migrated away
  // by dbFieldServiceMeetingsCleanup) — only meeting_data carries state.
  return {
    meeting_uid: crypto.randomUUID(),
    meeting_data: {
      _deleted: false,
      updatedAt: start.toISOString(),
      start: start.toISOString(),
      end: end.toISOString(),
      type: dataView,
      category: FieldServiceMeetingCategory.RegularMeeting,
      conductor: '',
      location: FieldServiceMeetingLocation.Publisher,
      group_id: dataView === 'main' ? undefined : dataView,
      address: '',
      additionalInfo: '',
    },
  };
};

const useFieldServiceMeetings = () => {
  const { t } = useAppTranslation();
  const { my_group } = useCurrentUser();
  const { myLedGroupIds } = useFieldServiceMeetingsPermissions();
  const dataView = useAtomValue(userDataViewState);
  const settings = useAtomValue(settingsState);
  const fieldServiceMeetings = useAtomValue(fieldServiceMeetingsActiveState);
  const allMeetings = useAtomValue(fieldServiceMeetingsState);
  const filterId = useAtomValue(fieldServiceMeetingsFilterState);
  const weekRangeDate = useAtomValue(fieldServiceMeetingsWeekRangeState);

  // Shared atom: the page (add flow) and the container (edit flow) both use
  // this hook, so local state would give each its own out-of-sync copy.
  const [editingMeetingId, setEditingMeetingId] = useAtom(
    fieldServiceMeetingsEditingIdState
  );

  // Filter a meeting list by the current data view (main, language group, …).
  const applyDataView = useCallback(
    (list: FieldServiceMeetingType[]) =>
      filterMeetingsByDataView(list, dataView),
    [dataView]
  );

  // All (non-deleted) meetings in the current data view — includes past ones,
  // since both the week and month views can navigate to earlier periods.
  const meetings = useMemo(
    () => applyDataView(allMeetings),
    [applyDataView, allMeetings]
  );

  // Filter meetings by week range
  const meetingsInWeekRange = useMemo(() => {
    // Snap to Monday so the list matches the Mon–Sun range shown in the
    // navigation header (the atom may hold any weekday, e.g. from "Today"
    // or a day click in the month grid). getWeekDate mutates — pass a copy.
    const weekStart = getWeekDate(new Date(weekRangeDate));
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStartStr = formatDate(weekStart, 'yyyy/MM/dd');
    const weekEndStr = formatDate(weekEnd, 'yyyy/MM/dd');

    return meetings.filter((record) => {
      const meetingStart = formatDate(
        new Date(record.meeting_data.start),
        'yyyy/MM/dd'
      );

      return meetingStart >= weekStartStr && meetingStart <= weekEndStr;
    });
  }, [meetings, weekRangeDate]);

  const formattedMeetings = useMemo(
    () => meetingsInWeekRange.map(fieldServiceMeetingData),
    [meetingsInWeekRange]
  );

  // Shared chip-filter (All / My group / Joint / Online).
  const applyFilter = useCallback(
    (list: FieldServiceMeetingFormattedType[]) => {
      if (filterId === 'my-group') {
        return my_group
          ? list.filter((meeting) => meeting.group_id === my_group.group_id)
          : [];
      }
      if (filterId === 'joint') {
        return list.filter(
          (meeting) =>
            meeting.category === FieldServiceMeetingCategory.JointMeeting
        );
      }
      if (filterId === 'online') {
        return list.filter(
          (meeting) => meeting.location === FieldServiceMeetingLocation.Online
        );
      }
      return list;
    },
    [filterId, my_group]
  );

  const filteredMeetings = useMemo(
    () => applyFilter(formattedMeetings),
    [applyFilter, formattedMeetings]
  );

  // Meetings for the whole displayed month (used by the month view).
  const monthMeetings = useMemo(() => {
    const year = weekRangeDate.getFullYear();
    const month = weekRangeDate.getMonth();

    const inMonth = meetings.filter((record) => {
      const date = new Date(record.meeting_data.start);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    return applyFilter(inMonth.map(fieldServiceMeetingData));
  }, [meetings, weekRangeDate, applyFilter]);

  const isCreating = editingMeetingId === 'new';

  const editingMeeting = useMemo(() => {
    if (!editingMeetingId) return null;

    if (editingMeetingId === 'new') {
      const base = createEmptyMeeting(dataView);

      // Pre-fill the group with the overseer's/assistant's own group.
      const leadGroupId =
        my_group && myLedGroupIds.has(my_group.group_id)
          ? my_group.group_id
          : undefined;

      if (leadGroupId) {
        base.meeting_data.type = leadGroupId;
        base.meeting_data.group_id = leadGroupId;
      }

      // Pre-fill the date & time from the group's recurring meeting time.
      const targetGroupId = leadGroupId ?? base.meeting_data.group_id;
      const recurring = getGroupRecurringStart(
        settings,
        targetGroupId,
        fieldServiceMeetings
      );

      if (recurring) {
        base.meeting_data.start = recurring.start.toISOString();
        base.meeting_data.end = recurring.end.toISOString();
      }

      return base;
    }

    const meeting = meetings.find((m) => m.meeting_uid === editingMeetingId);
    return meeting ? structuredClone(meeting) : null;
  }, [
    editingMeetingId,
    meetings,
    dataView,
    my_group,
    myLedGroupIds,
    settings,
    fieldServiceMeetings,
  ]);

  const midweekMeetings = useMemo(() => {
    return filteredMeetings.filter((meeting) => {
      const meetingDate = new Date(meeting.start);
      const dayOfWeek = meetingDate.getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    });
  }, [filteredMeetings]);

  const weekendMeetings = useMemo(() => {
    return filteredMeetings.filter((meeting) => {
      const meetingDate = new Date(meeting.start);
      const dayOfWeek = meetingDate.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    });
  }, [filteredMeetings]);

  const handleStartCreate = useCallback(() => {
    setEditingMeetingId('new');
  }, [setEditingMeetingId]);

  const handleCancelEdit = useCallback(() => {
    setEditingMeetingId(null);
  }, [setEditingMeetingId]);

  const handleEditMeeting = useCallback(
    (meetingUid: string) => {
      setEditingMeetingId(meetingUid);
    },
    [setEditingMeetingId]
  );

  // Persist a meeting (save or soft-delete), notify and close the form.
  const persistMeeting = useCallback(
    async (payload: FieldServiceMeetingType, successMessageKey: string) => {
      try {
        await dbFieldServiceMeetingsSave(payload);

        displaySnackNotification({
          header: t('tr_done'),
          message: t(successMessageKey),
          severity: 'success',
        });
        handleCancelEdit();
      } catch (error) {
        console.error(error);
        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message:
            error instanceof Error
              ? (getMessageByCode(error.message) ?? error.message)
              : String(error),
          severity: 'error',
        });
      }
    },
    [handleCancelEdit, t]
  );

  const handleSaveMeeting = useCallback(
    async (meeting: FieldServiceMeetingType) => {
      const now = new Date().toISOString();

      await persistMeeting(
        {
          ...meeting,
          meeting_uid: meeting.meeting_uid || crypto.randomUUID(),
          meeting_data: {
            ...meeting.meeting_data,
            _deleted: false,
            updatedAt: now,
          },
        },
        'tr_fieldServiceMeetingSaveSuccess'
      );
    },
    [persistMeeting]
  );

  const handleDeleteMeeting = useCallback(
    async (meeting: FieldServiceMeetingType) => {
      const now = new Date().toISOString();

      await persistMeeting(
        {
          ...meeting,
          meeting_data: {
            ...meeting.meeting_data,
            _deleted: true,
            updatedAt: now,
          },
        },
        'tr_fieldServiceMeetingDeleteSuccess'
      );
    },
    [persistMeeting]
  );

  return {
    midweekMeetings,
    weekendMeetings,
    monthMeetings,
    isCreating,
    editingMeeting,
    handleStartCreate,
    handleCancelEdit,
    handleEditMeeting,
    handleSaveMeeting,
    handleDeleteMeeting,
  };
};

export default useFieldServiceMeetings;
