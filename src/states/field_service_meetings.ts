import { atom } from 'jotai';
import { FieldServiceMeetingType } from '@definition/field_service_meetings';
import { formatDate } from '@utils/date';

export const fieldServiceMeetingsDbState = atom<FieldServiceMeetingType[]>([]);

export const fieldServiceMeetingsFilterState = atom<string>('all');

export const fieldServiceMeetingsWeekRangeState = atom<Date>(new Date());

export const fieldServiceMeetingsViewModeState = atom<'week' | 'month'>('week');

// uid of the meeting being edited, 'new' while creating, or null when closed.
// Shared so the page (add flow) and the container (edit flow) stay in sync.
// (Cast instead of atom<string | null>(null): with strict mode off, a bare
// null matches jotai's read-only overload and the atom loses its setter.)
export const fieldServiceMeetingsEditingIdState = atom(null as string | null);

export const fieldServiceMeetingsState = atom((get) => {
  const meetings = get(fieldServiceMeetingsDbState);
  return meetings
    .filter((record) => !record.meeting_data._deleted)
    .sort((a, b) => a.meeting_data.start.localeCompare(b.meeting_data.start));
});

export const fieldServiceMeetingsActiveState = atom((get) => {
  const meetings = get(fieldServiceMeetingsState);
  const today = formatDate(new Date(), 'yyyy/MM/dd');
  return meetings.filter((record) => {
    const startDate = formatDate(
      new Date(record.meeting_data.start),
      'yyyy/MM/dd'
    );
    const endDate = formatDate(new Date(record.meeting_data.end), 'yyyy/MM/dd');
    return startDate >= today || endDate >= today;
  });
});
