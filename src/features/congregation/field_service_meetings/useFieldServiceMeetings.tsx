import { FIELD_SERVICE_MEETING_DURATION_MINUTES } from '@constants/index';
import { useCallback, useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingLocation,
  FieldServiceMeetingType,
  FieldServiceMeetingFormattedType,
} from '@definition/field_service_meetings';
import {
  fieldServiceMeetingsDraftState,
  fieldServiceMeetingsFilterState,
  fieldServiceMeetingsState,
  fieldServiceMeetingsWeekRangeState,
  fieldServiceMeetingsSaveState,
} from '@states/field_service_meetings';
import {
  settingsState,
  userDataViewState,
  fullnameOptionState,
  displayNameMeetingsEnableState,
  hour24FormatState,
} from '@states/settings';
import { personsState } from '@states/persons';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { fieldServiceMeetingData } from '@services/app/field_service_meetings';
import { formatDate, getWeekDate } from '@utils/date';
import {
  fieldServiceMeetingOverlapsRange,
  fieldServiceMeetingDraftScope,
} from '@utils/field_service_meetings';
import usePermissions from '@features/congregation/field_service_meetings/usePermissions';
import { getGroupRecurringStart } from '@features/congregation/field_service_meetings/recurring_prefill';
import { filterMeetingsByDataView } from '@features/congregation/field_service_meetings/filter_meetings_by_data_view';

const useFieldServiceMeetings = () => {
  const { t } = useAppTranslation();
  const { my_group } = useCurrentUser();
  const permissions = usePermissions();
  const dataView = useAtomValue(userDataViewState);
  const settings = useAtomValue(settingsState);
  const allMeetings = useAtomValue(fieldServiceMeetingsState);
  const filterId = useAtomValue(fieldServiceMeetingsFilterState);
  const referenceDate = useAtomValue(fieldServiceMeetingsWeekRangeState);
  const persons = useAtomValue(personsState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const fullname = useAtomValue(fullnameOptionState);
  const displayName = useAtomValue(displayNameMeetingsEnableState);
  const hour24 = useAtomValue(hour24FormatState);
  const [draft, setDraft] = useAtom(fieldServiceMeetingsDraftState);
  const saveMeeting = useSetAtom(fieldServiceMeetingsSaveState);
  const scope = fieldServiceMeetingDraftScope(settings);
  const currentDraft = draft?.scope === scope ? draft : null;
  const meetings = useMemo(
    () => filterMeetingsByDataView(allMeetings, dataView),
    [allMeetings, dataView]
  );
  const formatAndFilter = useCallback(
    (records: FieldServiceMeetingType[]) => {
      const formatted = records.map((meeting) =>
        fieldServiceMeetingData(meeting)
      );
      return formatted.filter((meeting: FieldServiceMeetingFormattedType) => {
        if (filterId === 'my-group')
          return meeting.group_id === my_group?.group_id && Boolean(my_group);
        if (filterId === 'joint')
          return meeting.category === FieldServiceMeetingCategory.JointMeeting;
        if (filterId === 'online')
          return meeting.location === FieldServiceMeetingLocation.Online;
        return true;
      });
      // Formatting resolves person/group labels and time preferences from the store.
    },
    // The formatter reads these preferences from the Jotai store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterId, my_group, persons, groups, fullname, displayName, hour24, t]
  );
  const filteredMeetings = useMemo(() => {
    const start = getWeekDate(new Date(referenceDate));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return formatAndFilter(
      meetings.filter((meeting) =>
        fieldServiceMeetingOverlapsRange(
          meeting,
          formatDate(start, 'yyyy/MM/dd'),
          formatDate(end, 'yyyy/MM/dd')
        )
      )
    );
  }, [meetings, referenceDate, formatAndFilter]);
  const monthMeetings = useMemo(() => {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    return formatAndFilter(
      meetings.filter((meeting) =>
        fieldServiceMeetingOverlapsRange(
          meeting,
          formatDate(new Date(year, month, 1), 'yyyy/MM/dd'),
          formatDate(new Date(year, month + 1, 0), 'yyyy/MM/dd')
        )
      )
    );
  }, [meetings, referenceDate, formatAndFilter]);
  const handleStartCreate = useCallback(() => {
    if (!permissions.canCreate || currentDraft) return;
    let groupId = dataView === 'main' ? undefined : dataView;
    if (!permissions.canManageAll) groupId = [...permissions.myLedGroupIds][0];
    if (my_group && permissions.myLedGroupIds.has(my_group.group_id)) {
      groupId = my_group.group_id;
    }
    const category = groupId
      ? FieldServiceMeetingCategory.RegularMeeting
      : FieldServiceMeetingCategory.JointMeeting;
    const start = new Date(referenceDate);
    const now = new Date();
    start.setHours(now.getHours(), now.getMinutes(), 0, 0);
    const recurring = getGroupRecurringStart(
      settings,
      groupId,
      allMeetings,
      start
    );
    const date = recurring?.start ?? start;
    setDraft({
      scope,
      isNew: true,
      meeting: {
        meeting_uid: crypto.randomUUID(),
        meeting_data: {
          _deleted: false,
          updatedAt: now.toISOString(),
          start: date.toISOString(),
          end: (
            recurring?.end ??
            new Date(
              date.getTime() +
                FIELD_SERVICE_MEETING_DURATION_MINUTES * 60 * 1000
            )
          ).toISOString(),
          type: groupId ?? 'main',
          category,
          conductor: '',
          location: FieldServiceMeetingLocation.Publisher,
          group_id: groupId,
          address: '',
          additionalInfo: '',
        },
      },
    });
  }, [
    permissions,
    currentDraft,
    my_group,
    dataView,
    referenceDate,
    settings,
    allMeetings,
    setDraft,
    scope,
  ]);
  const handleEditMeeting = useCallback(
    (meetingUid: string) => {
      if (currentDraft) return;
      const meeting = meetings.find(
        (record) => record.meeting_uid === meetingUid
      );
      if (
        !meeting ||
        !permissions.canManageMeeting(
          meeting.meeting_data.category,
          meeting.meeting_data.group_id
        )
      )
        return;
      setDraft({ scope, isNew: false, meeting: structuredClone(meeting) });
    },
    [currentDraft, meetings, permissions, setDraft, scope]
  );
  const handleCancelEdit = useCallback(() => setDraft(null), [setDraft]);
  const persistMeeting = useCallback(
    async (meeting: FieldServiceMeetingType, deleting = false) => {
      try {
        await saveMeeting({ meeting, deleting, scope });
        setDraft((previous) =>
          previous?.scope === scope &&
          previous.meeting.meeting_uid === meeting.meeting_uid
            ? null
            : previous
        );
        displaySnackNotification({
          header: t('tr_done'),
          message: t(
            deleting
              ? 'tr_fieldServiceMeetingDeleteSuccess'
              : 'tr_fieldServiceMeetingSaveSuccess'
          ),
          severity: 'success',
        });
      } catch (error) {
        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: error instanceof Error ? error.message : String(error),
          severity: 'error',
        });
      }
    },
    [saveMeeting, setDraft, scope, t]
  );
  return {
    weekMeetings: filteredMeetings,
    monthMeetings,
    editingMeeting: currentDraft?.meeting ?? null,
    isCreating: currentDraft?.isNew ?? false,
    handleStartCreate,
    handleEditMeeting,
    handleCancelEdit,
    handleSaveMeeting: (meeting: FieldServiceMeetingType) =>
      persistMeeting(meeting),
    handleDeleteMeeting: (meeting: FieldServiceMeetingType) =>
      persistMeeting(meeting, true),
  };
};
export default useFieldServiceMeetings;
