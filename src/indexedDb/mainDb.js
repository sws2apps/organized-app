import Dexie from 'dexie';

let appDb = new Dexie('lmm_oa');
appDb.version(1).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day',
  ass_type_MG: '&id_type, ass_type_name',
  week_type_MG: '&id_week_type, week_type_name',
  src_MG:
    '&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src',
  sched_MM:
    '&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, week_type, noMeeting',
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment',
});
appDb.version(2).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, liveEventClass',
});
appDb.version(4).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment',
});
appDb.version(5).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, cong_ID, cong_PIN',
});
appDb.version(6).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, student_PIN, viewStudent_Part',
});
appDb.version(7).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, viewOnlineSchedule, student_PIN, viewStudent_Part',
});
appDb.version(8).stores({
  src_MG:
    '&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src, ass4_type, ass4_time, ass4_src',
  sched_MM:
    '&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, ass4_stu_A, ass4_ass_A, ass4_stu_B, ass4_ass_B, week_type, noMeeting',
});
appDb.version(9).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, cong_ID',
});
appDb.version(10).stores({
  src_MG: null,
  ass_type_MG: null,
  week_type_MG: null,
  src: '&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src, ass4_type, ass4_time, ass4_src',
  ass_type: '&id_type, ass_type_name',
  week_type: '&id_week_type, week_type_name',
});
appDb
  .version(11)
  .stores({
    persons:
      '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, viewOnlineSchedule, student_PIN, viewStudent_Part, person_uid',
  })
  .upgrade((trans) => {
    return trans.persons.toCollection().modify((person) => {
      const uid = window.crypto.randomUUID();
      person.person_uid = uid;
    });
  });
appDb.version(12).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted',
});
appDb.version(13).stores({
  app_settings:
    '++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted, isTermsUseAccepted',
});
appDb.version(14).stores({
  app_settings:
    '++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted, isTermsUseAccepted, pwd',
});
appDb.version(15).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted, isCongVerified',
});
appDb.version(16).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, pwd, isScheduleConverted, isCongVerified',
});
appDb.version(17).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, userMe, isScheduleConverted, isCongVerified',
});
appDb.version(18).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, crd, isScheduleConverted, isCongVerified',
});
appDb.version(19).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, userPass, isScheduleConverted, isCongVerified',
});
appDb.version(20).stores({
  app_settings:
    '++id, cong_number, cong_name, class_count, meeting_day, userPass, blob_exp, isScheduleConverted, isCongVerified',
});
appDb.version(21).stores({
  app_settings: '++id, cong_number, cong_name, class_count, meeting_day, userPass, isScheduleConverted, isCongVerified',
});
appDb.version(22).stores({
  app_settings:
    '++id, cong_number, cong_name, class_count, meeting_day, userPass, isLoggedOut, isScheduleConverted, isCongVerified',
});
appDb.version(23).stores({
  app_settings:
    '++id, cong_number, cong_name, class_count, meeting_day, userPass, isLoggedOut, isScheduleConverted, isCongVerified',
});
appDb.version(24).stores({
  app_settings:
    '++id, username, cong_number, cong_name, class_count, meeting_day, userPass, isLoggedOut, isScheduleConverted, isCongVerified',
});
appDb.version(25).stores({
  notifications: '++id, notification_id, isRead, content',
});
appDb.version(26).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, viewOnlineSchedule, student_PIN, viewStudent_Part, person_uid, assignments',
  app_settings:
    '++id, username, cong_number, cong_name, class_count, meeting_day, userPass, isLoggedOut, isScheduleConverted, isCongVerified, isAssignmentsConverted',
});
appDb.version(27).stores({
  ass_type: '&id_type, code, ass_type_name',
});
appDb.version(28).stores({
  ass_type: '&id_type, code, assignable, linkTo, ass_type_name',
});
appDb.version(29).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, viewOnlineSchedule, student_PIN, viewStudent_Part, person_uid, assignments, timeAway',
});
appDb.version(30).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, viewOnlineSchedule, student_PIN, viewStudent_Part, person_uid, assignments, timeAway, isMoved',
});
appDb.version(31).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, viewOnlineSchedule, student_PIN, viewStudent_Part, person_uid, assignments, timeAway, isMoved, isDisqualified',
});
appDb.version(32).stores({
  sched_MM:
    '&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, ass4_stu_A, ass4_ass_A, ass4_stu_B, ass4_ass_B, week_type, noMeeting, isReleased',
});
appDb.version(33).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, person_uid, assignments, timeAway, isMoved, isDisqualified',
});
appDb.version(34).stores({
  sws_pocket: '&id, month, year',
});
appDb.version(35).stores({
  sws_pocket: '&id, [month+year]',
});
appDb.version(36).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, person_uid, assignments, timeAway, isMoved, isDisqualified, isChairmanMM, isPrayerMM, isTGWTalk, isTGWGems, isLCPart, isCBSConductor, isCBSReader, lastChairmanMM, lastPrayerMM, lastTGWTalk, lastTGWGems, lastLCPart, lastCBSConductor, lastCBSReader',
  sched_MM:
    '&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, ass4_stu_A, ass4_ass_A, ass4_stu_B, ass4_ass_B, week_type, noMeeting, isReleased, chairmanMM_A, chairmanMM_B, opening_prayer, tgw_talk, tgw_gems, lc_part1, lc_part2, cbs_conductor, cbs_reader, closing_prayer',
  src: '&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src, ass4_type, ass4_time, ass4_src, ayfCount, weekDate_src, weeklyBibleReading_src, songFirst_src, tgwTalk_src, songMiddle_src, lcCount, lcPart1_src, lcPart2_src, cbs_src, songConclude_src',
});
appDb.version(37).stores({
  src: '&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src, ass4_type, ass4_time, ass4_src, ayfCount, weekDate_src, weeklyBibleReading_src, songFirst_src, tgwTalk_src, songMiddle_src, lcCount, lcPart1_time, lcPart1_src, lcPart2_time, lcPart2_src, cbs_src, songConclude_src',
});
appDb.version(38).stores({
  app_settings:
    '++id, username, cong_number, cong_name, class_count, meeting_day, meeting_time, userPass, isLoggedOut, isScheduleConverted, isCongVerified, isAssignmentsConverted',
});
appDb.version(39).stores({
  app_settings:
    '++id, username, local_uid, cong_number, cong_name, class_count, meeting_day, meeting_time, userPass, isLoggedOut, isScheduleConverted, isCongVerified, isAssignmentsConverted',
});
appDb.version(40).stores({
  ass_type: '&id_type, code, assignable, linkTo, type, ass_type_name',
});
appDb.version(41).stores({
  app_settings:
    '++id, username, local_uid, source_lang, cong_number, cong_name, class_count, meeting_day, meeting_time, userPass, isLoggedOut, isScheduleConverted, isCongVerified, isAssignmentsConverted',
});
appDb.version(42).stores({
  src: '&weekOf, bibleReading_src, bibleReading_study, ass1_type, ass1_study, ass1_time, ass1_src, ass2_type, ass2_study, ass2_time, ass2_src, ass3_type, ass3_study, ass3_time, ass3_src, ass4_type, ass4_study, ass4_time, ass4_src, ayfCount, weekDate_src, weeklyBibleReading_src, songFirst_src, tgwTalk_src, songMiddle_src, lcCount, lcPart1_time, lcPart1_src, lcPart1_content, lcPart2_time, lcPart2_src, lcPart2_content, cbs_src, songConclude_src',
});
appDb.version(43).stores({
  app_settings:
    '++id, username, local_uid, source_lang, cong_number, cong_name, class_count, meeting_day, meeting_time, userPass, isLoggedOut, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated',
});
appDb.version(44).stores({
  app_settings:
    '++id, username, local_uid, source_lang, cong_number, cong_name, class_count, meeting_day, meeting_time, userPass, isLoggedOut, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2',
});
appDb.version(45).stores({
  app_settings:
    '++id, username, local_uid, source_lang, cong_number, cong_name, class_count, meeting_day, meeting_time, userPass, isLoggedOut, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, pocket_members',
});
appDb.version(46).stores({
  persons:
    '++id, person_name, person_displayName, isMale, isFemale, isUnavailable, lastAssignment, person_uid, assignments, timeAway, isMoved, isDisqualified, isChairmanMM, isPrayerMM, isTGWTalk, isTGWGems, isLCPart, isCBSConductor, isCBSReader, changes',
  sched_MM:
    '&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, ass4_stu_A, ass4_ass_A, ass4_stu_B, ass4_ass_B, week_type, noMeeting, isReleased, chairmanMM_A, chairmanMM_B, opening_prayer, tgw_talk, tgw_gems, lc_part1, lc_part2, cbs_conductor, cbs_reader, closing_prayer, changes',
});
appDb.version(47).stores({
  ass_type: null,
  assignment_type: '++id, code, assignable, linkTo, type, assignment_type_name',
});
appDb.version(48).stores({
  assignment_type: null,
  assignment: '&id_type, code, assignable, linkTo, type, assignment_type_name',
});
appDb.version(49).stores({
  deleted: '++id, table, ref, date',
});
appDb.version(50).stores({
  src: '&weekOf, bibleReading_src, bibleReading_study, ass1_type, ass1_study, ass1_time, ass1_src, ass2_type, ass2_study, ass2_time, ass2_src, ass3_type, ass3_study, ass3_time, ass3_src, ass4_type, ass4_study, ass4_time, ass4_src, ayfCount, weekDate_src, weeklyBibleReading_src, songFirst_src, tgwTalk_src, songMiddle_src, lcCount, lcCount_override, lcPart1_time, lcPart1_time_override, lcPart1_src, lcPart1_src_override, lcPart1_content, lcPart2_time, lcPart2_time_override, lcPart2_src, lcPart2_src_override, lcPart2_content, cbs_src, cbs_time_override, songConclude_src',
});
appDb.version(51).stores({
  src: '&weekOf, bibleReading_src, bibleReading_study, ass1_type, ass1_study, ass1_time, ass1_src, ass2_type, ass2_study, ass2_time, ass2_src, ass3_type, ass3_study, ass3_time, ass3_src, ass4_type, ass4_study, ass4_time, ass4_src, ayfCount, weekDate_src, weeklyBibleReading_src, songFirst_src, tgwTalk_src, songMiddle_src, lcCount, lcCount_override, lcPart1_time, lcPart1_time_override, lcPart1_src, lcPart1_src_override, lcPart1_content, lcPart1_content_override, lcPart2_time, lcPart2_time_override, lcPart2_src, lcPart2_src_override, lcPart2_content, lcPart2_content_override, cbs_src, cbs_time_override, songConclude_src',
});
appDb.version(52).stores({
  src: '&weekOf, bibleReading_src, bibleReading_study, ass1_type, ass1_study, ass1_time, ass1_src, ass2_type, ass2_study, ass2_time, ass2_src, ass3_type, ass3_study, ass3_time, ass3_src, ass4_type, ass4_study, ass4_time, ass4_src, ayfCount, weekDate_src, weeklyBibleReading_src, songFirst_src, tgwTalk_src, songMiddle_src, lcCount, lcCount_override, lcPart1_time, lcPart1_time_override, lcPart1_src, lcPart1_src_override, lcPart1_content, lcPart1_content_override, lcPart2_time, lcPart2_time_override, lcPart2_src, lcPart2_src_override, lcPart2_content, lcPart2_content_override, cbs_src, cbs_time_override, songConclude_src, keepOverride',
});
appDb.version(53).stores({
  app_settings:
    '++id, username, local_uid, source_lang, cong_number, cong_name, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, pocket_members, user_avatar',
});
appDb.version(54).stores({
  app_settings:
    '++id, username, local_uid, source_lang, cong_number, cong_name, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, pocket_members, user_avatar, account_version',
});
appDb.version(55).stores({
  week_type: '&id_week_type, week_type_name, sort_index',
});

appDb.on('populate', function () {
  appDb.app_settings.add({
    id: 1,
    cong_number: 0,
    cong_name: '',
    class_count: 1,
    meeting_day: 1,
    source_lang: 'e',
    isScheduleConverted: true,
    isCongVerified: true,
    isAssignmentsConverted: true,
    isCongUpdated2: true,
    pocket_members: [],
    account_version: 'v2',
  });
});

export default appDb;
