// TODO: Check data layer for field service meetings

export enum FieldServiceMeetingCategory {
  RegularMeeting,
  GroupMeeting,
  JointMeeting,
  ServiceOverseerMeeting,
}

export enum FieldServiceMeetingLocation {
  Publisher,
  KingdomHall,
  Territory,
  Zoom,
}

export type FieldServiceMeetingType = {
  meeting_uid: string;
  _deleted?: boolean;
  updatedAt?: string;
  meeting_data: {
    _deleted: boolean;
    updatedAt: string;
    start: string;
    end: string;
    type: string;
    category: FieldServiceMeetingCategory;
    conductor: string;
    location: FieldServiceMeetingLocation;
    group?: string;
    address?: string;
    additionalInfo?: string;
    custom?: string;
  };
};

export type FieldServiceMeetingFormattedType = {
  uid: string;
  year: number;
  time: string;
  dates: { date: string; dateFormatted: string; day: string }[];
  conductor: string;
  location: FieldServiceMeetingLocation;
  group?: string;
  address?: string;
  additionalInfo?: string;
  custom: string;
  category: FieldServiceMeetingCategory;
  start: string;
  date: string;
  day: string;
  datesRange?: string;
};
