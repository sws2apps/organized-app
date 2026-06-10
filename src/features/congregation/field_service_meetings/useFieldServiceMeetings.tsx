import { useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingLocation,
  FieldServiceMeetingType,
  FieldServiceMeetingFormattedType,
} from '@definition/field_service_meetings';
import { dbFieldServiceMeetingsSave } from '@services/dexie/field_service_meetings';
import {
  fieldServiceMeetingsActiveState,
  fieldServiceMeetingsFilterState,
  fieldServiceMeetingsState,
  fieldServiceMeetingsWeekRangeState,
} from '@states/field_service_meetings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { settingsState, userDataViewState } from '@states/settings';
import { fieldServiceMeetingData } from '@services/app/field_service_meetings';
import { formatDate } from '@utils/date';
import useFieldServiceMeetingsPermissions from './usePermissions';
import { getGroupRecurringStart } from './recurringPrefill';

/**
 * Creates an empty meeting template
 */
const createEmptyMeeting = (dataView: string): FieldServiceMeetingType => {
  const start = new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return {
    meeting_uid: crypto.randomUUID(),
    _deleted: false,
    updatedAt: start.toISOString(),
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

/**
 * Feature-level hook for field service meetings
 * Handles all business logic, CRUD operations, and data management
 */
const useFieldServiceMeetings = (t: (key: string) => string) => {
  const { my_group } = useCurrentUser();
  const { myLedGroupIds } = useFieldServiceMeetingsPermissions();
  const dataView = useAtomValue(userDataViewState);
  const settings = useAtomValue(settingsState);
  const fieldServiceMeetings = useAtomValue(fieldServiceMeetingsActiveState);
  const allMeetings = useAtomValue(fieldServiceMeetingsState);
  const filterId = useAtomValue(fieldServiceMeetingsFilterState);
  const weekRangeDate = useAtomValue(fieldServiceMeetingsWeekRangeState);

  // -------------------------------------------------------------------------
  // State Management
  // -------------------------------------------------------------------------

  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Computed Values
  // -------------------------------------------------------------------------

  // Filter a meeting list by the current data view (main, language group, …).
  const applyDataView = useCallback(
    (list: FieldServiceMeetingType[]) =>
      list.filter((record) => {
        if (!record) return false;
        if (dataView === 'main') return true;

        const recordType = record.meeting_data.type;
        const recordGroup = record.meeting_data.group_id;

        return (
          recordType === 'main' ||
          recordType === dataView ||
          recordGroup === dataView
        );
      }),
    [dataView]
  );

  const meetings = useMemo(
    () => applyDataView(fieldServiceMeetings),
    [applyDataView, fieldServiceMeetings]
  );

  // Filter meetings by week range
  const meetingsInWeekRange = useMemo(() => {
    // Calculate week range boundaries
    const weekStart = new Date(weekRangeDate);
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

  // Meetings for the whole displayed month (used by the month view). Sourced
  // from all meetings (not just upcoming) so earlier days in the month show too.
  const monthMeetings = useMemo(() => {
    const reference = new Date(weekRangeDate);
    const year = reference.getFullYear();
    const month = reference.getMonth();

    const inMonth = applyDataView(allMeetings).filter((record) => {
      const date = new Date(record.meeting_data.start);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    return applyFilter(inMonth.map(fieldServiceMeetingData));
  }, [allMeetings, applyDataView, weekRangeDate, applyFilter]);

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

  // -------------------------------------------------------------------------
  // Meeting Operations
  // -------------------------------------------------------------------------

  const handleStartCreate = useCallback(() => {
    setEditingMeetingId('new');
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMeetingId(null);
  }, []);

  const handleEditMeeting = useCallback((meetingUid: string) => {
    setEditingMeetingId(meetingUid);
  }, []);

  const handleSaveMeeting = useCallback(
    async (meeting: FieldServiceMeetingType) => {
      try {
        const now = new Date().toISOString();

        const payload: FieldServiceMeetingType = {
          ...meeting,
          meeting_uid: meeting.meeting_uid || crypto.randomUUID(),
          _deleted: false,
          updatedAt: now,
          meeting_data: {
            ...meeting.meeting_data,
            _deleted: false,
            updatedAt: now,
          },
        };

        await dbFieldServiceMeetingsSave(payload);

        displaySnackNotification({
          header: t('tr_done'),
          message: t('tr_fieldServiceMeetingSaveSuccess'),
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

  const handleDeleteMeeting = useCallback(
    async (meeting: FieldServiceMeetingType) => {
      try {
        const now = new Date().toISOString();

        const payload: FieldServiceMeetingType = {
          ...meeting,
          _deleted: true,
          updatedAt: now,
          meeting_data: {
            ...meeting.meeting_data,
            _deleted: true,
            updatedAt: now,
          },
        };

        await dbFieldServiceMeetingsSave(payload);

        displaySnackNotification({
          header: t('tr_done'),
          message: t('tr_fieldServiceMeetingDeleteSuccess'),
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
