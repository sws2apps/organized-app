import Dexie from 'dexie';

let appDb = new Dexie('cpe_sws');
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

appDb.on('populate', function () {
  appDb.app_settings.add({
    id: 1,
    cong_number: 0,
    cong_name: '',
    cong_role: [],
    class_count: 1,
    meeting_day: 1,
    source_lang: 'e',
    isScheduleConverted: true,
    isCongVerified: true,
    isAssignmentsConverted: true,
    isCongUpdated2: true,
    pocket_members: [],
    account_version: 'v2',
    personAssignmentsConverted: true,
    schedule_useFullname: false,
    opening_prayer_autoAssign: false,
  });
});

export default appDb;
