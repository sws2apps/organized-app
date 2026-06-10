import { atom } from 'jotai';
import { FieldServiceMeetingType } from '@definition/field_service_meetings';
import { formatDate, getWeekDate } from '@utils/date';

export const fieldServiceMeetingsDbState = atom<FieldServiceMeetingType[]>([]);

export const fieldServiceMeetingsFilterState = atom<string>('all');

export const fieldServiceMeetingsWeekRangeState = atom<Date>(new Date());

export const fieldServiceMeetingsViewModeState = atom<'week' | 'month'>('week');

export const fieldServiceMeetingsState = atom((get) => {
  const meetings = get(fieldServiceMeetingsDbState);
  return meetings
    .filter((record) => !record.meeting_data._deleted)
    .sort((a, b) => a.meeting_data.start.localeCompare(b.meeting_data.start));
});

// Show the full current week plus all future meetings so that Mon/Tue
// meetings remain visible even when today is later in the same week.
export const fieldServiceMeetingsActiveState = atom((get) => {
  const meetings = get(fieldServiceMeetingsState);
  const weekStart = formatDate(getWeekDate(new Date()), 'yyyy/MM/dd');
  return meetings.filter((record) => {
    const startDate = formatDate(
      new Date(record.meeting_data.start),
      'yyyy/MM/dd'
    );
    const endDate = formatDate(new Date(record.meeting_data.end), 'yyyy/MM/dd');
    return startDate >= weekStart || endDate >= weekStart;
  });
});
