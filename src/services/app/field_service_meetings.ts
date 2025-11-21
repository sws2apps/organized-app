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
import { store } from '@states/index';
import { hour24FormatState } from '@states/settings';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';

export const fieldServiceMeetingData = (meeting: FieldServiceMeetingType) => {
  const hour24 = store.get(hour24FormatState);

  const months = generateMonthShortNames();
  const weekdays = generateWeekday();

  const result = {} as FieldServiceMeetingFormattedType;

  result.uid = meeting.meeting_uid;
  result.category = meeting.meeting_data.category;
  result.conductor = meeting.meeting_data.conductor;
  result.location = meeting.meeting_data.location;
  result.group_id = meeting.meeting_data.group_id;

  const groups = store.get(fieldWithLanguageGroupsState);
  const groupData = groups.find(
    (group) => group.group_id === meeting.meeting_data.group_id
  );

  result.groupName = groupData?.group_data.name;
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
        params: { month, date: dateV },
      }),
    };
  });

  // Date range formatting for multi-day meetings
  if (
    meeting.meeting_data.category === FieldServiceMeetingCategory.JointMeeting
  ) {
    const startDate = meetingDates.at(0);
    const startDateV = startDate.getDate();
    const startMonthIndex = startDate.getMonth();
    const startMonth = months[startMonthIndex];

    const endDate = meetingDates.at(-1);
    const endDateV = endDate.getDate();
    const endMonthIndex = endDate.getMonth();
    const endMonth = months[endMonthIndex];

    if (startMonthIndex !== endMonthIndex) {
      const startDateFormatted = getTranslation({
        key: 'tr_longDateNoYearLocale',
        params: {
          month: startMonth,
          date: startDateV,
        },
      });

      const endDateFormatted = getTranslation({
        key: 'tr_longDateNoYearLocale',
        params: {
          month: endMonth,
          date: endDateV,
        },
      });

      result.datesRange = getTranslation({
        key: 'tr_dateRangeNoYear',
        params: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
      });
    }

    if (startMonthIndex === endMonthIndex) {
      const dateRanges = getTranslation({
        key: 'tr_dateRangeNoYear',
        params: {
          startDate: startDateV,
          endDate: endDateV,
        },
      });

      result.datesRange = getTranslation({
        key: 'tr_longDateNoYearLocale',
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
