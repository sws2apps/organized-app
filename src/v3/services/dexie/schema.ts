import { PersonType } from '@definition/person';
import { SchedWeekType } from '@definition/schedules';
import { SettingsType } from '@definition/settings';
import { SourceWeekType, Week } from '@definition/sources';

export const sourceSchema: SourceWeekType = {
  weekOf: '',
  mwb_week_date_locale: {},
  mwb_weekly_bible_reading: {},
  mwb_song_first: '',
  mwb_tgw_talk: {},
  mwb_tgw_bread: {},
  mwb_ayf_count: 0,
  mwb_ayf_part1_type: {},
  mwb_ayf_part1_time: '',
  mwb_ayf_part1: {},
  mwb_ayf_part2_type: {},
  mwb_ayf_part2_time: '',
  mwb_ayf_part2: {},
  mwb_ayf_part3_type: {},
  mwb_ayf_part3_time: '',
  mwb_ayf_part3: {},
  mwb_ayf_part4_type: {},
  mwb_ayf_part4_time: '',
  mwb_ayf_part4: {},
  mwb_song_middle: '',
  mwb_lc_count: 0,
  mwb_lc_count_override: { value: 0, updatedAt: '' },
  mwb_lc_part1_time: '',
  mwb_lc_part1: {},
  mwb_lc_part1_content: {},
  mwb_lc_part1_time_override: { value: '', updatedAt: '' },
  mwb_lc_part1_override: { value: '', updatedAt: '' },
  mwb_lc_part1_content_override: { value: '', updatedAt: '' },
  mwb_lc_part2_time: '',
  mwb_lc_part2: {},
  mwb_lc_part2_content: {},
  mwb_lc_part2_time_override: { value: '', updatedAt: '' },
  mwb_lc_part2_override: { value: '', updatedAt: '' },
  mwb_lc_part2_content_override: { value: '', updatedAt: '' },
  mwb_lc_cbs: {},
  mwb_lc_cbs_time_override: { value: '', updatedAt: '' },
  mwb_co_talk_title: { value: '', updatedAt: '' },
  mwb_song_conclude: '',
  mwb_song_conclude_override: { value: '', updatedAt: '' },
  w_study_date_locale: {},
  w_co_talk_title: { value: '', updatedAt: '' },
  w_study_title: {},
  w_study_opening_song: '',
  w_study_concluding_song: '',
  keepOverride: undefined,
};

export const scheduleSchema: SchedWeekType = {
  weekOf: '',
  chairmanMM_A: { value: '', updatedAt: '' },
  chairmanMM_B: { value: '', updatedAt: '' },
  opening_prayerMM: { value: '', updatedAt: '' },
  tgw_talk: { value: '', updatedAt: '' },
  tgw_gems: { value: '', updatedAt: '' },
  bRead_stu_A: { value: '', updatedAt: '' },
  bRead_stu_B: { value: '', updatedAt: '' },
  ass1_stu_A: { value: '', updatedAt: '' },
  ass1_ass_A: { value: '', updatedAt: '' },
  ass1_stu_B: { value: '', updatedAt: '' },
  ass1_ass_B: { value: '', updatedAt: '' },
  ass2_stu_A: { value: '', updatedAt: '' },
  ass2_ass_A: { value: '', updatedAt: '' },
  ass2_stu_B: { value: '', updatedAt: '' },
  ass2_ass_B: { value: '', updatedAt: '' },
  ass3_stu_A: { value: '', updatedAt: '' },
  ass3_ass_A: { value: '', updatedAt: '' },
  ass3_stu_B: { value: '', updatedAt: '' },
  ass3_ass_B: { value: '', updatedAt: '' },
  ass4_stu_A: { value: '', updatedAt: '' },
  ass4_ass_A: { value: '', updatedAt: '' },
  ass4_stu_B: { value: '', updatedAt: '' },
  ass4_ass_B: { value: '', updatedAt: '' },
  lc_part1: { value: '', updatedAt: '' },
  lc_part2: { value: '', updatedAt: '' },
  cbs_conductor: { value: '', updatedAt: '' },
  cbs_reader: { value: '', updatedAt: '' },
  closing_prayerMM: { value: '', updatedAt: '' },
  chairman_WM: { value: '', updatedAt: '' },
  opening_prayerWM: { value: '', updatedAt: '' },
  event_name: { value: '', updatedAt: '' },
  public_talk: { value: 0, updatedAt: '' },
  is_visiting_speaker: { value: false, updatedAt: '' },
  speaker_1: { value: '', updatedAt: '' },
  speaker_2: { value: '', updatedAt: '' },
  substitute_speaker: { value: '', updatedAt: '' },
  wtstudy_reader: { value: '', updatedAt: '' },
  chairmanMM_A_name: { value: '', updatedAt: '' },
  chairmanMM_A_dispName: { value: '', updatedAt: '' },
  chairmanMM_B_name: { value: '', updatedAt: '' },
  chairmanMM_B_dispName: { value: '', updatedAt: '' },
  opening_prayerMM_name: { value: '', updatedAt: '' },
  opening_prayerMM_dispName: { value: '', updatedAt: '' },
  tgw_talk_name: { value: '', updatedAt: '' },
  tgw_talk_dispName: { value: '', updatedAt: '' },
  tgw_gems_name: { value: '', updatedAt: '' },
  tgw_gems_dispName: { value: '', updatedAt: '' },
  bRead_stu_A_name: { value: '', updatedAt: '' },
  bRead_stu_A_dispName: { value: '', updatedAt: '' },
  bRead_stu_B_name: { value: '', updatedAt: '' },
  bRead_stu_B_dispName: { value: '', updatedAt: '' },
  ass1_stu_A_name: { value: '', updatedAt: '' },
  ass1_stu_A_dispName: { value: '', updatedAt: '' },
  ass1_ass_A_name: { value: '', updatedAt: '' },
  ass1_ass_A_dispName: { value: '', updatedAt: '' },
  ass1_stu_B_name: { value: '', updatedAt: '' },
  ass1_stu_B_dispName: { value: '', updatedAt: '' },
  ass1_ass_B_name: { value: '', updatedAt: '' },
  ass1_ass_B_dispName: { value: '', updatedAt: '' },
  ass2_stu_A_name: { value: '', updatedAt: '' },
  ass2_stu_A_dispName: { value: '', updatedAt: '' },
  ass2_ass_A_name: { value: '', updatedAt: '' },
  ass2_ass_A_dispName: { value: '', updatedAt: '' },
  ass2_stu_B_name: { value: '', updatedAt: '' },
  ass2_stu_B_dispName: { value: '', updatedAt: '' },
  ass2_ass_B_name: { value: '', updatedAt: '' },
  ass2_ass_B_dispName: { value: '', updatedAt: '' },
  ass3_stu_A_name: { value: '', updatedAt: '' },
  ass3_stu_A_dispName: { value: '', updatedAt: '' },
  ass3_ass_A_name: { value: '', updatedAt: '' },
  ass3_ass_A_dispName: { value: '', updatedAt: '' },
  ass3_stu_B_name: { value: '', updatedAt: '' },
  ass3_stu_B_dispName: { value: '', updatedAt: '' },
  ass3_ass_B_name: { value: '', updatedAt: '' },
  ass3_ass_B_dispName: { value: '', updatedAt: '' },
  ass4_stu_A_name: { value: '', updatedAt: '' },
  ass4_stu_A_dispName: { value: '', updatedAt: '' },
  ass4_ass_A_name: { value: '', updatedAt: '' },
  ass4_ass_A_dispName: { value: '', updatedAt: '' },
  ass4_stu_B_name: { value: '', updatedAt: '' },
  ass4_stu_B_dispName: { value: '', updatedAt: '' },
  ass4_ass_B_name: { value: '', updatedAt: '' },
  ass4_ass_B_dispName: { value: '', updatedAt: '' },
  lc_part1_name: { value: '', updatedAt: '' },
  lc_part1_dispName: { value: '', updatedAt: '' },
  lc_part2_name: { value: '', updatedAt: '' },
  lc_part2_dispName: { value: '', updatedAt: '' },
  cbs_conductor_name: { value: '', updatedAt: '' },
  cbs_conductor_dispName: { value: '', updatedAt: '' },
  cbs_reader_name: { value: '', updatedAt: '' },
  cbs_reader_dispName: { value: '', updatedAt: '' },
  closing_prayerMM_name: { value: '', updatedAt: '' },
  closing_prayerMM_dispName: { value: '', updatedAt: '' },
  chairman_WM_name: { value: '', updatedAt: '' },
  chairman_WM_dispName: { value: '', updatedAt: '' },
  opening_prayerWM_name: { value: '', updatedAt: '' },
  opening_prayerWM_dispName: { value: '', updatedAt: '' },
  speaker_1_name: { value: '', updatedAt: '' },
  speaker_1_dispName: { value: '', updatedAt: '' },
  speaker_2_name: { value: '', updatedAt: '' },
  speaker_2_dispName: { value: '', updatedAt: '' },
  substitute_speaker_name: { value: '', updatedAt: '' },
  substitute_speaker_dispName: { value: '', updatedAt: '' },
  wtstudy_reader_name: { value: '', updatedAt: '' },
  wtstudy_reader_dispName: { value: '', updatedAt: '' },
  noMMeeting: { value: false, updatedAt: '' },
  noWMeeting: { value: false, updatedAt: '' },
  isReleased: { value: false, updatedAt: '' },
  week_type: { value: Week.NORMAL, updatedAt: '' },
};

export const personSchema: PersonType = {
  _deleted: null,
  person_uid: '',
  person_firstname: { value: '', updatedAt: '' },
  person_lastname: { value: '', updatedAt: '' },
  person_displayName: { value: '', updatedAt: '' },
  isMale: { value: true, updatedAt: '' },
  isFemale: { value: false, updatedAt: '' },
  birthDate: { value: null, updatedAt: '' },
  assignments: [],
  timeAway: [],
  isArchived: { value: false, updatedAt: '' },
  isDisqualified: { value: false, updatedAt: '' },
  email: { value: '', updatedAt: '' },
  address: { value: '', updatedAt: '' },
  phone: { value: '', updatedAt: '' },
  firstMonthReport: { value: null, updatedAt: '' },
  baptizedPublisher: {
    active: { value: false, updatedAt: '' },
    isAnointed: { value: false, updatedAt: '' },
    isOtherSheep: { value: true, updatedAt: '' },
    baptismDate: { value: null, updatedAt: '' },
    history: [],
  },
  unbaptizedPublisher: {
    active: { value: false, updatedAt: '' },
    history: [],
  },
  midweekMeetingStudent: {
    active: { value: true, updatedAt: '' },
    history: [
      {
        id: crypto.randomUUID(),
        startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
        endDate: { value: null, updatedAt: new Date().toISOString() },
        _deleted: null,
      },
    ],
  },
  privileges: [],
  enrollments: [],
  emergencyContacts: [],
};

export const settingSchema: SettingsType = {
  id: 1,
  firstname: { value: '', updatedAt: '' },
  lastname: { value: '', updatedAt: '' },
  source_lang: '',
  cong_number: '',
  cong_name: '',
  cong_new: true,
  cong_code: '',
  cong_role: [],
  class_count: { value: 1, updatedAt: '' },
  midweek_meeting_day: { value: 2, updatedAt: '' },
  meeting_time: { value: '', updatedAt: '' },
  user_avatar: undefined,
  co_name: { value: '', updatedAt: '' },
  co_displayName: { value: '', updatedAt: '' },
  autoBackup: { value: false, updatedAt: '' },
  autoBackup_interval: { value: 0, updatedAt: '' },
  schedule_useFullname: { value: false, updatedAt: '' },
  account_type: '',
  opening_prayer_MM_autoAssign: { value: false, updatedAt: '' },
  user_local_uid: '',
  user_members_delegate: [],
  opening_prayer_WM_autoAssign: { value: false, updatedAt: '' },
  weekend_meeting_day: { value: 6, updatedAt: '' },
  midweek_meeting_useExactDate: { value: false, updatedAt: '' },
  weekend_meeting_useSubstituteSpeaker: { value: false, updatedAt: '' },
  follow_os_theme: { value: false, updatedAt: '' },
  enable_hour_credits: { value: false, updatedAt: '' },
  user_time_away: [],
};
