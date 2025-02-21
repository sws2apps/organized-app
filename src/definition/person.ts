import { AssignmentCode } from './assignment';

export type PrivilegeType = 'elder' | 'ms';

export type EnrollmentType = 'AP' | 'FR' | 'FS' | 'FMF';

export type AssignmentType = {
  code: AssignmentCode;
  updatedAt: string;
  _deleted: boolean;
};

export type TimeAwayType = {
  id: string;
  _deleted: boolean;
  updatedAt: string;
  start_date: string;
  end_date: string;
  comments: string;
};

export type StatusHistoryType = {
  id: string;
  _deleted: boolean;
  updatedAt: string;
  start_date: string;
  end_date: string;
};

type PrivilegeHistoryType = {
  id: string;
  _deleted: boolean;
  updatedAt: string;
  privilege: PrivilegeType;
  start_date: string;
  end_date: string;
};

type EnrollmentHistoryType = {
  id: string;
  _deleted: boolean;
  updatedAt: string;
  enrollment: EnrollmentType;
  start_date: string;
  end_date: string;
};

type EmergencyContactsType = {
  id: string;
  _deleted: boolean;
  updatedAt: string;
  name: string;
  contact: string;
};

export type PersonType = {
  _deleted: { value: boolean; updatedAt: string };
  person_uid: string;
  person_data: {
    person_firstname: { value: string; updatedAt: string };
    person_lastname: { value: string; updatedAt: string };
    person_display_name: { value: string; updatedAt: string };
    male: { value: boolean; updatedAt: string };
    female: { value: boolean; updatedAt: string };
    birth_date: { value: string | null; updatedAt: string };
    assignments: AssignmentType[];
    timeAway: TimeAwayType[];
    archived: { value: boolean; updatedAt: string };
    disqualified: { value: boolean; updatedAt: string };
    email: { value: string; updatedAt: string };
    address: { value: string; updatedAt: string };
    phone: { value: string; updatedAt: string };
    first_report?: { value: string; updatedAt: string };
    publisher_baptized: {
      active: { value: boolean; updatedAt: string };
      anointed: { value: boolean; updatedAt: string };
      other_sheep: { value: boolean; updatedAt: string };
      baptism_date: { value: string | null; updatedAt: string };
      history: StatusHistoryType[];
    };
    publisher_unbaptized: {
      active: { value: boolean; updatedAt: string };
      history: StatusHistoryType[];
    };
    midweek_meeting_student: {
      active: { value: boolean; updatedAt: string };
      history: StatusHistoryType[];
    };
    privileges: PrivilegeHistoryType[];
    enrollments: EnrollmentHistoryType[];
    emergency_contacts: EmergencyContactsType[];
    categories: { value: string[]; updatedAt: string };
  };
};

export type VisitingSpeakerPersonType = {
  person_uid: string;
  person_name: string;
  person_display_name: string;
  is_elder: boolean;
  is_ms: boolean;
  talks: [];
  is_unavailable: boolean;
  is_deleted: boolean;
  cong_name: string;
  cong_number: number | string;
  cong_id: string;
  is_local: boolean;
  email: string;
  phone: string;
  changes: [];
};

export enum PersonsTab {
  ALL = 0,
  RECENT = 1,
}
