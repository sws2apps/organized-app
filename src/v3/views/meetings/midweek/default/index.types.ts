import { AssignmentCode } from '@definition/assignment';
import { Week } from '@definition/week_type';

export type MeetingDataType = {
  date_formatted: string;
  weekOf: string;
  week_type: Week;
  week_type_name: string;
  schedule_title: string;
  no_meeting: boolean;
  chairman_A_name: string;
  chairman_B_name?: string;
  timing: {
    pgm_start: string;
    opening_comments: string;
    tgw_talk: string;
    tgw_gems: string;
    tgw_bible_reading: string;
    ayf_part1: string;
    ayf_part2?: string;
    ayf_part3?: string;
    ayf_part4?: string;
    lc_middle_song: string;
    lc_part1: string;
    lc_part2?: string;
    lc_part3?: string;
    concluding_comments: string;
    co_talk?: string;
    cbs?: string;
    pgm_end: string;
  };
  song_first: string;
  opening_prayer_name: string;
  tgw_talk_src: string;
  tgw_talk_time: string;
  tgw_talk_name: string;
  tgw_gems_time: string;
  tgw_gems_name: string;
  tgw_bible_reading_A_name: string;
  tgw_bible_reading_B_name?: string;
  ayf_part1_type: AssignmentCode;
  ayf_part1_type_name: string;
  ayf_part1_time: string;
  ayf_part1_label: string;
  ayf_part1_A_name: string;
  ayf_part1_B_name?: string;
  ayf_part2_type?: AssignmentCode;
  ayf_part2_type_name?: string;
  ayf_part2_time?: string;
  ayf_part2_label?: string;
  ayf_part2_A_name?: string;
  ayf_part2_B_name?: string;
  ayf_part3_type?: AssignmentCode;
  ayf_part3_type_name?: string;
  ayf_part3_time?: string;
  ayf_part3_label?: string;
  ayf_part3_A_name?: string;
  ayf_part3_B_name?: string;
  ayf_part4_type?: AssignmentCode;
  ayf_part4_type_name?: string;
  ayf_part4_time?: string;
  ayf_part4_label?: string;
  ayf_part4_A_name?: string;
  ayf_part4_B_name?: string;
  lc_middle_song: string;
  lc_part1_time: string;
  lc_part1_src: string;
  lc_part1_name: string;
  lc_part2_time?: string;
  lc_part2_src?: string;
  lc_part2_name?: string;
  lc_part3_time?: string;
  lc_part3_src?: string;
  lc_part3_name?: string;
  lc_co_talk?: string;
  lc_cbs_time?: string;
  lc_cbs_label?: string;
  lc_cbs_name?: string;
  lc_concluding_song: string;
  lc_concluding_prayer: string;
};

export type S140Type = {
  data: MeetingDataType[];
  currentSchedule: string;
};

export type S140MeetingPartHeadingType = {
  meetingData: MeetingDataType;
  meetingPart: string;
  backgroundColor: string;
  classroomHeading: boolean;
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
  meetingData: MeetingDataType;
};

export type S140LCType = {
  meetingData: MeetingDataType;
};
