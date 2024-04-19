export type PrivilegeType = 'elder' | 'ms';

export type EnrollmentType = 'AP' | 'FR' | 'FS' | 'FMF';

export type AssignmentType = {
  code: number;
  updatedAt: string;
  _deleted: string | null;
};

export type TimeAwayType = {
  id: string;
  startDate: { value: string; updatedAt: string };
  endDate: { value: string | null; updatedAt: string };
  comments: { value: string; updatedAt: string };
  _deleted: string | null;
};

type StatusHistoryType = {
  id: string;
  startDate: { value: string; updatedAt: string };
  endDate: { value: string | null; updatedAt: string };
  _deleted: string | null;
};

type PrivilegeHistoryType = {
  id: string;
  privilege: { value: PrivilegeType; updatedAt: string };
  startDate: { value: string; updatedAt: string };
  endDate: { value: string | null; updatedAt: string };
  _deleted: string | null;
};

type EnrollmentHistoryType = {
  id: string;
  enrollment: { value: EnrollmentType; updatedAt: string };
  startDate: { value: string; updatedAt: string };
  endDate: { value: string | null; updatedAt: string };
  _deleted: string | null;
};

type EmergencyContactsType = {
  id: string;
  name: { value: string; updatedAt: string };
  contact: { value: string; updatedAt: string };
  _deleted: string | null;
};

export type PersonType = {
  _deleted: string | null;
  person_uid: string;
  person_firstname: { value: string; updatedAt: string };
  person_lastname: { value: string; updatedAt: string };
  person_displayName: { value: string; updatedAt: string };
  isMale: { value: boolean; updatedAt: string };
  isFemale: { value: boolean; updatedAt: string };
  birthDate: { value: string | null; updatedAt: string };
  assignments: AssignmentType[];
  timeAway: TimeAwayType[];
  isArchived: { value: boolean; updatedAt: string };
  isDisqualified: { value: boolean; updatedAt: string };
  email: { value: string; updatedAt: string };
  address: { value: string; updatedAt: string };
  phone: { value: string; updatedAt: string };
  firstMonthReport: { value: string | null; updatedAt: string };
  baptizedPublisher: {
    active: { value: boolean; updatedAt: string };
    isAnointed: { value: boolean; updatedAt: string };
    isOtherSheep: { value: boolean; updatedAt: string };
    baptismDate: { value: string | null; updatedAt: string };
    history: StatusHistoryType[];
  };
  unbaptizedPublisher: {
    active: { value: boolean; updatedAt: string };
    history: StatusHistoryType[];
  };
  midweekMeetingStudent: {
    active: { value: boolean; updatedAt: string };
    history: StatusHistoryType[];
  };
  privileges: PrivilegeHistoryType[];
  enrollments: EnrollmentHistoryType[];
  emergencyContacts: EmergencyContactsType[];
};

export type VisitingSpeakerPersonType = {
  person_uid: string;
  person_name: string;
  person_displayName: string;
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
