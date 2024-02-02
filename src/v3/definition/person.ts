export type AssignmentType = {
  code: number;
};

type TimeAwayType = {
  timeAwayId: string;
  startDate: string; // date ISO
  endDate: string | null; // date ISO
  comments: string;
};

type SpiritualStatusType = {
  statusId: string;
  startDate: string; // date ISO
  endDate: string | null; // date ISO
  status: string;
};

type OtherServiceType = {
  serviceId: string;
  startDate: string; // date ISO
  endDate: string | null; // date ISO
  service: string;
};

export type PersonChangeType = {
  date: string;
  field: string;
  value: string | boolean | number | AssignmentType | TimeAwayType | SpiritualStatusType | OtherServiceType;
  isAdded?: boolean;
  isDeleted?: boolean;
  isModified?: boolean;
};

export type AssignmentChange = Overwrite<
  PersonChangeType,
  { value: AssignmentType; isAdded: boolean; isDeleted: boolean }
>;

export type TimeAwayChange = Overwrite<
  PersonChangeType,
  { value: TimeAwayType; isAdded: boolean; isDeleted: boolean; isModified: boolean }
>;

export type SpiritualStatusChange = Overwrite<
  PersonChangeType,
  { value: SpiritualStatusType; isAdded: boolean; isDeleted: boolean; isModified: boolean }
>;

export type OtherServiceChange = Overwrite<
  PersonChangeType,
  { value: OtherServiceType; isAdded: boolean; isDeleted: boolean; isModified: boolean }
>;

export type PersontType = {
  id?: string;
  person_uid: string;
  person_name: string;
  person_displayName: string;
  isMale: boolean;
  isFemale: boolean;
  birthDate: string | null;
  isAnointed: boolean;
  isOtherSheep: boolean;
  isBaptized: boolean;
  immersedDate: string | null;
  isUnavailable: boolean;
  assignments: AssignmentType[];
  timeAway: TimeAwayType[];
  isMoved: false;
  isDisqualified: false;
  email: string;
  address: string;
  phone: string;
  spiritualStatus: SpiritualStatusType[];
  otherService: OtherServiceType[];
  firstMonthReport: null;
  changes: PersonChangeType[];
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
