import Dexie from 'dexie';
import { getI18n } from 'react-i18next';
import { langList } from '../locales/langList';

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
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, liveEventClass',
});
appDb.version(4).stores({
	persons:
		'++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment',
});
appDb.version(5).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID, cong_PIN',
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
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID',
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
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted',
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
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted, isCongVerified',
});
appDb.version(16).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, pwd, isScheduleConverted, isCongVerified',
});
appDb.version(17).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userMe, isScheduleConverted, isCongVerified',
});
appDb.version(18).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, crd, isScheduleConverted, isCongVerified',
});
appDb.version(19).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userPass, isScheduleConverted, isCongVerified',
});
appDb.version(20).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userPass, blob_exp, isScheduleConverted, isCongVerified',
});
appDb.version(21).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userPass, isScheduleConverted, isCongVerified',
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

appDb.on('populate', function () {
	appDb.app_settings.add({
		id: 1,
		cong_number: 0,
		cong_name: '',
		class_count: 1,
		meeting_day: 1,
		app_lang: 'e',
	});

	let normWeekObj = {};
	let coWeekObj = {};
	let convWeekObj = {};

	langList.forEach((lang) => {
		normWeekObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.normalWeek'];
		coWeekObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.circuitOverseerWeek'];
		convWeekObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.conventionWeek'];
	});

	appDb.week_type.bulkAdd([
		{
			id_week_type: 1,
			week_type_name: {
				...normWeekObj,
			},
		},
		{
			id_week_type: 2,
			week_type_name: {
				...coWeekObj,
			},
		},
		{
			id_week_type: 3,
			week_type_name: {
				...convWeekObj,
			},
		},
	]);
});

export default appDb;
