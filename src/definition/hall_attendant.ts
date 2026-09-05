import { MeetingType } from '@definition/app';
import { PersonType } from '@definition/person';

export type HallAttendantPerson = {
  _deleted?: PersonType['_deleted'];
  person_data?: Partial<
    Pick<
      PersonType['person_data'],
      'male' | 'archived' | 'disqualified' | 'assignments'
    >
  >;
};

export type HallNote = {
  id: string;
  createdAt?: string;
  title: string;
  text: string;
  updatedAt: string;
  revision: string;
  _deleted: boolean;
};
export type HallContact = {
  id: string;
  createdAt?: string;
  title: string;
  phone: string;
  updatedAt: string;
  revision: string;
  _deleted: boolean;
};
export type HallInfo = {
  type: string;
  updatedAt: string;
  notes: HallNote[];
  instructions: { text: string; updatedAt: string; revision: string };
  contacts: HallContact[];
};
export type HallMeeting = {
  week: string;
  month: string;
  index: number;
  type: MeetingType;
  date: Date;
};

export type HallMeetingDates = Partial<Record<MeetingType, Date>>;
