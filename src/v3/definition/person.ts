export type AssignmentType = {
  code: number;
};

type DeletedItem = {
  id: string;
  on: string;
};

type TimeAwayType = {
  timeAwayId: string;
  startDate: { value: string; updatedAt: string };
  endDate: { value: string | null; updatedAt: string };
  comments: { value: string; updatedAt: string };
};

type StatusHistoryType = {
  id: string;
  startDate: { value: string; updatedAt: string };
  endDate: { value: string | null; updatedAt: string };
};

type PrivilegeHistoryType = {
  id: string;
  privilege: 'ms' | 'elder';
  startDate: { value: string; updatedAt: string };
  endDate: { value: string | null; updatedAt: string };
};

type EnrollmentHistoryType = {
  id: string;
  privilege: 'AP' | 'FR' | 'FS' | 'FMF';
  startDate: { value: string; updatedAt: string };
  endDate: { value: string | null; updatedAt: string };
};

export type PersontType = {
  id?: string;
  person_uid: string;
  person_name?: string;
  person_firstname: {
    value: string;
    updatedAt: string;
  };
  person_lastname: {
    value: string;
    updatedAt: string;
  };
  person_displayName: {
    value: string;
    updatedAt: string;
  };
  isMale: {
    value: boolean;
    updatedAt: string;
  };
  isFemale: {
    value: boolean;
    updatedAt: string;
  };
  birthDate: {
    value: string | null;
    updatedAt: string;
  };
  isUnavailable: {
    value: boolean;
    updatedAt: string;
  };
  assignments: {
    values: AssignmentType[];
    _deleted: DeletedItem[];
  };
  timeAway: {
    values: TimeAwayType[];
    _deleted: DeletedItem[];
  };
  isMoved: {
    value: boolean;
    updatedAt: string;
  };
  isDisqualified: {
    value: boolean;
    updatedAt: string;
  };
  email: {
    value: string;
    updatedAt: string;
  };
  address: {
    value: string;
    updatedAt: string;
  };
  phone: {
    value: string;
    updatedAt: string;
  };
  firstMonthReport: {
    value: string | null;
    updatedAt: string;
  };
  baptizedPublisher: {
    active: {
      value: boolean;
      updatedAt: string;
    };
    isAnointed: {
      value: boolean;
      updatedAt: string;
    };
    isOtherSheep: {
      value: boolean;
      updatedAt: string;
    };
    baptismDate: {
      value: string | null;
      updatedAt: string;
    };
    history: StatusHistoryType[];
    _deleted: DeletedItem[];
  };
  unbaptizedPublisher: {
    active: {
      value: boolean;
      updatedAt: string;
    };
    history: StatusHistoryType[];
    _deleted: DeletedItem[];
  };
  midweekMeetingStudent: {
    active: {
      value: boolean;
      updatedAt: string;
    };
    history: StatusHistoryType[];
    _deleted: DeletedItem[];
  };
  privileges: { history: PrivilegeHistoryType[]; _deleted: DeletedItem[] };
  enrollments: { history: EnrollmentHistoryType[]; _deleted: DeletedItem[] };
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
