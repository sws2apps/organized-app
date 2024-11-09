import Dexie from 'dexie';

const appDb = new Dexie('cpe_sws');

appDb.version(1).stores({
  app_settings:
    '++id, username, local_uid, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, pocket_members, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type',
  sched_MM:
    '&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, ass4_stu_A, ass4_ass_A, ass4_stu_B, ass4_ass_B, week_type, noMeeting, isReleased, chairmanMM_A, chairmanMM_B, opening_prayer, tgw_talk, tgw_gems, lc_part1, lc_part2, cbs_conductor, cbs_reader, closing_prayer, changes',
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isUnavailable, lastAssignment, person_uid, assignments, timeAway, isMoved, isDisqualified, isChairmanMM, isPrayerMM, isTGWTalk, isTGWGems, isLCPart, isCBSConductor, isCBSReader, changes',
  src: '&weekOf, bibleReading_src, bibleReading_study, ass1_type, ass1_study, ass1_time, ass1_src, ass2_type, ass2_study, ass2_time, ass2_src, ass3_type, ass3_study, ass3_time, ass3_src, ass4_type, ass4_study, ass4_time, ass4_src, ayfCount, weekDate_src, weeklyBibleReading_src, songFirst_src, tgwTalk_src, songMiddle_src, lcCount, lcCount_override, lcPart1_time, lcPart1_time_override, lcPart1_src, lcPart1_src_override, lcPart1_content, lcPart1_content_override, lcPart2_time, lcPart2_time_override, lcPart2_src, lcPart2_src_override, lcPart2_content, lcPart2_content_override, cbs_src, cbs_time_override, songConclude_src, songConclude_src_override, co_talk_title, keepOverride',
  week_type: '&id_week_type, week_type_name, sort_index',
  sws_pocket: '&id, [month+year]',
  assignment: '&id_type, code, assignable, linkTo, type, assignment_type_name',
  deleted: '++id, table, ref, date',
  announcements: '&announcement_id, title, body',
});
appDb.version(2).stores({
  sched_MM:
    '&weekOf, bRead_stu_A, bRead_stu_A_name, bRead_stu_A_dispName, bRead_stu_B, bRead_stu_B_name, bRead_stu_B_dispName, ass1_stu_A, ass1_stu_A_name, ass1_stu_A_dispName, ass1_ass_A, ass1_ass_A_name, ass1_ass_A_dispName, ass1_stu_B, ass1_stu_B_name, ass1_stu_B_dispName, ass1_ass_B, ass1_ass_B_name, ass1_ass_B_dispName, ass2_stu_A, ass2_stu_A_name, ass2_stu_A_dispName, ass2_ass_A, ass2_ass_A_name, ass2_ass_A_dispName, ass2_stu_B, ass2_stu_B_name, ass2_stu_B_dispName, ass2_ass_B, ass2_ass_B_name, ass2_ass_B_dispName, ass3_stu_A, ass3_stu_A_name, ass3_stu_A_dispName, ass3_ass_A, ass3_ass_A_name, ass3_ass_A_dispName, ass3_stu_B, ass3_stu_B_name, ass3_stu_B_dispName, ass3_ass_B, ass3_ass_B_name, ass3_ass_B_dispName, ass4_stu_A, ass4_stu_A_name, ass4_stu_A_dispName, ass4_ass_A, ass4_ass_A_name, ass4_ass_A_dispName, ass4_stu_B, ass4_stu_B_name, ass4_stu_B_dispName, ass4_ass_B, ass4_ass_B_name, ass4_ass_B_dispName, week_type, noMeeting, isReleased, chairmanMM_A, chairmanMM_A_name, chairmanMM_A_dispName, chairmanMM_B, chairmanMM_B_name, chairmanMM_B_dispName, opening_prayer, opening_prayer_name, opening_prayer_dispName, tgw_talk, tgw_talk_name, tgw_talk_dispName, tgw_gems, tgw_gems_name, tgw_gems_dispName, lc_part1, lc_part1_name, lc_part1_dispName, lc_part2, lc_part2_name, lc_part2_dispName, cbs_conductor, cbs_conductor_name, cbs_conductor_dispName, cbs_reader, cbs_reader_name, cbs_reader_dispName, closing_prayer, closing_prayer_name, closing_prayer_dispName, changes',
});
appDb
  .version(3)
  .stores({
    personsTmp:
      '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, lastAssignment, assignments, timeAway, isMoved, isDisqualified, isChairmanMM, isPrayerMM, isTGWTalk, isTGWGems, isLCPart, isCBSConductor, isCBSReader, changes',
  })
  .upgrade(async (trans) => {
    const oldPersons = await trans.persons.toArray();
    for await (const person of oldPersons) {
      delete person.id;
      await trans.personsTmp.put(person, person.person_uid);
    }
  });
appDb.version(4).stores({
  persons: null,
});
appDb
  .version(5)
  .stores({
    persons:
      '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, lastAssignment, assignments, timeAway, isMoved, isDisqualified, isChairmanMM, isPrayerMM, isTGWTalk, isTGWGems, isLCPart, isCBSConductor, isCBSReader, changes',
  })
  .upgrade(async (trans) => {
    const oldPersons = await trans.personsTmp.toArray();
    for await (const person of oldPersons) {
      await trans.persons.put(person, person.person_uid);
    }
  });
appDb.version(6).stores({
  personsTmp: null,
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, lastAssignment, assignments, timeAway, isMoved, isDisqualified, changes',
});
appDb.version(7).stores({
  app_settings:
    '++id, username, local_uid, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, pocket_members, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_autoAssign',
});
appDb.version(8).stores({
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, assignments, timeAway, isMoved, isDisqualified, changes',
});
appDb.version(9).stores({
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, assignments, timeAway, isMoved, isDisqualified, birthDate, isAnointed, isOtherSheep, isElder, isMS, isPublisher, changes',
});
appDb.version(10).stores({
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, assignments, timeAway, isMoved, isDisqualified, birthDate, isAnointed, isOtherSheep, isElder, isMS, isPublisher, isBaptized, immersedDate, changes',
});
appDb.version(11).stores({
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, assignments, timeAway, isMoved, isDisqualified, birthDate, isAnointed, isOtherSheep, isElder, isMS, isPublisher, isBaptized, immersedDate, email, address, phone, changes',
});
appDb.version(12).stores({
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, assignments, timeAway, isMoved, isDisqualified, birthDate, isAnointed, isOtherSheep, isElder, isMS, isPublisher, isBaptized, immersedDate, email, address, phone, spiritualStatus, otherService, changes',
});
appDb.version(13).stores({
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, assignments, timeAway, isMoved, isDisqualified, birthDate, isAnointed, isOtherSheep, isElder, isMS, isPublisher, isBaptized, immersedDate, email, address, phone, spiritualStatus, otherService, changes',
});
appDb.version(14).stores({
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, assignments, timeAway, isMoved, isDisqualified, birthDate, isAnointed, isOtherSheep, isBaptized, immersedDate, email, address, phone, spiritualStatus, otherService, changes',
});
appDb.version(15).stores({
  fieldServiceGroup: '&fieldServiceGroup_uid, isCurrent, groups',
});
appDb.version(16).stores({
  serviceYear: '&uid, value',
});
appDb.version(17).stores({
  meetingAttendance:
    '&uid, service_year, month_value, midweek_meeting, weekend_meeting',
});
appDb.version(18).stores({
  fieldServiceReports:
    '&uid, service_year, month_value, placements, videos, hours, minutes, isMinutesPosted, returnVisits, bibleStudies, comments, noReport',
});
appDb.version(19).stores({
  fieldServiceReports: '&uid, service_year, person_uid, months',
});
appDb.version(20).stores({
  branchReports: '&report_uid, report, service_year, month, details',
});
appDb.version(21).stores({
  minutesReports: '&uid, person_uid, service_year, month',
});
appDb.version(22).stores({
  branchReports: '&report_uid, report, service_year, month, details, updatedAt',
});
appDb.version(23).stores({
  lateReports: '&uid, person_uid, service_year, month',
});
appDb.version(24).stores({
  persons:
    '&person_uid, person_name, person_displayName, isMale, isFemale, isUnavailable, assignments, timeAway, isMoved, isDisqualified, birthDate, isAnointed, isOtherSheep, isBaptized, immersedDate, email, address, phone, spiritualStatus, otherService, firstMonthReport, changes',
});
appDb.version(25).stores({
  lateReports: '&uid, person_uid, service_year, month, deleted',
  minutesReports: '&uid, person_uid, service_year, month, deleted',
});
appDb.version(26).stores({
  fieldServiceReports:
    '&uid, service_year, month_value, placements, videos, hours, minutes, returnVisits, bibleStudies, comments',
});
appDb.version(27).stores({
  fieldServiceReports: '&uid, service_year, person_uid, months',
});
appDb.version(28).stores({
  app_settings:
    '++id, username, local_uid, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, pocket_members, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_autoAssign, user_local_uid, user_members_delegate',
});
appDb.version(29).stores({
  app_settings:
    '++id, username, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_autoAssign, user_local_uid, user_members_delegate',
});
appDb.version(32).stores({
  user_bible_studies:
    '&uid, person_name, person_active, person_addresses, person_contact, changes, isDeleted',
});
appDb.version(41).stores({
  user_field_service_reports:
    '&report_uid, month, month_date, placements, videos, duration, duration_start, returnVisits, bibleStudies, comments, changes, isDeleted, isSubmitted, isPending, isS4, isS21',
});
appDb.version(42).stores({
  sched_WM:
    '&weekOf, chairman_WM, chairman_WM_name, chairman_WM_dispName, opening_prayer, opening_prayer_name, opening_prayer_dispName, speaker_1, speaker_1_name, speaker_1_dispName, speaker_2, speaker_2_name, speaker_2_dispName, is_visiting_speaker, public_talk, event_name, wtstudy_reader, wtstudy_reader_name, wtstudy_reader_dispName, changes',
  app_settings:
    '++id, username, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_autoAssign, user_local_uid, user_members_delegate, opening_prayer_WM_autoAssign',
  public_talks: '&talk_number, talk_title, talk_modified',
  visiting_speakers:
    '&person_uid, person_name, person_displayName, cong_id, cong_name, cong_number, talks, is_unavailable',
});
appDb.version(43).stores({
  sched_WM:
    '&weekOf, chairman_WM, chairman_WM_name, chairman_WM_dispName, opening_prayer, opening_prayer_name, opening_prayer_dispName, speaker_1, speaker_1_name, speaker_1_dispName, speaker_2, speaker_2_name, speaker_2_dispName, is_visiting_speaker, public_talk, event_name, wtstudy_reader, wtstudy_reader_name, wtstudy_reader_dispName, week_type, noMeeting, changes',
});
appDb.version(44).stores({
  public_talks: '&talk_number, talk_title',
});
appDb.version(45).stores({
  src: '&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src, ass4_type, ass4_time, ass4_src, ayfCount, weekDate_src, weeklyBibleReading_src, songFirst_src, tgwTalk_src, songMiddle_src, lcCount, lcCount_override, lcPart1_time, lcPart1_time_override, lcPart1_src, lcPart1_src_override, lcPart1_content, lcPart1_content_override, lcPart2_time, lcPart2_time_override, lcPart2_src, lcPart2_src_override, lcPart2_content, lcPart2_content_override, cbs_src, cbs_time_override, songConclude_src, songConclude_src_override, co_talk_title, w_study_date_locale, w_study_title, w_study_opening_song, w_study_concluding_song, keepOverride',
});
appDb
  .version(46)
  .stores({
    sched:
      '&weekOf, bRead_stu_A, bRead_stu_A_name, bRead_stu_A_dispName, bRead_stu_B, bRead_stu_B_name, bRead_stu_B_dispName, ass1_stu_A, ass1_stu_A_name, ass1_stu_A_dispName, ass1_ass_A, ass1_ass_A_name, ass1_ass_A_dispName, ass1_stu_B, ass1_stu_B_name, ass1_stu_B_dispName, ass1_ass_B, ass1_ass_B_name, ass1_ass_B_dispName, ass2_stu_A, ass2_stu_A_name, ass2_stu_A_dispName, ass2_ass_A, ass2_ass_A_name, ass2_ass_A_dispName, ass2_stu_B, ass2_stu_B_name, ass2_stu_B_dispName, ass2_ass_B, ass2_ass_B_name, ass2_ass_B_dispName, ass3_stu_A, ass3_stu_A_name, ass3_stu_A_dispName, ass3_ass_A, ass3_ass_A_name, ass3_ass_A_dispName, ass3_stu_B, ass3_stu_B_name, ass3_stu_B_dispName, ass3_ass_B, ass3_ass_B_name, ass3_ass_B_dispName, ass4_stu_A, ass4_stu_A_name, ass4_stu_A_dispName, ass4_ass_A, ass4_ass_A_name, ass4_ass_A_dispName, ass4_stu_B, ass4_stu_B_name, ass4_stu_B_dispName, ass4_ass_B, ass4_ass_B_name, ass4_ass_B_dispName, week_type, noMMeeting, isReleased, chairmanMM_A, chairmanMM_A_name, chairmanMM_A_dispName, chairmanMM_B, chairmanMM_B_name, chairmanMM_B_dispName, opening_prayerMM, opening_prayerMM_name, opening_prayerMM_dispName, tgw_talk, tgw_talk_name, tgw_talk_dispName, tgw_gems, tgw_gems_name, tgw_gems_dispName, lc_part1, lc_part1_name, lc_part1_dispName, lc_part2, lc_part2_name, lc_part2_dispName, cbs_conductor, cbs_conductor_name, cbs_conductor_dispName, cbs_reader, cbs_reader_name, cbs_reader_dispName, closing_prayerMM, closing_prayerMM_name, closing_prayerMM_dispName, chairman_WM, chairman_WM_name, chairman_WM_dispName, opening_prayerWM, opening_prayerWM_name, opening_prayerWM_dispName, speaker_1, speaker_1_name, speaker_1_dispName, speaker_2, speaker_2_name, speaker_2_dispName, is_visiting_speaker, public_talk, event_name, wtstudy_reader, wtstudy_reader_name, wtstudy_reader_dispName, noWMeeting, changes',
  })
  .upgrade(async (trans) => {
    const oldSchedules = await trans.sched_MM.toArray();
    for await (const schedule of oldSchedules) {
      const data = structuredClone(schedule);
      data.noMMeeting = data.noMeeting;
      data.opening_prayerMM = data.opening_prayer;
      data.opening_prayerMM_name = data.opening_prayer_name;
      data.opening_prayerMM_dispName = data.opening_prayer_dispName;
      data.closing_prayerMM = data.closing_prayer;
      data.closing_prayerMM_name = data.closing_prayer_name;
      data.closing_prayerMM_dispName = data.closing_prayer_dispName;
      delete data.noMeeting;
      await trans.sched.put(data, schedule.weekOf);
    }
  });
appDb.version(47).stores({
  sched_MM: null,
  sched_WM: null,
});
appDb
  .version(48)
  .stores({
    sources:
      '&weekOf, mwb_week_date_locale, mwb_weekly_bible_reading, mwb_song_first, mwb_tgw_talk, mwb_tgw_bread, mwb_ayf_count, mwb_ayf_part1, mwb_ayf_part1_time, mwb_ayf_part1_type, mwb_ayf_part2, mwb_ayf_part2_time, mwb_ayf_part2_type, mwb_ayf_part3, mwb_ayf_part3_time, mwb_ayf_part3_type, mwb_ayf_part4, mwb_ayf_part4_time, mwb_ayf_part4_type, mwb_song_middle, mwb_lc_count, mwb_lc_count_override, mwb_lc_part1, mwb_lc_part1_override, mwb_lc_part1_time, mwb_lc_part1_time_override, mwb_lc_part1_content, mwb_lc_part1_content_override, mwb_lc_part2, mwb_lc_part2_override, mwb_lc_part2_time, mwb_lc_part2_time_override, mwb_lc_part2_content, mwb_lc_part2_content_override, mwb_lc_cbs, mwb_lc_cbs_time_override, mwb_song_conclude, mwb_song_conclude_override, mwb_co_talk_title, w_study_date_locale, w_study_title, w_study_opening_song, w_study_concluding_song, keepOverride',
  })
  .upgrade(async (trans) => {
    const oldSources = await trans.src.toArray();
    for await (const source of oldSources) {
      const data = {};
      data.weekOf = source.weekOf;
      data.mwb_week_date_locale = source.weekDate_src;
      data.mwb_weekly_bible_reading = source.weeklyBibleReading_src;
      data.mwb_song_first = source.songFirst_src;
      data.mwb_tgw_talk = source.tgwTalk_src;
      data.mwb_tgw_bread = source.bibleReading_src;
      data.mwb_ayf_count = source.ayfCount;
      data.mwb_ayf_part1 = source.ass1_src;
      data.mwb_ayf_part1_type = source.ass1_type;
      data.mwb_ayf_part1_time = source.ass1_time;
      data.mwb_ayf_part2 = source.ass2_src;
      data.mwb_ayf_part2_type = source.ass2_type;
      data.mwb_ayf_part2_time = source.ass2_time;
      data.mwb_ayf_part3 = source.ass3_src;
      data.mwb_ayf_part3_type = source.ass3_type;
      data.mwb_ayf_part3_time = source.ass3_time;
      data.mwb_ayf_part4 = source.ass4_src;
      data.mwb_ayf_part4_type = source.ass4_type;
      data.mwb_ayf_part4_time = source.ass4_time;
      data.mwb_song_middle = source.songMiddle_src;
      data.mwb_lc_count = source.lcCount;
      data.mwb_lc_count_override = source.lcCount_override;
      data.mwb_lc_part1 = source.lcPart1_src;
      data.mwb_lc_part1_override = source.lcPart1_src_override;
      data.mwb_lc_part1_time = source.lcPart1_time;
      data.mwb_lc_part1_time_override = source.lcPart1_time_override;
      data.mwb_lc_part1_content = source.lcPart1_content;
      data.mwb_lc_part1_content_override = source.lcPart1_content_override;
      data.mwb_lc_part2 = source.lcPart2_src;
      data.mwb_lc_part2_override = source.lcPart2_src_override;
      data.mwb_lc_part2_time = source.lcPart2_time;
      data.mwb_lc_part2_time_override = source.lcPart2_time_override;
      data.mwb_lc_part2_content = source.lcPart2_content;
      data.mwb_lc_part2_content_override = source.lcPart2_content_override;
      data.mwb_lc_cbs = source.cbs_src;
      data.mwb_lc_cbs_time_override = source.cbs_time_override;
      data.mwb_co_talk_title = source.co_talk_title;
      data.mwb_song_conclude = source.songConclude_src;
      data.mwb_song_conclude_override = source.songConclude_src_override;
      data.keepOverride = source.keepOverride;

      await trans.sources.put(data, data.weekOf);
    }
  });
appDb.version(49).stores({
  src: null,
});
appDb
  .version(51)
  .stores({
    app_settings:
      '++id, username, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_MM_autoAssign, user_local_uid, user_members_delegate, opening_prayer_WM_autoAssign',
  })
  .upgrade(async (trans) => {
    const oldSetting = await trans.app_settings.toArray();
    for await (const setting of oldSetting) {
      setting.opening_prayer_MM_autoAssign = setting.opening_prayer_autoAssign;
      await trans.app_settings.put(setting, setting.id);
    }
  });
appDb
  .version(52)
  .stores({
    app_settings:
      '++id, username, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_MM_autoAssign, user_local_uid, user_members_delegate, opening_prayer_WM_autoAssign, midweek_meeting_day, weekend_meeting_day',
  })
  .upgrade(async (trans) => {
    const oldSetting = await trans.app_settings.toArray();
    for await (const setting of oldSetting) {
      setting.midweek_meeting_day = setting.meeting_day;
      await trans.app_settings.put(setting, setting.id);
    }
  });
appDb.version(54).stores({
  sources:
    '&weekOf, mwb_week_date_locale, mwb_weekly_bible_reading, mwb_song_first, mwb_tgw_talk, mwb_tgw_bread, mwb_ayf_count, mwb_ayf_part1, mwb_ayf_part1_time, mwb_ayf_part1_type, mwb_ayf_part2, mwb_ayf_part2_time, mwb_ayf_part2_type, mwb_ayf_part3, mwb_ayf_part3_time, mwb_ayf_part3_type, mwb_ayf_part4, mwb_ayf_part4_time, mwb_ayf_part4_type, mwb_song_middle, mwb_lc_count, mwb_lc_count_override, mwb_lc_part1, mwb_lc_part1_override, mwb_lc_part1_time, mwb_lc_part1_time_override, mwb_lc_part1_content, mwb_lc_part1_content_override, mwb_lc_part2, mwb_lc_part2_override, mwb_lc_part2_time, mwb_lc_part2_time_override, mwb_lc_part2_content, mwb_lc_part2_content_override, mwb_lc_cbs, mwb_lc_cbs_time_override, mwb_song_conclude, mwb_song_conclude_override, mwb_co_talk_title, w_study_date_locale, w_study_title, w_study_opening_song, w_study_concluding_song, w_co_talk_title, keepOverride',
});
appDb.version(55).stores({
  visiting_speakers: null,
});
appDb.version(56).stores({
  visiting_speakers:
    '&cong_local_uid, cong_id, cong_name, cong_number, is_sync, is_deleted, changes',
});
appDb.version(57).stores({
  visiting_speakers:
    '&cong_local_uid, cong_id, cong_name, cong_number, cong_speakers, is_sync, is_deleted, changes',
});
appDb.version(58).stores({
  visiting_speakers:
    '&cong_local_uid, cong_id, cong_name, cong_number, cong_speakers, is_local, is_sync, is_deleted, changes',
});
appDb.version(59).stores({
  visiting_speakers: null,
});
appDb.version(60).stores({
  visiting_speakers:
    '&cong_number, cong_id, cong_name, cong_speakers, is_local, is_sync, is_deleted, changes',
});
appDb.version(61).stores({
  visiting_speakers:
    '&cong_number, cong_id, cong_name, cong_speakers, is_local, is_deleted, changes',
});
appDb.version(62).stores({
  visiting_speakers:
    '&cong_number, cong_id, cong_name, cong_speakers, is_local, is_pending, changes',
});
appDb.version(63).stores({
  visiting_speakers:
    '&cong_number, cong_id, cong_name, cong_speakers, is_local, is_pending, notif_dismissed, changes',
});
appDb.version(64).stores({
  visiting_speakers:
    '&cong_number, cong_id, cong_name, cong_speakers, is_local, request_status, notif_dismissed, changes',
});
appDb
  .version(72)
  .stores({
    sources_temp:
      '&weekOf, mwb_week_date_locale, mwb_weekly_bible_reading, mwb_song_first, mwb_tgw_talk, mwb_tgw_bread, mwb_ayf_count, mwb_ayf_part1, mwb_ayf_part1_time, mwb_ayf_part1_type, mwb_ayf_part2, mwb_ayf_part2_time, mwb_ayf_part2_type, mwb_ayf_part3, mwb_ayf_part3_time, mwb_ayf_part3_type, mwb_ayf_part4, mwb_ayf_part4_time, mwb_ayf_part4_type, mwb_song_middle, mwb_lc_count, mwb_lc_count_override, mwb_lc_part1, mwb_lc_part1_override, mwb_lc_part1_time, mwb_lc_part1_time_override, mwb_lc_part1_content, mwb_lc_part1_content_override, mwb_lc_part2, mwb_lc_part2_override, mwb_lc_part2_time, mwb_lc_part2_time_override, mwb_lc_part2_content, mwb_lc_part2_content_override, mwb_lc_cbs, mwb_lc_cbs_time_override, mwb_song_conclude, mwb_song_conclude_override, mwb_co_talk_title, w_study_date_locale, w_study_title, w_study_opening_song, w_study_concluding_song, w_co_talk_title, keepOverride',
    sched_temp:
      '&weekOf, bRead_stu_A, bRead_stu_A_name, bRead_stu_A_dispName, bRead_stu_B, bRead_stu_B_name, bRead_stu_B_dispName, ass1_stu_A, ass1_stu_A_name, ass1_stu_A_dispName, ass1_ass_A, ass1_ass_A_name, ass1_ass_A_dispName, ass1_stu_B, ass1_stu_B_name, ass1_stu_B_dispName, ass1_ass_B, ass1_ass_B_name, ass1_ass_B_dispName, ass2_stu_A, ass2_stu_A_name, ass2_stu_A_dispName, ass2_ass_A, ass2_ass_A_name, ass2_ass_A_dispName, ass2_stu_B, ass2_stu_B_name, ass2_stu_B_dispName, ass2_ass_B, ass2_ass_B_name, ass2_ass_B_dispName, ass3_stu_A, ass3_stu_A_name, ass3_stu_A_dispName, ass3_ass_A, ass3_ass_A_name, ass3_ass_A_dispName, ass3_stu_B, ass3_stu_B_name, ass3_stu_B_dispName, ass3_ass_B, ass3_ass_B_name, ass3_ass_B_dispName, ass4_stu_A, ass4_stu_A_name, ass4_stu_A_dispName, ass4_ass_A, ass4_ass_A_name, ass4_ass_A_dispName, ass4_stu_B, ass4_stu_B_name, ass4_stu_B_dispName, ass4_ass_B, ass4_ass_B_name, ass4_ass_B_dispName, week_type, noMMeeting, isReleased, chairmanMM_A, chairmanMM_A_name, chairmanMM_A_dispName, chairmanMM_B, chairmanMM_B_name, chairmanMM_B_dispName, opening_prayerMM, opening_prayerMM_name, opening_prayerMM_dispName, tgw_talk, tgw_talk_name, tgw_talk_dispName, tgw_gems, tgw_gems_name, tgw_gems_dispName, lc_part1, lc_part1_name, lc_part1_dispName, lc_part2, lc_part2_name, lc_part2_dispName, cbs_conductor, cbs_conductor_name, cbs_conductor_dispName, cbs_reader, cbs_reader_name, cbs_reader_dispName, closing_prayerMM, closing_prayerMM_name, closing_prayerMM_dispName, chairman_WM, chairman_WM_name, chairman_WM_dispName, opening_prayerWM, opening_prayerWM_name, opening_prayerWM_dispName, speaker_1, speaker_1_name, speaker_1_dispName, speaker_2, speaker_2_name, speaker_2_dispName, is_visiting_speaker, public_talk, event_name, wtstudy_reader, wtstudy_reader_name, wtstudy_reader_dispName, noWMeeting, changes',
  })
  .upgrade(async (trans) => {
    const sources = await trans.sources.toArray();
    for await (const source of sources) {
      const oldWeekOf = source.weekOf;
      const str = oldWeekOf.split('/');
      const newWeekOf = `${str[0]}/${str[1]}/${str[2]}`;

      const data = { ...source, weekOf: newWeekOf };

      await trans.sources_temp.put(data, oldWeekOf);
    }

    const schedules = await trans.sched.toArray();
    for await (const schedule of schedules) {
      const oldWeekOf = schedule.weekOf;
      const str = oldWeekOf.split('/');
      const newWeekOf = `${str[0]}/${str[1]}/${str[2]}`;

      const data = { ...schedule, weekOf: newWeekOf };

      await trans.sched_temp.put(data, oldWeekOf);
    }
  });
appDb.version(73).stores({
  sources: null,
  sched: null,
});
appDb
  .version(74)
  .stores({
    sources:
      '&weekOf, mwb_week_date_locale, mwb_weekly_bible_reading, mwb_song_first, mwb_tgw_talk, mwb_tgw_bread, mwb_ayf_count, mwb_ayf_part1, mwb_ayf_part1_time, mwb_ayf_part1_type, mwb_ayf_part2, mwb_ayf_part2_time, mwb_ayf_part2_type, mwb_ayf_part3, mwb_ayf_part3_time, mwb_ayf_part3_type, mwb_ayf_part4, mwb_ayf_part4_time, mwb_ayf_part4_type, mwb_song_middle, mwb_lc_count, mwb_lc_count_override, mwb_lc_part1, mwb_lc_part1_override, mwb_lc_part1_time, mwb_lc_part1_time_override, mwb_lc_part1_content, mwb_lc_part1_content_override, mwb_lc_part2, mwb_lc_part2_override, mwb_lc_part2_time, mwb_lc_part2_time_override, mwb_lc_part2_content, mwb_lc_part2_content_override, mwb_lc_cbs, mwb_lc_cbs_time_override, mwb_song_conclude, mwb_song_conclude_override, mwb_co_talk_title, w_study_date_locale, w_study_title, w_study_opening_song, w_study_concluding_song, w_co_talk_title, keepOverride',
    sched:
      '&weekOf, bRead_stu_A, bRead_stu_A_name, bRead_stu_A_dispName, bRead_stu_B, bRead_stu_B_name, bRead_stu_B_dispName, ass1_stu_A, ass1_stu_A_name, ass1_stu_A_dispName, ass1_ass_A, ass1_ass_A_name, ass1_ass_A_dispName, ass1_stu_B, ass1_stu_B_name, ass1_stu_B_dispName, ass1_ass_B, ass1_ass_B_name, ass1_ass_B_dispName, ass2_stu_A, ass2_stu_A_name, ass2_stu_A_dispName, ass2_ass_A, ass2_ass_A_name, ass2_ass_A_dispName, ass2_stu_B, ass2_stu_B_name, ass2_stu_B_dispName, ass2_ass_B, ass2_ass_B_name, ass2_ass_B_dispName, ass3_stu_A, ass3_stu_A_name, ass3_stu_A_dispName, ass3_ass_A, ass3_ass_A_name, ass3_ass_A_dispName, ass3_stu_B, ass3_stu_B_name, ass3_stu_B_dispName, ass3_ass_B, ass3_ass_B_name, ass3_ass_B_dispName, ass4_stu_A, ass4_stu_A_name, ass4_stu_A_dispName, ass4_ass_A, ass4_ass_A_name, ass4_ass_A_dispName, ass4_stu_B, ass4_stu_B_name, ass4_stu_B_dispName, ass4_ass_B, ass4_ass_B_name, ass4_ass_B_dispName, week_type, noMMeeting, isReleased, chairmanMM_A, chairmanMM_A_name, chairmanMM_A_dispName, chairmanMM_B, chairmanMM_B_name, chairmanMM_B_dispName, opening_prayerMM, opening_prayerMM_name, opening_prayerMM_dispName, tgw_talk, tgw_talk_name, tgw_talk_dispName, tgw_gems, tgw_gems_name, tgw_gems_dispName, lc_part1, lc_part1_name, lc_part1_dispName, lc_part2, lc_part2_name, lc_part2_dispName, cbs_conductor, cbs_conductor_name, cbs_conductor_dispName, cbs_reader, cbs_reader_name, cbs_reader_dispName, closing_prayerMM, closing_prayerMM_name, closing_prayerMM_dispName, chairman_WM, chairman_WM_name, chairman_WM_dispName, opening_prayerWM, opening_prayerWM_name, opening_prayerWM_dispName, speaker_1, speaker_1_name, speaker_1_dispName, speaker_2, speaker_2_name, speaker_2_dispName, is_visiting_speaker, public_talk, event_name, wtstudy_reader, wtstudy_reader_name, wtstudy_reader_dispName, noWMeeting, changes',
  })
  .upgrade(async (trans) => {
    const sources = await trans.sources_temp.toArray();
    for await (const source of sources) {
      await trans.sources.put(source, source.weekOf);
    }

    const schedules = await trans.sched_temp.toArray();
    for await (const schedule of schedules) {
      await trans.sched.put(schedule, schedule.weekOf);
    }
  });
appDb.version(75).stores({
  sources_temp: null,
  sched_temp: null,
});
appDb.version(76).stores({
  app_settings:
    '++id, username, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_MM_autoAssign, user_local_uid, user_members_delegate, opening_prayer_WM_autoAssign, midweek_meeting_day, weekend_meeting_day, midweek_meeting_useExactDate',
});
appDb.version(77).stores({
  app_settings:
    '++id, username, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_MM_autoAssign, user_local_uid, user_members_delegate, opening_prayer_WM_autoAssign, midweek_meeting_day, weekend_meeting_day, midweek_meeting_useExactDate, weekend_meeting_useSubstituteSpeaker',
});
appDb.version(78).stores({
  sched:
    '&weekOf, bRead_stu_A, bRead_stu_A_name, bRead_stu_A_dispName, bRead_stu_B, bRead_stu_B_name, bRead_stu_B_dispName, ass1_stu_A, ass1_stu_A_name, ass1_stu_A_dispName, ass1_ass_A, ass1_ass_A_name, ass1_ass_A_dispName, ass1_stu_B, ass1_stu_B_name, ass1_stu_B_dispName, ass1_ass_B, ass1_ass_B_name, ass1_ass_B_dispName, ass2_stu_A, ass2_stu_A_name, ass2_stu_A_dispName, ass2_ass_A, ass2_ass_A_name, ass2_ass_A_dispName, ass2_stu_B, ass2_stu_B_name, ass2_stu_B_dispName, ass2_ass_B, ass2_ass_B_name, ass2_ass_B_dispName, ass3_stu_A, ass3_stu_A_name, ass3_stu_A_dispName, ass3_ass_A, ass3_ass_A_name, ass3_ass_A_dispName, ass3_stu_B, ass3_stu_B_name, ass3_stu_B_dispName, ass3_ass_B, ass3_ass_B_name, ass3_ass_B_dispName, ass4_stu_A, ass4_stu_A_name, ass4_stu_A_dispName, ass4_ass_A, ass4_ass_A_name, ass4_ass_A_dispName, ass4_stu_B, ass4_stu_B_name, ass4_stu_B_dispName, ass4_ass_B, ass4_ass_B_name, ass4_ass_B_dispName, week_type, noMMeeting, isReleased, chairmanMM_A, chairmanMM_A_name, chairmanMM_A_dispName, chairmanMM_B, chairmanMM_B_name, chairmanMM_B_dispName, opening_prayerMM, opening_prayerMM_name, opening_prayerMM_dispName, tgw_talk, tgw_talk_name, tgw_talk_dispName, tgw_gems, tgw_gems_name, tgw_gems_dispName, lc_part1, lc_part1_name, lc_part1_dispName, lc_part2, lc_part2_name, lc_part2_dispName, cbs_conductor, cbs_conductor_name, cbs_conductor_dispName, cbs_reader, cbs_reader_name, cbs_reader_dispName, closing_prayerMM, closing_prayerMM_name, closing_prayerMM_dispName, chairman_WM, chairman_WM_name, chairman_WM_dispName, opening_prayerWM, opening_prayerWM_name, opening_prayerWM_dispName, speaker_1, speaker_1_name, speaker_1_dispName, speaker_2, speaker_2_name, speaker_2_dispName, is_visiting_speaker, public_talk, event_name, wtstudy_reader, wtstudy_reader_name, wtstudy_reader_dispName, noWMeeting, substitute_speaker, substitute_speaker_name, substitute_speaker_dispName, changes',
});
appDb.version(79).stores({
  app_settings:
    '++id, username, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_MM_autoAssign, user_local_uid, user_members_delegate, opening_prayer_WM_autoAssign, midweek_meeting_day, weekend_meeting_day, midweek_meeting_useExactDate, weekend_meeting_useSubstituteSpeaker, assignment_updated2024',
});
appDb.version(80).stores({
  sources:
    '&weekOf, mwb_week_date_locale, mwb_weekly_bible_reading, mwb_song_first, mwb_tgw_talk, mwb_tgw_bread, mwb_ayf_count, mwb_ayf_part1, mwb_ayf_part1_time, mwb_ayf_part1_type, mwb_ayf_part2, mwb_ayf_part2_time, mwb_ayf_part2_type, mwb_ayf_part3, mwb_ayf_part3_time, mwb_ayf_part3_type, mwb_ayf_part4, mwb_ayf_part4_time, mwb_ayf_part4_type, mwb_song_middle, mwb_lc_count, mwb_lc_count_override, mwb_lc_part1, mwb_lc_part1_override, mwb_lc_part1_time, mwb_lc_part1_time_override, mwb_lc_part1_content, mwb_lc_part1_content_override, mwb_lc_part2, mwb_lc_part2_override, mwb_lc_part2_time, mwb_lc_part2_time_override, mwb_lc_part2_content, mwb_lc_part2_content_override, mwb_lc_cbs, mwb_lc_cbs_time_override, mwb_song_conclude, mwb_song_conclude_override, mwb_co_talk_title, w_study_date_locale, w_study_title, w_study_opening_song, w_study_concluding_song, w_talk_title_override, keepOverride',
});
appDb.version(81).stores({
  sched:
    '&weekOf, bRead_stu_A, bRead_stu_A_name, bRead_stu_A_dispName, bRead_stu_B, bRead_stu_B_name, bRead_stu_B_dispName, ass1_stu_A, ass1_stu_A_name, ass1_stu_A_dispName, ass1_ass_A, ass1_ass_A_name, ass1_ass_A_dispName, ass1_stu_B, ass1_stu_B_name, ass1_stu_B_dispName, ass1_ass_B, ass1_ass_B_name, ass1_ass_B_dispName, ass2_stu_A, ass2_stu_A_name, ass2_stu_A_dispName, ass2_ass_A, ass2_ass_A_name, ass2_ass_A_dispName, ass2_stu_B, ass2_stu_B_name, ass2_stu_B_dispName, ass2_ass_B, ass2_ass_B_name, ass2_ass_B_dispName, ass3_stu_A, ass3_stu_A_name, ass3_stu_A_dispName, ass3_ass_A, ass3_ass_A_name, ass3_ass_A_dispName, ass3_stu_B, ass3_stu_B_name, ass3_stu_B_dispName, ass3_ass_B, ass3_ass_B_name, ass3_ass_B_dispName, ass4_stu_A, ass4_stu_A_name, ass4_stu_A_dispName, ass4_ass_A, ass4_ass_A_name, ass4_ass_A_dispName, ass4_stu_B, ass4_stu_B_name, ass4_stu_B_dispName, ass4_ass_B, ass4_ass_B_name, ass4_ass_B_dispName, week_type, noMMeeting, isReleased, chairmanMM_A, chairmanMM_A_name, chairmanMM_A_dispName, chairmanMM_B, chairmanMM_B_name, chairmanMM_B_dispName, opening_prayerMM, opening_prayerMM_name, opening_prayerMM_dispName, tgw_talk, tgw_talk_name, tgw_talk_dispName, tgw_gems, tgw_gems_name, tgw_gems_dispName, lc_part1, lc_part1_name, lc_part1_dispName, lc_part2, lc_part2_name, lc_part2_dispName, cbs_conductor, cbs_conductor_name, cbs_conductor_dispName, cbs_reader, cbs_reader_name, cbs_reader_dispName, closing_prayerMM, closing_prayerMM_name, closing_prayerMM_dispName, chairman_WM, chairman_WM_name, chairman_WM_dispName, opening_prayerWM, opening_prayerWM_name, opening_prayerWM_dispName, speaker_1, speaker_1_name, speaker_1_dispName, speaker_2, speaker_2_name, speaker_2_dispName, is_custom_talk, is_visiting_speaker, public_talk, event_name, wtstudy_reader, wtstudy_reader_name, wtstudy_reader_dispName, noWMeeting, substitute_speaker, substitute_speaker_name, substitute_speaker_dispName, changes',
});

export default appDb;
