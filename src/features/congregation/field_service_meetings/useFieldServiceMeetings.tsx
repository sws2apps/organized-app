import { useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingLocation,
  FieldServiceMeetingType,
  FieldServiceMeetingFormattedType,
} from '@definition/field_service_meetings';
import { FilterId } from './index.types';
import { dbFieldServiceMeetingsSave } from '@services/dexie/field_service_meetings';
import {
  fieldServiceMeetingsActiveState,
  fieldServiceMeetingsFilterState,
  fieldServiceMeetingsWeekRangeState,
} from '@states/field_service_meetings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { userDataViewState } from '@states/settings';
import { fieldServiceMeetingData } from '@services/app/field_service_meetings';
import { formatDate } from '@utils/date';

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
      location: FieldServiceMeetingLocation.KingdomHall,
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
  const { isSecretary, isGroup, my_group } = useCurrentUser();
  const dataView = useAtomValue(userDataViewState);
  const fieldServiceMeetings = useAtomValue(fieldServiceMeetingsActiveState);
  const filterId = useAtomValue(fieldServiceMeetingsFilterState);
  const weekRangeDate = useAtomValue(fieldServiceMeetingsWeekRangeState);

  // -------------------------------------------------------------------------
  // State Management
  // -------------------------------------------------------------------------

  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Computed Values
  // -------------------------------------------------------------------------

  // Filter meetings by data view (main, group, etc.)
  const meetings = useMemo(() => {
    return fieldServiceMeetings.filter((record) => {
      if (!record) return false;

      if (dataView === 'main') {
        return true;
      }

      const recordType = record.meeting_data.type;
      const recordGroup = record.meeting_data.group_id;

      return (
        recordType === 'main' ||
        recordType === dataView ||
        recordGroup === dataView
      );
    });
  }, [fieldServiceMeetings, dataView]);

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

  // Apply filter to formatted meetings
  const filteredMeetings = useMemo(() => {
    if (filterId === 'all') {
      return formattedMeetings;
    }

    if (filterId === 'my-group') {
      // If user has a group, filter by that group
      if (my_group) {
        return formattedMeetings.filter(
          (meeting) => meeting.group_id === my_group.group_id
        );
      }
      // If no group assigned, return empty array
      return [];
    }

    if (filterId === 'joint') {
      return formattedMeetings.filter(
        (meeting) =>
          meeting.category === FieldServiceMeetingCategory.JointMeeting
      );
    }

    if (filterId === 'zoom') {
      return formattedMeetings.filter(
        (meeting) => meeting.location === FieldServiceMeetingLocation.Zoom
      );
    }

    return formattedMeetings;
  }, [formattedMeetings, filterId, my_group]);

  const canManageMeetings = !isGroup && isSecretary;

  const isCreating = editingMeetingId === 'new';

  const editingMeeting = useMemo(() => {
    if (!editingMeetingId) return null;
    if (editingMeetingId === 'new') return createEmptyMeeting(dataView);

    const meeting = meetings.find((m) => m.meeting_uid === editingMeetingId);
    return meeting ? structuredClone(meeting) : null;
  }, [editingMeetingId, meetings, dataView]);

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

  // -------------------------------------------------------------------------
  // Filter Logic
  // -------------------------------------------------------------------------

  const getFilteredMeetings = useCallback(
    (filterId: FilterId): FieldServiceMeetingFormattedType[] => {
      switch (filterId) {
        case 'my-group':
          if (my_group) {
            return formattedMeetings.filter(
              (meeting) => meeting.group_id === my_group.group_id
            );
          }
          return [];
        case 'joint':
          return formattedMeetings.filter(
            (meeting) =>
              meeting.category === FieldServiceMeetingCategory.JointMeeting
          );
        case 'zoom':
          return formattedMeetings.filter(
            (meeting) => meeting.location === FieldServiceMeetingLocation.Zoom
          );
        default:
          return formattedMeetings;
      }
    },
    [formattedMeetings, my_group]
  );

  return {
    meetings,
    formattedMeetings,
    midweekMeetings,
    weekendMeetings,
    canManageMeetings,
    isCreating,
    editingMeeting,
    editingMeetingId,
    handleStartCreate,
    handleCancelEdit,
    handleEditMeeting,
    handleSaveMeeting,
    handleDeleteMeeting,
    getFilteredMeetings,
  };
};

export default useFieldServiceMeetings;
