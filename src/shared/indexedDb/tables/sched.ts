import { Table } from 'dexie';
import { SchedWeekType } from '@definition/schedules';

export type SchedTable = {
  sched: Table<SchedWeekType>;
};

export const schedSchema = {
  sched:
    '&weekOf, bRead_stu_A, bRead_stu_A_name, bRead_stu_A_dispName, bRead_stu_B, bRead_stu_B_name, bRead_stu_B_dispName, ass1_stu_A, ass1_stu_A_name, ass1_stu_A_dispName, ass1_ass_A, ass1_ass_A_name, ass1_ass_A_dispName, ass1_stu_B, ass1_stu_B_name, ass1_stu_B_dispName, ass1_ass_B, ass1_ass_B_name, ass1_ass_B_dispName, ass2_stu_A, ass2_stu_A_name, ass2_stu_A_dispName, ass2_ass_A, ass2_ass_A_name, ass2_ass_A_dispName, ass2_stu_B, ass2_stu_B_name, ass2_stu_B_dispName, ass2_ass_B, ass2_ass_B_name, ass2_ass_B_dispName, ass3_stu_A, ass3_stu_A_name, ass3_stu_A_dispName, ass3_ass_A, ass3_ass_A_name, ass3_ass_A_dispName, ass3_stu_B, ass3_stu_B_name, ass3_stu_B_dispName, ass3_ass_B, ass3_ass_B_name, ass3_ass_B_dispName, ass4_stu_A, ass4_stu_A_name, ass4_stu_A_dispName, ass4_ass_A, ass4_ass_A_name, ass4_ass_A_dispName, ass4_stu_B, ass4_stu_B_name, ass4_stu_B_dispName, ass4_ass_B, ass4_ass_B_name, ass4_ass_B_dispName, week_type, noMMeeting, isReleased, chairmanMM_A, chairmanMM_A_name, chairmanMM_A_dispName, chairmanMM_B, chairmanMM_B_name, chairmanMM_B_dispName, opening_prayerMM, opening_prayerMM_name, opening_prayerMM_dispName, tgw_talk, tgw_talk_name, tgw_talk_dispName, tgw_gems, tgw_gems_name, tgw_gems_dispName, lc_part1, lc_part1_name, lc_part1_dispName, lc_part2, lc_part2_name, lc_part2_dispName, cbs_conductor, cbs_conductor_name, cbs_conductor_dispName, cbs_reader, cbs_reader_name, cbs_reader_dispName, closing_prayerMM, closing_prayerMM_name, closing_prayerMM_dispName, chairman_WM, chairman_WM_name, chairman_WM_dispName, opening_prayerWM, opening_prayerWM_name, opening_prayerWM_dispName, speaker_1, speaker_1_name, speaker_1_dispName, speaker_2, speaker_2_name, speaker_2_dispName, is_visiting_speaker, public_talk, event_name, wtstudy_reader, wtstudy_reader_name, wtstudy_reader_dispName, noWMeeting, substitute_speaker, substitute_speaker_name, substitute_speaker_dispName',
};
