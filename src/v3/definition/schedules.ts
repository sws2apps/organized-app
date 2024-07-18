import { AssignmentCode, AssignmentFieldType } from './assignment';
import { Week } from './week_type';

export type AssignmentCongregation = {
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

export type WeekTypeCongregation = {
  type: string;
  value: Week;
  updatedAt: string;
};

export type AssignmentAYFType = {
  main_hall: { student: AssignmentCongregation[]; assistant: AssignmentCongregation[] };
  aux_class_1: { student: AssignmentCongregation; assistant: AssignmentCongregation };
  aux_class_2: { student: AssignmentCongregation; assistant: AssignmentCongregation };
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
    week_type: WeekTypeCongregation[];
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
    week_type: WeekTypeCongregation[];
  };
  released: SwitchCongregation[];
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
    ayf?: {
      student?: string;
      assistant?: string;
    };
  };
};
