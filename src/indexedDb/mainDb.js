import Dexie from "dexie";

var appDb = new Dexie("lmm_oa");
appDb.version(1).stores(
    {
        app_settings: "++id, cong_number, cong_name, class_count, meeting_day",
        ass_type_MG: "&id_type, ass_type_name",
        week_type_MG: "&id_week_type, week_type_name",
        src_MG: "&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src",
        sched_MM: "&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, week_type, noMeeting",
        persons: "++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment"
    }
);
appDb.version(2).stores(
    {
        app_settings: "++id, cong_number, cong_name, class_count, meeting_day, liveEventClass"
    }
);
appDb.version(4).stores(
    {
        persons: "++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment"
    }
);
appDb.version(5).stores(
    {
        app_settings: "++id, cong_number, cong_name, class_count, meeting_day, cong_ID, cong_PIN",
    }
);
appDb.version(6).stores(
    {
        persons: "++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, student_PIN, viewStudent_Part"
    }
);
appDb.version(7).stores(
    {
        persons: "++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, viewOnlineSchedule, student_PIN, viewStudent_Part"
    }
);
appDb.version(8).stores(
    {
        src_MG: "&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src, ass4_type, ass4_time, ass4_src",
        sched_MM: "&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, ass4_stu_A, ass4_ass_A, ass4_stu_B, ass4_ass_B, week_type, noMeeting",
    }
);

appDb.on("populate", function() {
    appDb.app_settings.add({
        id: 1,
        cong_number: 0,
        cong_name: "Fiangonana",
        class_count: 1,
        meeting_day: 1,
    });

    appDb.ass_type_MG.bulkAdd([
        {id_type:1, ass_type_name: "Fitoriana"},
        {id_type:2, ass_type_name: "Fiverenana Mitsidika"},
        {id_type:3, ass_type_name: "Fampianarana Baiboly"},
        {id_type:4, ass_type_name: "Lahateny"},
        {id_type:5, ass_type_name: "Video Fitoriana"},
        {id_type:6, ass_type_name: "Video Fiverenana Mitsidika"},
        {id_type:7, ass_type_name: "Hafa"},
    ]);

    appDb.week_type_MG.bulkAdd([
        {id_week_type:1, week_type_name: "Herinandro Mahazatra"},
        {id_week_type:2, week_type_name: "Fitsidihan’ny Mpiandraikitra ny Faritra"},
        {id_week_type:3, week_type_name: "Herinandron’ny Fivoriambe"},
    ]);
});

export default appDb;