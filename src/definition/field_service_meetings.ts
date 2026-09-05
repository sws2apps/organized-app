export enum FieldServiceMeetingCategory {
  RegularMeeting = 0,
  // NOTE: value 1 (formerly "GroupMeeting") was removed. A group-specific
  // meeting is now a RegularMeeting with a `group_id`. Explicit numeric values
  // are kept so previously stored categories (2, 3) remain valid.
  JointMeeting = 2,
  ServiceOverseerMeeting = 3,
}

export enum FieldServiceMeetingLocation {
  Publisher,
  KingdomHall,
  Territory,
  Online,
}

export const FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS: Record<
  FieldServiceMeetingCategory,
  string
> = {
  [FieldServiceMeetingCategory.RegularMeeting]:
    'tr_fieldServiceMeetingCategory_regular',
  [FieldServiceMeetingCategory.JointMeeting]:
    'tr_fieldServiceMeetingCategory_joint',
  [FieldServiceMeetingCategory.ServiceOverseerMeeting]:
    'tr_fieldServiceMeetingCategory_serviceOverseer',
};

export const FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS: Record<
  FieldServiceMeetingLocation,
  string
> = {
  [FieldServiceMeetingLocation.Publisher]:
    'tr_fieldServiceMeetingLocation_publisher',
  [FieldServiceMeetingLocation.KingdomHall]:
    'tr_fieldServiceMeetingLocation_kingdomHall',
  [FieldServiceMeetingLocation.Territory]:
    'tr_fieldServiceMeetingLocation_territory',
  [FieldServiceMeetingLocation.Online]: 'tr_fieldServiceMeetingLocation_online',
};

export const FIELD_SERVICE_MEETING_CATEGORIES = Object.freeze(
  Object.values(FieldServiceMeetingCategory).filter(
    (value) => typeof value === 'number'
  ) as FieldServiceMeetingCategory[]
);

export const FIELD_SERVICE_MEETING_LOCATIONS = Object.freeze(
  Object.values(FieldServiceMeetingLocation).filter(
    (value) => typeof value === 'number'
  ) as FieldServiceMeetingLocation[]
);

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
    group_id?: string;
    address?: string;
    additionalInfo?: string;
  };
};

export type FieldServiceMeetingFormattedType = {
  uid: string;
  year: number;
  time: string;
  // Raw ISO datetimes (used e.g. for calendar export).
  startISO: string;
  endISO: string;
  dates: { date: string; dateFormatted: string; day: string }[];
  conductor: string;
  location: FieldServiceMeetingLocation;
  group_id?: string;
  groupName?: string;
  address?: string;
  additionalInfo?: string;
  category: FieldServiceMeetingCategory;
  start: string;
  date: string;
  day: string;
  datesRange?: string;
};
