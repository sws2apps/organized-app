import { WeekendMeetingDataType } from '@definition/schedules';

export type WeekendMeetingTemplateType = {
  data: WeekendMeetingDataType[];
  cong_name: string;
  cong_number: string;
};

export type WeekendMeetingItemType = {
  meetingData: WeekendMeetingDataType;
  isLastItem: boolean;
};

export type MeetingPartType = {
  meetingData: WeekendMeetingDataType;
};

export type SpeakersContainerType = {
  meetingData: WeekendMeetingDataType;
};

export type COTalksType = {
  meetingData: WeekendMeetingDataType;
};

export type EventDataType = {
  meetingData: WeekendMeetingDataType;
};

export type HeaderType = {
  cong_name: string;
  cong_number: string;
};

export type WeekDataType = {
  isLast: boolean;
  meetingData: WeekendMeetingDataType;
};
