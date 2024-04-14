import { Week } from './sources';

export enum AssignmentCode {
  MM_BibleReading = 100,
  MM_InitialCall = 101,
  MM_ReturnVisit = 102,
  MM_BibleStudy = 103,
  MM_Talk = 104,
  MM_InitialCallVideo = 105,
  MM_ReturnVisitVideo = 106,
  MM_Other = 107,
  MM_Memorial = 108,
  MM_Chairman = 110,
  MM_Prayer = 111,
  MM_TGWTalk = 112,
  MM_TGWGems = 113,
  MM_LCPart = 114,
  MM_CBSConductor = 115,
  MM_CBSReader = 116,
  MM_MemorialVideo = 117,
  WM_Chairman = 118,
  WM_Prayer = 119,
  WM_Speaker = 120,
  WM_SpeakerSymposium = 121,
  WM_WTStudyReader = 122,
  MM_StartingConversation = 123,
  MM_FollowingUp = 124,
  MM_MakingDisciples = 125,
  MM_ExplainingBeliefs = 126,
  MM_Discussion = 127,
  MM_AuxiliaryCounselor = 128,
  MM_AssistantOnly = 129,
  WM_WTStudyConductor = 130,
}

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
  is_visiting_speaker: { value: boolean; updatedAt: string };
  speaker_1: { value: string; updatedAt: string };
  speaker_2: { value: string; updatedAt: string };
  substitute_speaker: { value: string; updatedAt: string };
  wtstudy_reader: { value: string; updatedAt: string };
  chairmanMM_A_name: { value: string; updatedAt: string };
  chairmanMM_A_dispName: { value: string; updatedAt: string };
  chairmanMM_B_name: { value: string; updatedAt: string };
  chairmanMM_B_dispName: { value: string; updatedAt: string };
  opening_prayerMM_name: { value: string; updatedAt: string };
  opening_prayerMM_dispName: { value: string; updatedAt: string };
  tgw_talk_name: { value: string; updatedAt: string };
  tgw_talk_dispName: { value: string; updatedAt: string };
  tgw_gems_name: { value: string; updatedAt: string };
  tgw_gems_dispName: { value: string; updatedAt: string };
  bRead_stu_A_name: { value: string; updatedAt: string };
  bRead_stu_A_dispName: { value: string; updatedAt: string };
  bRead_stu_B_name: { value: string; updatedAt: string };
  bRead_stu_B_dispName: { value: string; updatedAt: string };
  ass1_stu_A_name: { value: string; updatedAt: string };
  ass1_stu_A_dispName: { value: string; updatedAt: string };
  ass1_ass_A_name: { value: string; updatedAt: string };
  ass1_ass_A_dispName: { value: string; updatedAt: string };
  ass1_stu_B_name: { value: string; updatedAt: string };
  ass1_stu_B_dispName: { value: string; updatedAt: string };
  ass1_ass_B_name: { value: string; updatedAt: string };
  ass1_ass_B_dispName: { value: string; updatedAt: string };
  ass2_stu_A_name: { value: string; updatedAt: string };
  ass2_stu_A_dispName: { value: string; updatedAt: string };
  ass2_ass_A_name: { value: string; updatedAt: string };
  ass2_ass_A_dispName: { value: string; updatedAt: string };
  ass2_stu_B_name: { value: string; updatedAt: string };
  ass2_stu_B_dispName: { value: string; updatedAt: string };
  ass2_ass_B_name: { value: string; updatedAt: string };
  ass2_ass_B_dispName: { value: string; updatedAt: string };
  ass3_stu_A_name: { value: string; updatedAt: string };
  ass3_stu_A_dispName: { value: string; updatedAt: string };
  ass3_ass_A_name: { value: string; updatedAt: string };
  ass3_ass_A_dispName: { value: string; updatedAt: string };
  ass3_stu_B_name: { value: string; updatedAt: string };
  ass3_stu_B_dispName: { value: string; updatedAt: string };
  ass3_ass_B_name: { value: string; updatedAt: string };
  ass3_ass_B_dispName: { value: string; updatedAt: string };
  ass4_stu_A_name: { value: string; updatedAt: string };
  ass4_stu_A_dispName: { value: string; updatedAt: string };
  ass4_ass_A_name: { value: string; updatedAt: string };
  ass4_ass_A_dispName: { value: string; updatedAt: string };
  ass4_stu_B_name: { value: string; updatedAt: string };
  ass4_stu_B_dispName: { value: string; updatedAt: string };
  ass4_ass_B_name: { value: string; updatedAt: string };
  ass4_ass_B_dispName: { value: string; updatedAt: string };
  lc_part1_name: { value: string; updatedAt: string };
  lc_part1_dispName: { value: string; updatedAt: string };
  lc_part2_name: { value: string; updatedAt: string };
  lc_part2_dispName: { value: string; updatedAt: string };
  cbs_conductor_name: { value: string; updatedAt: string };
  cbs_conductor_dispName: { value: string; updatedAt: string };
  cbs_reader_name: { value: string; updatedAt: string };
  cbs_reader_dispName: { value: string; updatedAt: string };
  closing_prayerMM_name: { value: string; updatedAt: string };
  closing_prayerMM_dispName: { value: string; updatedAt: string };
  chairman_WM_name: { value: string; updatedAt: string };
  chairman_WM_dispName: { value: string; updatedAt: string };
  opening_prayerWM_name: { value: string; updatedAt: string };
  opening_prayerWM_dispName: { value: string; updatedAt: string };
  speaker_1_name: { value: string; updatedAt: string };
  speaker_1_dispName: { value: string; updatedAt: string };
  speaker_2_name: { value: string; updatedAt: string };
  speaker_2_dispName: { value: string; updatedAt: string };
  substitute_speaker_name: { value: string; updatedAt: string };
  substitute_speaker_dispName: { value: string; updatedAt: string };
  wtstudy_reader_name: { value: string; updatedAt: string };
  wtstudy_reader_dispName: { value: string; updatedAt: string };
  noMMeeting: { value: boolean; updatedAt: string };
  noWMeeting: { value: boolean; updatedAt: string };
  isReleased: { value: boolean; updatedAt: string };
  week_type: { value: Week; updatedAt: string };
};

export type SchedInfoType = {
  weekOf: string;
  week_type: Week;
  noMMeeting: boolean;
  noWMeeting: boolean;
};
