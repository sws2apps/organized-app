import { Week } from './sources';

type AssignmentCongregation = {
  type: string;
  name: string;
  value: string;
  updatedAt: string;
};

type SwitchCongregation = {
  type: string;
  value: boolean;
  updatedAt: string;
};

type WeekTypeCongregation = {
  type: string;
  value: Week;
  updatedAt: string;
};

export type SchedWeekType = {
  weekOf: string;
  midweek_meeting: {
    chairman_A: AssignmentCongregation[];
    chairman_B: AssignmentCongregation[];
    opening_prayer: AssignmentCongregation[];
    tgw_talk: AssignmentCongregation[];
    tgw_gems: AssignmentCongregation[];
    tgw_bible_reading: {
      main_hall: AssignmentCongregation[];
      aux_class_1: AssignmentCongregation;
      aux_class_2: AssignmentCongregation;
    };
    ayf_part1: {
      main_hall: { student: AssignmentCongregation[]; assistant: AssignmentCongregation[] };
      aux_class_1: { student: AssignmentCongregation; assistant: AssignmentCongregation };
      aux_class_2: { student: AssignmentCongregation; assistant: AssignmentCongregation };
    };
    ayf_part2: {
      main_hall: { student: AssignmentCongregation[]; assistant: AssignmentCongregation[] };
      aux_class_1: { student: AssignmentCongregation; assistant: AssignmentCongregation };
      aux_class_2: { student: AssignmentCongregation; assistant: AssignmentCongregation };
    };
    ayf_part3: {
      main_hall: { student: AssignmentCongregation[]; assistant: AssignmentCongregation[] };
      aux_class_1: { student: AssignmentCongregation; assistant: AssignmentCongregation };
      aux_class_2: { student: AssignmentCongregation; assistant: AssignmentCongregation };
    };
    ayf_part4: {
      main_hall: { student: AssignmentCongregation[]; assistant: AssignmentCongregation[] };
      aux_class_1: { student: AssignmentCongregation; assistant: AssignmentCongregation };
      aux_class_2: { student: AssignmentCongregation; assistant: AssignmentCongregation };
    };
    lc_part1: AssignmentCongregation[];
    lc_part2: AssignmentCongregation[];
    lc_part3: AssignmentCongregation[];
    lc_cbs: {
      conductor: AssignmentCongregation[];
      reader: AssignmentCongregation[];
    };
    closing_prayer: AssignmentCongregation[];
    canceled: SwitchCongregation[];
  };
  weekend_meeting: {
    chairman: AssignmentCongregation[];
    opening_prayer: AssignmentCongregation[];
    speaker: {
      part_1: AssignmentCongregation[];
      part_2: AssignmentCongregation[];
    };
    visiting_speaker: {
      enabled: SwitchCongregation[];
      speaker: AssignmentCongregation[];
      substitute: AssignmentCongregation[];
    };
    wt_study: {
      conductor: AssignmentCongregation[];
      reader: AssignmentCongregation[];
    };
    canceled: SwitchCongregation[];
  };
  released: SwitchCongregation[];
  week_type: WeekTypeCongregation[];
};
