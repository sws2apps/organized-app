import { Week } from '@definition/week_type';

export type WeekendMeetingTemplateType = {
  data: MeetingDataType[];
};

export type MeetingDataType = {
  date_formatted: string;
  weekOf: string;
  week_type: Week;
  week_type_name: Week;
  event_name: string;
  chairman_name: string;
  opening_prayer_name: string;
  public_talk_title: string;
  public_talk_number: string;
  wtstudy_reader_name: string;
  speaker_1_name: string;
  speaker_2_name: string;
  speaker_cong_name: string;
  substitute_speaker_name: string;
};

export type WeekendMeetingItemType = {
  meetingData: MeetingDataType;
  isLastItem: boolean;
};

export type MeetingRoleType = {
  role: string;
  name: string;
};

export type CommonMeetingPartsType = {
  noOpeningPrayer: boolean;
  meetingData: MeetingDataType;
};

export type CommonSpeechContainerType = {
  meetingData: MeetingDataType;
};
