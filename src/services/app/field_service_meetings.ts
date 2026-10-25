import { fieldServiceMeetingConductorAllowed } from '@utils/field_service_meeting_permissions';
import { dbAppSettingsUpdateFieldServiceMeetingTime } from '@services/dexie/settings';
import {
  FIELD_SERVICE_MEETING_CATEGORIES,
  FIELD_SERVICE_MEETING_LOCATIONS,
} from '@definition/field_service_meetings';
import { settingsState } from '@states/settings';
import {
  dbFieldServiceMeetingsGet,
  dbFieldServiceMeetingsSave,
} from '@services/dexie/field_service_meetings';
import {
  fieldServiceMeetingPermissions,
  fieldServiceMeetingDraftScope,
} from '@utils/field_service_meetings';
import { getTranslation as translate } from '@services/i18n/translation';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingFormattedType,
  FieldServiceMeetingType,
} from '@definition/field_service_meetings';
import { formatDate, getDatesBetweenDates } from '@utils/date';
import {
  generateMonthShortNames,
  generateWeekday,
  getTranslation,
} from '@services/i18n/translation';
import { personGetDisplayName } from '@utils/common';
import { store } from '@states/index';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  hour24FormatState,
} from '@states/settings';
import { personsState } from '@states/persons';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';

export const fieldServiceMeetingData = (
  meeting: FieldServiceMeetingType,
  language?: string
) => {
  const hour24 = store.get(hour24FormatState);

  const months = generateMonthShortNames(language);
  const weekdays = generateWeekday(language);

  const result = {} as FieldServiceMeetingFormattedType;

  result.uid = meeting.meeting_uid;
  result.category = meeting.meeting_data.category;
  result.startISO = meeting.meeting_data.start;
  result.endISO = meeting.meeting_data.end;

  // Conductor is stored as a person_uid; resolve to the configured display name.
  // Falls back to the raw stored value for legacy name-string data, and to the
  // generic "Service overseer" label for service overseer meetings with no match.
  const persons = store.get(personsState);
  const useDisplayName = store.get(displayNameMeetingsEnableState);
  const fullnameOption = store.get(fullnameOptionState);
  const conductorUid = meeting.meeting_data.conductor;
  const conductorPerson = persons.find(
    (person) => person.person_uid === conductorUid
  );

  if (conductorPerson) {
    result.conductor = personGetDisplayName(
      conductorPerson,
      useDisplayName,
      fullnameOption
    );
  } else if (
    meeting.meeting_data.category ===
    FieldServiceMeetingCategory.ServiceOverseerMeeting
  ) {
    result.conductor = getTranslation({ key: 'tr_serviceOverseer', language });
  } else {
    result.conductor = conductorUid ?? '';
  }

  result.location = meeting.meeting_data.location;
  result.group_id = meeting.meeting_data.group_id;

  const groups = store.get(fieldWithLanguageGroupsState);
  const groupData = groups.find(
    (group) => group.group_id === meeting.meeting_data.group_id
  );

  // Badge label: just the group's optional name, or "Group N" if unnamed.
  // The "Group N – Name" compound form is kept only for form dropdowns.
  result.groupName = groupData
    ? groupData.group_data.name?.trim() ||
      `${getTranslation({ key: 'tr_group', language })} ${groupData.group_data.sort_index + 1}`
    : undefined;
  result.address = meeting.meeting_data.address;
  result.additionalInfo = meeting.meeting_data.additionalInfo;

  result.year = new Date(meeting.meeting_data.start).getFullYear();

  const start = new Date(meeting.meeting_data.start);
  const date = start.getDate();
  const monthIndex = start.getMonth();
  const month = months[monthIndex];

  result.start = formatDate(start, 'yyyy/MM/dd');
  result.date = getTranslation({
    key: 'tr_longDateNoYearLocale',
    language,
    params: { month, date },
  });

  const todayIndex = start.getDay();
  result.day = weekdays[todayIndex === 0 ? 6 : todayIndex - 1];

  const meetingDates = getDatesBetweenDates(
    meeting.meeting_data.start,
    meeting.meeting_data.end
  );

  result.dates = meetingDates.map((date) => {
    const dayIndex = date.getDay();
    const dateV = date.getDate();
    const monthIndex = date.getMonth();
    const month = months[monthIndex];

    return {
      date: formatDate(date, 'yyyy/MM/dd'),
      day: weekdays[dayIndex === 0 ? 6 : dayIndex - 1],
      dateFormatted: getTranslation({
        key: 'tr_longDateNoYearLocale',
        language,
        params: { month, date: dateV },
      }),
    };
  });

  // Date range formatting for multi-day meetings only — a single-day joint
  // meeting falls back to the plain `date` label ("Jul 12", not "Jul 12-12").
  if (
    meeting.meeting_data.category ===
      FieldServiceMeetingCategory.JointMeeting &&
    meetingDates.length > 1
  ) {
    const startDate = meetingDates[0]!;
    const startDateV = startDate.getDate();
    const startMonthIndex = startDate.getMonth();
    const startMonth = months[startMonthIndex];

    const endDate = meetingDates[meetingDates.length - 1]!;
    const endDateV = endDate.getDate();
    const endMonthIndex = endDate.getMonth();
    const endMonth = months[endMonthIndex];

    if (startMonthIndex !== endMonthIndex) {
      const startDateFormatted = getTranslation({
        key: 'tr_longDateNoYearLocale',
        language,
        params: {
          month: startMonth,
          date: startDateV,
        },
      });

      const endDateFormatted = getTranslation({
        key: 'tr_longDateNoYearLocale',
        language,
        params: {
          month: endMonth,
          date: endDateV,
        },
      });

      result.datesRange = getTranslation({
        key: 'tr_dateRangeNoYear',
        language,
        params: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
      });
    }

    if (startMonthIndex === endMonthIndex) {
      const dateRanges = getTranslation({
        key: 'tr_dateRangeNoYear',
        language,
        params: {
          startDate: startDateV,
          endDate: endDateV,
        },
      });

      result.datesRange = getTranslation({
        key: 'tr_longDateNoYearLocale',
        language,
        params: {
          month: startMonth,
          date: dateRanges,
        },
      });
    }
  }

  result.time = formatDate(
    new Date(meeting.meeting_data.start),
    hour24 ? 'HH:mm' : 'hh:mmaaa'
  );

  return result;
};

export const fieldServiceMeetingsSave = async (
  meeting: FieldServiceMeetingType,
  deleting = false,
  expectedScope?: string
) => {
  const current = await dbFieldServiceMeetingsGet(meeting.meeting_uid);
  if (
    expectedScope &&
    expectedScope !== fieldServiceMeetingDraftScope(store.get(settingsState))
  ) {
    throw new Error(translate({ key: 'tr_fieldServiceMeetingNotAllowed' }));
  }
  const permissions = fieldServiceMeetingPermissions(
    store.get(settingsState),
    store.get(fieldWithLanguageGroupsState)
  );
  const target = meeting.meeting_data;
  const changingToVisit =
    target.category === FieldServiceMeetingCategory.ServiceOverseerMeeting &&
    current?.meeting_data.category !== target.category;
  if (
    !permissions.canCreate ||
    !permissions.canManageMeeting(target.category, target.group_id) ||
    (current &&
      !permissions.canManageMeeting(
        current.meeting_data.category,
        current.meeting_data.group_id
      )) ||
    (changingToVisit && !permissions.canManageAll)
  ) {
    throw new Error(translate({ key: 'tr_fieldServiceMeetingNotAllowed' }));
  }

  if (
    current &&
    (current.meeting_data._deleted ||
      current.meeting_data.updatedAt !== target.updatedAt)
  ) {
    throw new Error(translate({ key: 'tr_fieldServiceMeetingChanged' }));
  }
  if (deleting && !current)
    throw new Error(translate({ key: 'tr_fieldServiceMeetingChanged' }));
  const start = new Date(target.start).getTime();
  const end = new Date(target.end).getTime();
  if (
    !deleting &&
    (!Number.isFinite(start) ||
      !Number.isFinite(end) ||
      end <= start ||
      !target.conductor.trim() ||
      !FIELD_SERVICE_MEETING_CATEGORIES.includes(target.category) ||
      !FIELD_SERVICE_MEETING_LOCATIONS.includes(target.location))
  ) {
    throw new Error(translate({ key: 'tr_fieldServiceMeetingInvalid' }));
  }
  if (
    !deleting &&
    !permissions.canManageAll &&
    !fieldServiceMeetingConductorAllowed(
      target.conductor,
      target.group_id,
      store.get(fieldWithLanguageGroupsState),
      store.get(personsState)
    )
  ) {
    throw new Error(
      translate({ key: 'tr_fieldServiceMeetingConductorGroupError' })
    );
  }
  await dbFieldServiceMeetingsSave(
    {
      ...meeting,
      meeting_data: {
        ...target,
        // The selected group is the source of truth for data-view visibility.
        type: target.group_id ?? 'main',
        _deleted: deleting,
        updatedAt: new Date().toISOString(),
      },
    },
    { updatedAt: current?.meeting_data.updatedAt }
  );
};

export const fieldServiceMeetingTimeSave = async (
  groupId: string,
  value: { weekday?: number; time?: string }
) => {
  const permissions = fieldServiceMeetingPermissions(
    store.get(settingsState),
    store.get(fieldWithLanguageGroupsState)
  );
  if (!permissions.canEditGroupTimes())
    throw new Error(translate({ key: 'tr_fieldServiceMeetingNotAllowed' }));
  if (
    (value.weekday !== undefined &&
      (!Number.isInteger(value.weekday) ||
        value.weekday < 0 ||
        value.weekday > 6)) ||
    (value.time !== undefined &&
      value.time !== '' &&
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(value.time))
  ) {
    throw new Error(translate({ key: 'tr_fieldServiceMeetingInvalid' }));
  }
  await dbAppSettingsUpdateFieldServiceMeetingTime(groupId, (record) => {
    const now = new Date().toISOString();
    if (value.weekday !== undefined)
      record.weekday = { value: value.weekday, updatedAt: now };
    if (value.time !== undefined)
      record.time = { value: value.time, updatedAt: now };
  });
};
