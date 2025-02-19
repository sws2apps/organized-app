import { AssignmentCode, AssignmentFieldType } from './assignment';
import { Week } from './week_type';

export type S140TemplateType = 'S140_default' | 'S140_app_normal';

export type S89TemplateType = 'S89_1x1' | 'S89_4x1';

export type AssignmentCongregation = {
  type: string;
  name: string;
  value: string;
  updatedAt: string;
  solo?: boolean;
};

export type WeekTypeCongregation = {
  type: string;
  value: Week;
  updatedAt: string;
};

export type AssignmentAYFType = {
  main_hall: {
    student: AssignmentCongregation[];
    assistant: AssignmentCongregation[];
  };
  aux_class_1: {
    student: AssignmentCongregation;
    assistant: AssignmentCongregation;
  };
  aux_class_2: {
    student: AssignmentCongregation;
    assistant: AssignmentCongregation;
  };
};

export type PublicTalkType =
  | 'localSpeaker'
  | 'visitingSpeaker'
  | 'jwStreamRecording';

export type PublicTalkCongregation = {
  type: string;
  value: PublicTalkType;
  updatedAt: string;
};

export type OutgoingTalkScheduleType = {
  _deleted: boolean;
  updatedAt: string;
  id: string;
  synced: boolean;
  opening_song: string;
  public_talk: number;
  speaker: string;
  congregation: {
    name: string;
    number: string;
    country: string;
    address: string;
    weekday: number;
    time: string;
  };
};

export type OutgoingTalkExportScheduleType = OutgoingTalkScheduleType & {
  sender: string;
  recipient: string;
  weekOf: string;
};

export type SchedWeekType = {
  weekOf: string;
  midweek_meeting: {
    chairman: {
      main_hall: AssignmentCongregation[];
      aux_class_1: AssignmentCongregation;
    };
    opening_prayer: AssignmentCongregation[];
    tgw_talk: AssignmentCongregation[];
    tgw_gems: AssignmentCongregation[];
    tgw_bible_reading: {
      main_hall: AssignmentCongregation[];
      aux_class_1: AssignmentCongregation;
      aux_class_2: AssignmentCongregation;
    };
    ayf_part1: AssignmentAYFType;
    ayf_part2: AssignmentAYFType;
    ayf_part3: AssignmentAYFType;
    ayf_part4: AssignmentAYFType;
    lc_part1: AssignmentCongregation[];
    lc_part2: AssignmentCongregation[];
    lc_part3: AssignmentCongregation[];
    lc_cbs: {
      conductor: AssignmentCongregation[];
      reader: AssignmentCongregation[];
    };
    closing_prayer: AssignmentCongregation[];
    circuit_overseer: AssignmentCongregation;
    aux_fsg?: string;
    week_type: WeekTypeCongregation[];
  };
  weekend_meeting: {
    chairman: AssignmentCongregation[];
    opening_prayer: AssignmentCongregation[];
    public_talk_type: PublicTalkCongregation[];
    speaker: {
      part_1: AssignmentCongregation[];
      part_2: AssignmentCongregation[];
      substitute: AssignmentCongregation[];
    };
    wt_study: {
      conductor: AssignmentCongregation[];
      reader: AssignmentCongregation[];
    };
    closing_prayer: AssignmentCongregation[];
    circuit_overseer: AssignmentCongregation;
    week_type: WeekTypeCongregation[];
    outgoing_talks: OutgoingTalkScheduleType[];
  };
};

export type AssignmentHistoryType = {
  id: string;
  weekOf: string;
  weekOfFormatted: string;
  assignment: {
    key: AssignmentFieldType;
    code: AssignmentCode;
    title: string;
    src?: string;
    desc?: string;
    person: string;
    category: string;
    classroom?: string;
    schedule_id?: string;
    public_talk?: number;
    ayf?: {
      student?: string;
      assistant?: string;
    };
  };
};

export type S89DataType = {
  id: string;
  weekOf: string;
  student_name: string;
  assistant_name: string;
  assignment_date: string;
  part_number: string;
  main_hall: boolean;
  aux_class_1: boolean;
  aux_class_2?: boolean;
};

export type MidweekMeetingDataType = {
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
    ayf_part2: string;
    ayf_part3: string;
    ayf_part4: string;
    lc_middle_song: string;
    lc_part1: string;
    lc_part2: string;
    lc_part3: string;
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
  tgw_gems_src: string;
  tgw_gems_time: string;
  tgw_gems_name: string;
  tgw_bible_reading_src: string;
  tgw_bible_reading_A_name: string;
  tgw_bible_reading_B_name?: string;
  ayf_part1_type: AssignmentCode;
  ayf_part1_type_name: string;
  ayf_part1_time: string;
  ayf_part1_label: string;
  ayf_part1_A_name: string;
  ayf_part1_A_student_name?: string;
  ayf_part1_A_assistant_name?: string;
  ayf_part1_B_name?: string;
  ayf_part1_B_student_name?: string;
  ayf_part1_B_assistant_name?: string;
  ayf_part2_type?: AssignmentCode;
  ayf_part2_type_name?: string;
  ayf_part2_time?: string;
  ayf_part2_label?: string;
  ayf_part2_A_name?: string;
  ayf_part2_A_student_name?: string;
  ayf_part2_A_assistant_name?: string;
  ayf_part2_B_name?: string;
  ayf_part2_B_student_name?: string;
  ayf_part2_B_assistant_name?: string;
  ayf_part3_type?: AssignmentCode;
  ayf_part3_type_name?: string;
  ayf_part3_time?: string;
  ayf_part3_label?: string;
  ayf_part3_A_name?: string;
  ayf_part3_A_student_name?: string;
  ayf_part3_A_assistant_name?: string;
  ayf_part3_B_name?: string;
  ayf_part3_B_student_name?: string;
  ayf_part3_B_assistant_name?: string;
  ayf_part_type?: AssignmentCode;
  ayf_part4_type_name?: string;
  ayf_part4_time?: string;
  ayf_part4_label?: string;
  ayf_part4_A_name?: string;
  ayf_part4_A_student_name?: string;
  ayf_part4_A_assistant_name?: string;
  ayf_part4_B_name?: string;
  ayf_part4_B_student_name?: string;
  ayf_part4_B_assistant_name?: string;
  lc_middle_song: string;
  lc_count: number;
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
  lc_cbs_title?: string;
  lc_cbs_time?: string;
  lc_cbs_label?: string;
  lc_cbs_name?: string;
  lc_cbs_conductor_name?: string;
  lc_cbs_reader_name?: string;
  lc_concluding_song: string;
  lc_concluding_prayer: string;
  co_name?: string;
};

export type WeekendMeetingTimingsType = {
  pgm_start: string;
  public_talk: string;
  middle_song: string;
  w_study: string;
  service_talk?: string;
  pgm_end: string;
};

export type WeekendMeetingDataType = {
  date_formatted: string;
  weekOf: string;
  no_meeting: boolean;
  week_type: Week;
  week_type_name: string;
  event_name: string;
  chairman_name: string;
  opening_prayer_name: string;
  public_talk_title?: string;
  public_talk_number: string;
  wtstudy_conductor_name: string;
  wtstudy_reader_name: string;
  speaker_1_name: string;
  speaker_2_name: string;
  speaker_cong_name: string;
  substitute_speaker_name: string;
  co_name?: string;
  concluding_prayer_name?: string;
  service_talk_title?: string;
};
