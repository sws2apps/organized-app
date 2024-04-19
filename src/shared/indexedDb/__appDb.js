import Dexie from 'dexie';

let appDb = new Dexie('organized');

appDb.version(1).stores({
  app_settings:
    '++id, username, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_MM_autoAssign, user_local_uid, user_members_delegate, opening_prayer_WM_autoAssign, midweek_meeting_day, weekend_meeting_day, midweek_meeting_useExactDate, weekend_meeting_useSubstituteSpeaker, assignment_updated2024, user_firstname, user_lastname, cong_code, cong_new, follow_os_theme, enable_hour_credits, user_time_away, public_talk_sync',
  sched:
    '&weekOf, bRead_stu_A, bRead_stu_A_name, bRead_stu_A_dispName, bRead_stu_B, bRead_stu_B_name, bRead_stu_B_dispName, ass1_stu_A, ass1_stu_A_name, ass1_stu_A_dispName, ass1_ass_A, ass1_ass_A_name, ass1_ass_A_dispName, ass1_stu_B, ass1_stu_B_name, ass1_stu_B_dispName, ass1_ass_B, ass1_ass_B_name, ass1_ass_B_dispName, ass2_stu_A, ass2_stu_A_name, ass2_stu_A_dispName, ass2_ass_A, ass2_ass_A_name, ass2_ass_A_dispName, ass2_stu_B, ass2_stu_B_name, ass2_stu_B_dispName, ass2_ass_B, ass2_ass_B_name, ass2_ass_B_dispName, ass3_stu_A, ass3_stu_A_name, ass3_stu_A_dispName, ass3_ass_A, ass3_ass_A_name, ass3_ass_A_dispName, ass3_stu_B, ass3_stu_B_name, ass3_stu_B_dispName, ass3_ass_B, ass3_ass_B_name, ass3_ass_B_dispName, ass4_stu_A, ass4_stu_A_name, ass4_stu_A_dispName, ass4_ass_A, ass4_ass_A_name, ass4_ass_A_dispName, ass4_stu_B, ass4_stu_B_name, ass4_stu_B_dispName, ass4_ass_B, ass4_ass_B_name, ass4_ass_B_dispName, week_type, noMMeeting, isReleased, chairmanMM_A, chairmanMM_A_name, chairmanMM_A_dispName, chairmanMM_B, chairmanMM_B_name, chairmanMM_B_dispName, opening_prayerMM, opening_prayerMM_name, opening_prayerMM_dispName, tgw_talk, tgw_talk_name, tgw_talk_dispName, tgw_gems, tgw_gems_name, tgw_gems_dispName, lc_part1, lc_part1_name, lc_part1_dispName, lc_part2, lc_part2_name, lc_part2_dispName, cbs_conductor, cbs_conductor_name, cbs_conductor_dispName, cbs_reader, cbs_reader_name, cbs_reader_dispName, closing_prayerMM, closing_prayerMM_name, closing_prayerMM_dispName, chairman_WM, chairman_WM_name, chairman_WM_dispName, opening_prayerWM, opening_prayerWM_name, opening_prayerWM_dispName, speaker_1, speaker_1_name, speaker_1_dispName, speaker_2, speaker_2_name, speaker_2_dispName, is_visiting_speaker, public_talk, event_name, wtstudy_reader, wtstudy_reader_name, wtstudy_reader_dispName, noWMeeting, substitute_speaker, substitute_speaker_name, substitute_speaker_dispName, changes',
  sources:
    '&weekOf, mwb_week_date_locale, mwb_weekly_bible_reading, mwb_song_first, mwb_tgw_talk, mwb_tgw_bread, mwb_ayf_count, mwb_ayf_part1, mwb_ayf_part1_time, mwb_ayf_part1_type, mwb_ayf_part2, mwb_ayf_part2_time, mwb_ayf_part2_type, mwb_ayf_part3, mwb_ayf_part3_time, mwb_ayf_part3_type, mwb_ayf_part4, mwb_ayf_part4_time, mwb_ayf_part4_type, mwb_song_middle, mwb_lc_count, mwb_lc_count_override, mwb_lc_part1, mwb_lc_part1_override, mwb_lc_part1_time, mwb_lc_part1_time_override, mwb_lc_part1_content, mwb_lc_part1_content_override, mwb_lc_part2, mwb_lc_part2_override, mwb_lc_part2_time, mwb_lc_part2_time_override, mwb_lc_part2_content, mwb_lc_part2_content_override, mwb_lc_cbs, mwb_lc_cbs_time_override, mwb_song_conclude, mwb_song_conclude_override, mwb_co_talk_title, w_study_date_locale, w_study_title, w_study_opening_song, w_study_concluding_song, w_co_talk_title, keepOverride',
  visiting_speakers:
    '&cong_number, cong_id, cong_name, cong_speakers, is_local, request_status, notif_dismissed, changes',
  src: '&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src, ass4_type, ass4_time, ass4_src, ayfCount, weekDate_src, weeklyBibleReading_src, songFirst_src, tgwTalk_src, songMiddle_src, lcCount, lcCount_override, lcPart1_time, lcPart1_time_override, lcPart1_src, lcPart1_src_override, lcPart1_content, lcPart1_content_override, lcPart2_time, lcPart2_time_override, lcPart2_src, lcPart2_src_override, lcPart2_content, lcPart2_content_override, cbs_src, cbs_time_override, songConclude_src, songConclude_src_override, co_talk_title, w_study_date_locale, w_study_title, w_study_opening_song, w_study_concluding_song, keepOverride',
  public_talks: '&talk_number, talk_title',
  user_field_service_reports:
    '&report_uid, month, month_date, placements, videos, duration, duration_start, returnVisits, bibleStudies, comments, changes, isDeleted, isSubmitted, isPending, isS4, isS21',
  user_bible_studies: '&uid, person_name, person_active, person_addresses, person_contact, changes, isDeleted',
  fieldServiceReports: '&uid, service_year, person_uid, months',
  lateReports: '&uid, person_uid, service_year, month, deleted',
  minutesReports: '&uid, person_uid, service_year, month, deleted',
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, assignments, timeAway, isMoved, isDisqualified, birthDate, isAnointed, isOtherSheep, isBaptized, immersedDate, email, address, phone, spiritualStatus, otherService, firstMonthReport, changes',
  branchReports: '&report_uid, report, service_year, month, details, updatedAt',
  meetingAttendance: '&uid, service_year, month_value, midweek_meeting, weekend_meeting',
  serviceYear: '&uid, value',
  fieldServiceGroup: '&fieldServiceGroup_uid, isCurrent, groups',
  announcements: '&announcement_id, title, body',
  assignment: '&id_type, code, assignable, linkTo, type, assignment_type_name',
  week_type: '&id_week_type, week_type_name, sort_index',
});

appDb.version(2).stores({
  persons:
    '&person_uid, person_firstname, person_lastname, person_displayName, isMale, isFemale, birthDate, isUnavailable, assignments, timeAway, isMoved, isDisqualified, email, address, phone, firstMonthReport, baptizedPublisher, unbaptizedPublisher, midweekMeetingStudent, privileges, enrollments, emergencyContacts',
});

appDb.on('populate', function () {
  appDb.app_settings.add({
    id: 1,
    cong_number: 0,
    cong_name: '',
    cong_role: [],
    class_count: 1,
    midweek_meeting_day: 1,
    weekend_meeting_day: 6,
    user_members_delegate: [],
    user_local_uid: '',
    account_version: 'v2',
    schedule_useFullname: false,
    opening_prayer_autoAssign: false,
    midweek_meeting_useExactDate: false,
    weekend_meeting_useSubstituteSpeaker: false,
    autoBackup: { value: true, updatedAt: new Date().toISOString() },
    autoBackup_interval: { value: 5, updatedAt: new Date().toISOString() },
    follow_os_theme: { value: true, updatedAt: new Date().toISOString() },
    user_time_away: { data: [], changes: [] },
  });
});

export default appDb;
