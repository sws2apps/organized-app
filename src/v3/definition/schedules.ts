import { AssignmentCode } from './assignment';
import { Week } from './sources';

export type AssignmentType = {
  /**
   * The code of the assignment.
   */
  code: AssignmentCode;

  /**
   * Indicates whether the assignment is assignable.
   */
  assignable: boolean;

  /**
   * Indicates whether the assignment is only for male.
   */
  maleOnly: boolean;

  /**
   * Link an assignment to an existing one.
   */
  linkTo?: AssignmentCode;

  /**
   * The type of the assignment. It can be 'tgw', 'ayf', or 'lc'.
   */
  type?: 'mm' | 'tgw' | 'ayf' | 'lc';

  /**
   * The name of the assignment type in different languages.
   */
  assignment_type_name: { [language: string]: string };
};

export type SchedWeekType = {
  weekOf: string;
  chairmanMM_A: { value: string; updatedAt: string };
  chairmanMM_B: { value: string; updatedAt: string };
  opening_prayerMM: { value: string; updatedAt: string };
  tgw_talk: { value: string; updatedAt: string };
  tgw_gems: { value: string; updatedAt: string };
  bRead_stu_A: { value: string; updatedAt: string };
  bRead_stu_B: { value: string; updatedAt: string };
  ass1_stu_A: { value: string; updatedAt: string };
  ass1_ass_A: { value: string; updatedAt: string };
  ass1_stu_B: { value: string; updatedAt: string };
  ass1_ass_B: { value: string; updatedAt: string };
  ass2_stu_A: { value: string; updatedAt: string };
  ass2_ass_A: { value: string; updatedAt: string };
  ass2_stu_B: { value: string; updatedAt: string };
  ass2_ass_B: { value: string; updatedAt: string };
  ass3_stu_A: { value: string; updatedAt: string };
  ass3_ass_A: { value: string; updatedAt: string };
  ass3_stu_B: { value: string; updatedAt: string };
  ass3_ass_B: { value: string; updatedAt: string };
  ass4_stu_A: { value: string; updatedAt: string };
  ass4_ass_A: { value: string; updatedAt: string };
  ass4_stu_B: { value: string; updatedAt: string };
  ass4_ass_B: { value: string; updatedAt: string };
  lc_part1: { value: string; updatedAt: string };
  lc_part2: { value: string; updatedAt: string };
  cbs_conductor: { value: string; updatedAt: string };
  cbs_reader: { value: string; updatedAt: string };
  closing_prayerMM: { value: string; updatedAt: string };
  chairman_WM: { value: string; updatedAt: string };
  opening_prayerWM: { value: string; updatedAt: string };
  event_name: { value: string; updatedAt: string };
  public_talk: { value: number; updatedAt: string };
  visiting_speaker_enabled: { value: boolean; updatedAt: string };
  speaker_1: { value: string; updatedAt: string };
  speaker_2: { value: string; updatedAt: string };
  substitute_speaker: { value: string; updatedAt: string };
  wtstudy_reader: { value: string; updatedAt: string };
  chairmanMM_A_name: { value: string; updatedAt: string };
  chairmanMM_A_display_name: { value: string; updatedAt: string };
  chairmanMM_B_name: { value: string; updatedAt: string };
  chairmanMM_B_display_name: { value: string; updatedAt: string };
  opening_prayerMM_name: { value: string; updatedAt: string };
  opening_prayerMM_display_name: { value: string; updatedAt: string };
  tgw_talk_name: { value: string; updatedAt: string };
  tgw_talk_display_name: { value: string; updatedAt: string };
  tgw_gems_name: { value: string; updatedAt: string };
  tgw_gems_display_name: { value: string; updatedAt: string };
  bRead_stu_A_name: { value: string; updatedAt: string };
  bRead_stu_A_display_name: { value: string; updatedAt: string };
  bRead_stu_B_name: { value: string; updatedAt: string };
  bRead_stu_B_display_name: { value: string; updatedAt: string };
  ass1_stu_A_name: { value: string; updatedAt: string };
  ass1_stu_A_display_name: { value: string; updatedAt: string };
  ass1_ass_A_name: { value: string; updatedAt: string };
  ass1_ass_A_display_name: { value: string; updatedAt: string };
  ass1_stu_B_name: { value: string; updatedAt: string };
  ass1_stu_B_display_name: { value: string; updatedAt: string };
  ass1_ass_B_name: { value: string; updatedAt: string };
  ass1_ass_B_display_name: { value: string; updatedAt: string };
  ass2_stu_A_name: { value: string; updatedAt: string };
  ass2_stu_A_display_name: { value: string; updatedAt: string };
  ass2_ass_A_name: { value: string; updatedAt: string };
  ass2_ass_A_display_name: { value: string; updatedAt: string };
  ass2_stu_B_name: { value: string; updatedAt: string };
  ass2_stu_B_display_name: { value: string; updatedAt: string };
  ass2_ass_B_name: { value: string; updatedAt: string };
  ass2_ass_B_display_name: { value: string; updatedAt: string };
  ass3_stu_A_name: { value: string; updatedAt: string };
  ass3_stu_A_display_name: { value: string; updatedAt: string };
  ass3_ass_A_name: { value: string; updatedAt: string };
  ass3_ass_A_display_name: { value: string; updatedAt: string };
  ass3_stu_B_name: { value: string; updatedAt: string };
  ass3_stu_B_display_name: { value: string; updatedAt: string };
  ass3_ass_B_name: { value: string; updatedAt: string };
  ass3_ass_B_display_name: { value: string; updatedAt: string };
  ass4_stu_A_name: { value: string; updatedAt: string };
  ass4_stu_A_display_name: { value: string; updatedAt: string };
  ass4_ass_A_name: { value: string; updatedAt: string };
  ass4_ass_A_display_name: { value: string; updatedAt: string };
  ass4_stu_B_name: { value: string; updatedAt: string };
  ass4_stu_B_display_name: { value: string; updatedAt: string };
  ass4_ass_B_name: { value: string; updatedAt: string };
  ass4_ass_B_display_name: { value: string; updatedAt: string };
  lc_part1_name: { value: string; updatedAt: string };
  lc_part1_display_name: { value: string; updatedAt: string };
  lc_part2_name: { value: string; updatedAt: string };
  lc_part2_display_name: { value: string; updatedAt: string };
  cbs_conductor_name: { value: string; updatedAt: string };
  cbs_conductor_display_name: { value: string; updatedAt: string };
  cbs_reader_name: { value: string; updatedAt: string };
  cbs_reader_display_name: { value: string; updatedAt: string };
  closing_prayerMM_name: { value: string; updatedAt: string };
  closing_prayerMM_display_name: { value: string; updatedAt: string };
  chairman_WM_name: { value: string; updatedAt: string };
  chairman_WM_display_name: { value: string; updatedAt: string };
  opening_prayerWM_name: { value: string; updatedAt: string };
  opening_prayerWM_display_name: { value: string; updatedAt: string };
  speaker_1_name: { value: string; updatedAt: string };
  speaker_1_display_name: { value: string; updatedAt: string };
  speaker_2_name: { value: string; updatedAt: string };
  speaker_2_display_name: { value: string; updatedAt: string };
  substitute_speaker_name: { value: string; updatedAt: string };
  substitute_speaker_display_name: { value: string; updatedAt: string };
  wtstudy_reader_name: { value: string; updatedAt: string };
  wtstudy_reader_display_name: { value: string; updatedAt: string };
  midweek_meeting_canceled: { value: boolean; updatedAt: string };
  weekend_meeting_canceled: { value: boolean; updatedAt: string };
  released: { value: boolean; updatedAt: string };
  week_type: { value: Week; updatedAt: string };
};

export type SchedInfoType = {
  weekOf: string;
  week_type: Week;
  midweek_meeting_canceled: boolean;
  weekend_meeting_canceled: boolean;
};
