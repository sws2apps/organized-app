import { atom } from 'jotai';
import { FieldServiceMeetingType } from '@definition/field_service_meetings';

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

// All non-deleted meetings — no date cutoff so past months remain
// fully visible when navigating the calendar history.
export const fieldServiceMeetingsActiveState = atom((get) =>
  get(fieldServiceMeetingsState)
);
