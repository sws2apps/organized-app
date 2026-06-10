import { atom } from 'jotai';
import { FieldServiceMeetingType } from '@definition/field_service_meetings';
import { formatDate } from '@utils/date';

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

// Keep at most one past calendar month of history: anything from the
// 1st of the previous month onward stays visible; older meetings drop off.
export const fieldServiceMeetingsActiveState = atom((get) => {
  const meetings = get(fieldServiceMeetingsState);
  const now = new Date();
  const historyStart = formatDate(
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
    'yyyy/MM/dd'
  );
  return meetings.filter((record) => {
    const endDate = formatDate(new Date(record.meeting_data.end), 'yyyy/MM/dd');
    return endDate >= historyStart;
  });
});
