import { WeekendMeetingDataType } from '@definition/schedules';

export type WeekendMeetingTemplateType = {
  data: WeekendMeetingDataType[];
  cong_name: string;
  cong_number: string;
  lang: string;
};

export type WeekendMeetingItemType = {
  meetingData: WeekendMeetingDataType;
  isLastItem: boolean;
};

export type MeetingPartType = {
  meetingData: WeekendMeetingDataType;
  lang: string;
};

export type SpeakersContainerType = {
  meetingData: WeekendMeetingDataType;
  lang: string;
};

export type COTalksType = {
  meetingData: WeekendMeetingDataType;
  lang: string;
};

export type EventDataType = {
  meetingData: WeekendMeetingDataType;
};

export type HeaderType = {
  cong_name: string;
  cong_number: string;
  lang: string;
};

export type WeekDataType = {
  isLast: boolean;
  meetingData: WeekendMeetingDataType;
  lang: string;
};
