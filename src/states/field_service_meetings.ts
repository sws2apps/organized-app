import {
  fieldServiceMeetingsSave,
  fieldServiceMeetingTimeSave,
} from '@services/app/field_service_meetings';
import { atom } from 'jotai';
import {
  FieldServiceMeetingType,
  FieldServiceMeetingDraft,
} from '@definition/field_service_meetings';
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

export const fieldServiceMeetingsDraftState =
  atom<FieldServiceMeetingDraft | null>(null);

export const fieldServiceMeetingsSaveState = atom(
  null,
  async (
    _get,
    _set,
    payload: {
      meeting: FieldServiceMeetingType;
      deleting?: boolean;
      scope: string;
    }
  ) => {
    await fieldServiceMeetingsSave(
      payload.meeting,
      payload.deleting,
      payload.scope
    );
  }
);

export const fieldServiceMeetingTimeSaveState = atom(
  null,
  async (
    _get,
    _set,
    payload: { groupId: string; weekday?: number; time?: string }
  ) => {
    await fieldServiceMeetingTimeSave(payload.groupId, payload);
  }
);
