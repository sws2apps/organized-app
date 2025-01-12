import { MidweekMeetingDataType } from '@definition/schedules';

export type S140Type = {
  data: MidweekMeetingDataType[];
  class_count: number;
  cong_name: string;
  fullname?: boolean;
  lang: string;
};

export type S140MeetingPartHeadingType = {
  meetingData: MidweekMeetingDataType;
  meetingPart: string;
  backgroundColor: string;
  classroomHeading: boolean;
  class_count: number;
  lang: string;
};

export type S140PartMiniLabelType = {
  part: string;
};

export type S140PersonType = {
  person: string;
};

export type S140SourceComplexType = {
  source: string;
  time: string;
  bulletColor: string;
  partLabel: string;
};

export type S140SourceExtendedType = {
  source: string;
  time: string;
  bulletColor: string;
};

export type S140SourceSimpleType = {
  source: string;
  bulletColor: string;
};

export type S140TimeType = {
  time: string;
};

export type S140WeekInfoLabelType = {
  weekLabel: string;
};

export type S140WeekTitleType = {
  title: string;
};

export type S140AYFType = {
  meetingData: MidweekMeetingDataType;
  class_count: number;
  fullname?: boolean;
};

export type S140LCType = {
  meetingData: MidweekMeetingDataType;
};

export type S140HeaderType = {
  cong_name: string;
  lang: string;
};
