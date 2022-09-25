import { dbGetAppSettings } from './dbAppSettings';
import { dbSaveAss } from './dbAssignment';
import { dbGetPersonsByAssType, dbGetStudentByUid } from './dbPersons';
import {
	dbGetSourceMaterial,
	dbGetSourceMaterialPocket,
	dbGetWeekListBySched,
	dbGetWeekTypeName,
	dbGetWeekTypeNamePocket,
} from './dbSourceMaterial';
import appDb from './mainDb';

export const dbGetScheduleData = async (weekValue) => {
	const appData = await appDb.table('sched_MM').get({ weekOf: weekValue });
	var schedule = {};
	var student = {};
	schedule.weekOf = appData.weekOf;
	if (typeof appData.bRead_stu_A === 'undefined') {
		schedule.bRead_stu_A = '';
		schedule.bRead_stu_A_dispName = '';
	} else {
		schedule.bRead_stu_A = appData.bRead_stu_A;
		student = await dbGetStudentByUid(schedule.bRead_stu_A);
		schedule.bRead_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.bRead_stu_B === 'undefined') {
		schedule.bRead_stu_B = '';
		schedule.bRead_stu_B_dispName = '';
	} else {
		schedule.bRead_stu_B = appData.bRead_stu_B;
		student = await dbGetStudentByUid(schedule.bRead_stu_B);
		schedule.bRead_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_stu_A === 'undefined') {
		schedule.ass1_stu_A = '';
		schedule.ass1_stu_A_dispName = '';
	} else {
		schedule.ass1_stu_A = appData.ass1_stu_A;
		student = await dbGetStudentByUid(schedule.ass1_stu_A);
		schedule.ass1_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_ass_A === 'undefined') {
		schedule.ass1_ass_A = '';
		schedule.ass1_ass_A_dispName = '';
	} else {
		schedule.ass1_ass_A = appData.ass1_ass_A;
		student = await dbGetStudentByUid(schedule.ass1_ass_A);
		schedule.ass1_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_stu_B === 'undefined') {
		schedule.ass1_stu_B = '';
		schedule.ass1_stu_B_dispName = '';
	} else {
		schedule.ass1_stu_B = appData.ass1_stu_B;
		student = await dbGetStudentByUid(schedule.ass1_stu_B);
		schedule.ass1_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_ass_B === 'undefined') {
		schedule.ass1_ass_B = '';
		schedule.ass1_ass_B_dispName = '';
	} else {
		schedule.ass1_ass_B = appData.ass1_ass_B;
		student = await dbGetStudentByUid(schedule.ass1_ass_B);
		schedule.ass1_ass_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_stu_A === 'undefined') {
		schedule.ass2_stu_A = '';
		schedule.ass2_stu_A_dispName = '';
	} else {
		schedule.ass2_stu_A = appData.ass2_stu_A;
		student = await dbGetStudentByUid(schedule.ass2_stu_A);
		schedule.ass2_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_ass_A === 'undefined') {
		schedule.ass2_ass_A = '';
		schedule.ass2_ass_A_dispName = '';
	} else {
		schedule.ass2_ass_A = appData.ass2_ass_A;
		student = await dbGetStudentByUid(schedule.ass2_ass_A);
		schedule.ass2_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_stu_B === 'undefined') {
		schedule.ass2_stu_B = '';
		schedule.ass2_stu_B_dispName = '';
	} else {
		schedule.ass2_stu_B = appData.ass2_stu_B;
		student = await dbGetStudentByUid(schedule.ass2_stu_B);
		schedule.ass2_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_ass_B === 'undefined') {
		schedule.ass2_ass_B = '';
		schedule.ass2_ass_B_dispName = '';
	} else {
		schedule.ass2_ass_B = appData.ass2_ass_B;
		student = await dbGetStudentByUid(schedule.ass2_ass_B);
		schedule.ass2_ass_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_stu_A === 'undefined') {
		schedule.ass3_stu_A = '';
		schedule.ass3_stu_A_dispName = '';
	} else {
		schedule.ass3_stu_A = appData.ass3_stu_A;
		student = await dbGetStudentByUid(schedule.ass3_stu_A);
		schedule.ass3_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_ass_A === 'undefined') {
		schedule.ass3_ass_A = '';
		schedule.ass3_ass_A_dispName = '';
	} else {
		schedule.ass3_ass_A = appData.ass3_ass_A;
		student = await dbGetStudentByUid(schedule.ass3_ass_A);
		schedule.ass3_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_stu_B === 'undefined') {
		schedule.ass3_stu_B = '';
		schedule.ass3_stu_B_dispName = '';
	} else {
		schedule.ass3_stu_B = appData.ass3_stu_B;
		student = await dbGetStudentByUid(schedule.ass3_stu_B);
		schedule.ass3_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_ass_B === 'undefined') {
		schedule.ass3_ass_B = '';
		schedule.ass3_ass_B_dispName = '';
	} else {
		schedule.ass3_ass_B = appData.ass3_ass_B;
		student = await dbGetStudentByUid(schedule.ass3_ass_B);
		schedule.ass3_ass_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_stu_A === 'undefined') {
		schedule.ass4_stu_A = '';
		schedule.ass4_stu_A_dispName = '';
	} else {
		schedule.ass4_stu_A = appData.ass4_stu_A;
		student = await dbGetStudentByUid(schedule.ass4_stu_A);
		schedule.ass4_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_ass_A === 'undefined') {
		schedule.ass4_ass_A = '';
		schedule.ass4_ass_A_dispName = '';
	} else {
		schedule.ass4_ass_A = appData.ass4_ass_A;
		student = await dbGetStudentByUid(schedule.ass4_ass_A);
		schedule.ass4_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_stu_B === 'undefined') {
		schedule.ass4_stu_B = '';
		schedule.ass4_stu_B_dispName = '';
	} else {
		schedule.ass4_stu_B = appData.ass4_stu_B;
		student = await dbGetStudentByUid(schedule.ass4_stu_B);
		schedule.ass4_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_ass_B === 'undefined') {
		schedule.ass4_ass_B = '';
		schedule.ass4_ass_B_dispName = '';
	} else {
		schedule.ass4_ass_B = appData.ass4_ass_B;
		student = await dbGetStudentByUid(schedule.ass4_ass_B);
		schedule.ass4_ass_B_dispName = student.person_displayName;
	}
	schedule.week_type = parseInt(appData.week_type, 10) || 1;

	schedule.week_type_name = await dbGetWeekTypeName(schedule.week_type);
	schedule.noMeeting = appData.noMeeting || false;
	return schedule;
};

export const dbGetScheduleDataPocket = async (weekValue) => {
	const appData = await appDb.table('sched_MM').get({ weekOf: weekValue });
	var schedule = {};
	var student = {};
	schedule.weekOf = appData.weekOf;
	if (typeof appData.bRead_stu_A === 'undefined') {
		schedule.bRead_stu_A = '';
		schedule.bRead_stu_A_dispName = '';
	} else {
		schedule.bRead_stu_A = appData.bRead_stu_A;
		student = await dbGetStudentByUid(schedule.bRead_stu_A);
		schedule.bRead_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.bRead_stu_B === 'undefined') {
		schedule.bRead_stu_B = '';
		schedule.bRead_stu_B_dispName = '';
	} else {
		schedule.bRead_stu_B = appData.bRead_stu_B;
		student = await dbGetStudentByUid(schedule.bRead_stu_B);
		schedule.bRead_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_stu_A === 'undefined') {
		schedule.ass1_stu_A = '';
		schedule.ass1_stu_A_dispName = '';
	} else {
		schedule.ass1_stu_A = appData.ass1_stu_A;
		student = await dbGetStudentByUid(schedule.ass1_stu_A);
		schedule.ass1_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_ass_A === 'undefined') {
		schedule.ass1_ass_A = '';
		schedule.ass1_ass_A_dispName = '';
	} else {
		schedule.ass1_ass_A = appData.ass1_ass_A;
		student = await dbGetStudentByUid(schedule.ass1_ass_A);
		schedule.ass1_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_stu_B === 'undefined') {
		schedule.ass1_stu_B = '';
		schedule.ass1_stu_B_dispName = '';
	} else {
		schedule.ass1_stu_B = appData.ass1_stu_B;
		student = await dbGetStudentByUid(schedule.ass1_stu_B);
		schedule.ass1_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_ass_B === 'undefined') {
		schedule.ass1_ass_B = '';
		schedule.ass1_ass_B_dispName = '';
	} else {
		schedule.ass1_ass_B = appData.ass1_ass_B;
		student = await dbGetStudentByUid(schedule.ass1_ass_B);
		schedule.ass1_ass_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_stu_A === 'undefined') {
		schedule.ass2_stu_A = '';
		schedule.ass2_stu_A_dispName = '';
	} else {
		schedule.ass2_stu_A = appData.ass2_stu_A;
		student = await dbGetStudentByUid(schedule.ass2_stu_A);
		schedule.ass2_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_ass_A === 'undefined') {
		schedule.ass2_ass_A = '';
		schedule.ass2_ass_A_dispName = '';
	} else {
		schedule.ass2_ass_A = appData.ass2_ass_A;
		student = await dbGetStudentByUid(schedule.ass2_ass_A);
		schedule.ass2_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_stu_B === 'undefined') {
		schedule.ass2_stu_B = '';
		schedule.ass2_stu_B_dispName = '';
	} else {
		schedule.ass2_stu_B = appData.ass2_stu_B;
		student = await dbGetStudentByUid(schedule.ass2_stu_B);
		schedule.ass2_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_ass_B === 'undefined') {
		schedule.ass2_ass_B = '';
		schedule.ass2_ass_B_dispName = '';
	} else {
		schedule.ass2_ass_B = appData.ass2_ass_B;
		student = await dbGetStudentByUid(schedule.ass2_ass_B);
		schedule.ass2_ass_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_stu_A === 'undefined') {
		schedule.ass3_stu_A = '';
		schedule.ass3_stu_A_dispName = '';
	} else {
		schedule.ass3_stu_A = appData.ass3_stu_A;
		student = await dbGetStudentByUid(schedule.ass3_stu_A);
		schedule.ass3_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_ass_A === 'undefined') {
		schedule.ass3_ass_A = '';
		schedule.ass3_ass_A_dispName = '';
	} else {
		schedule.ass3_ass_A = appData.ass3_ass_A;
		student = await dbGetStudentByUid(schedule.ass3_ass_A);
		schedule.ass3_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_stu_B === 'undefined') {
		schedule.ass3_stu_B = '';
		schedule.ass3_stu_B_dispName = '';
	} else {
		schedule.ass3_stu_B = appData.ass3_stu_B;
		student = await dbGetStudentByUid(schedule.ass3_stu_B);
		schedule.ass3_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_ass_B === 'undefined') {
		schedule.ass3_ass_B = '';
		schedule.ass3_ass_B_dispName = '';
	} else {
		schedule.ass3_ass_B = appData.ass3_ass_B;
		student = await dbGetStudentByUid(schedule.ass3_ass_B);
		schedule.ass3_ass_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_stu_A === 'undefined') {
		schedule.ass4_stu_A = '';
		schedule.ass4_stu_A_dispName = '';
	} else {
		schedule.ass4_stu_A = appData.ass4_stu_A;
		student = await dbGetStudentByUid(schedule.ass4_stu_A);
		schedule.ass4_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_ass_A === 'undefined') {
		schedule.ass4_ass_A = '';
		schedule.ass4_ass_A_dispName = '';
	} else {
		schedule.ass4_ass_A = appData.ass4_ass_A;
		student = await dbGetStudentByUid(schedule.ass4_ass_A);
		schedule.ass4_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_stu_B === 'undefined') {
		schedule.ass4_stu_B = '';
		schedule.ass4_stu_B_dispName = '';
	} else {
		schedule.ass4_stu_B = appData.ass4_stu_B;
		student = await dbGetStudentByUid(schedule.ass4_stu_B);
		schedule.ass4_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_ass_B === 'undefined') {
		schedule.ass4_ass_B = '';
		schedule.ass4_ass_B_dispName = '';
	} else {
		schedule.ass4_ass_B = appData.ass4_ass_B;
		student = await dbGetStudentByUid(schedule.ass4_ass_B);
		schedule.ass4_ass_B_dispName = student.person_displayName;
	}
	schedule.week_type = parseInt(appData.week_type, 10) || 1;

	schedule.week_type_name = await dbGetWeekTypeNamePocket(schedule.week_type);
	schedule.noMeeting = appData.noMeeting || false;
	return schedule;
};

export const dbAutoFill = async (schedule) => {
	const allWeeks = await dbGetWeekListBySched(schedule);
	const settings = await dbGetAppSettings();

	for (let i = 0; i < allWeeks.length; i++) {
		const weekValue = allWeeks[i].value;
		const scheduleData = await dbGetScheduleData(weekValue);
		const sourceData = await dbGetSourceMaterial(weekValue);

		if (scheduleData.noMeeting === false) {
			//Assign Bible Reading A
			var students = [];
			students = await dbGetPersonsByAssType(100);
			if (students.length > 0) {
				const stuBReadA = students[0].person_uid;
				await dbSaveAss(weekValue, stuBReadA, 'bRead_stu_A');
			}

			//Assign Bible Reading B
			if (settings.class_count === 2 && scheduleData.week_type === 1) {
				students = await dbGetPersonsByAssType(100);
				if (students.length > 0) {
					const stuBReadB = students[0].person_uid;
					await dbSaveAss(weekValue, stuBReadB, 'bRead_stu_B');
				}
			}

			//Assign AYF Main Student
			let fldName = '';
			let fldType = '';

			for (let a = 1; a <= 3; a++) {
				fldType = 'ass' + a + '_type';
				const assType = sourceData[fldType];

				//Assign AYF A
				fldName = 'ass' + a + '_stu_A';
				students = await dbGetPersonsByAssType(assType);
				if (
					assType === 101 ||
					assType === 102 ||
					assType === 103 ||
					assType === 104 ||
					assType === 108
				) {
					if (students.length > 0) {
						const stuA = students[0].person_uid;
						await dbSaveAss(weekValue, stuA, fldName);
					}
				}

				//Assign AYF B
				if (settings.class_count === 2 && scheduleData.week_type === 1) {
					fldName = 'ass' + a + '_stu_B';
					students = await dbGetPersonsByAssType(assType);
					if (
						assType === 101 ||
						assType === 102 ||
						assType === 103 ||
						assType === 104 ||
						assType === 108
					) {
						if (students.length > 0) {
							const stuB = students[0].person_uid;
							await dbSaveAss(weekValue, stuB, fldName);
						}
					}
				}
			}

			//Assign AYF Assistant
			for (let a = 1; a <= 3; a++) {
				fldType = 'ass' + a + '_type';
				const assType = sourceData[fldType];

				//Assign AYF A Assistant
				if (
					assType === 101 ||
					assType === 102 ||
					assType === 103 ||
					assType === 108
				) {
					fldName = 'ass' + a + '_ass_A';
					students = await dbGetPersonsByAssType('isAssistant');
					if (students.length > 0) {
						const assA = students[0].person_uid;
						await dbSaveAss(weekValue, assA, fldName);
					}
				}

				//Assign AYF B Assistant
				if (settings.class_count === 2 && scheduleData.week_type === 1) {
					if (
						assType === 101 ||
						assType === 102 ||
						assType === 103 ||
						assType === 108
					) {
						fldName = 'ass' + a + '_ass_B';
						students = await dbGetPersonsByAssType('isAssistant');
						if (students.length > 0) {
							const assB = students[0].person_uid;
							await dbSaveAss(weekValue, assB, fldName);
						}
					}
				}
			}
		}
	}
};

export const dbDeleteWeekAssignment = async (weekValue) => {
	//Delete Bible Reading A
	await dbSaveAss(weekValue, undefined, 'bRead_stu_A');

	//Delete Bible Reading B
	await dbSaveAss(weekValue, undefined, 'bRead_stu_B');

	//Delete AYF
	for (let a = 1; a <= 3; a++) {
		var fldName = '';

		//Delete AYF A
		fldName = 'ass' + a + '_stu_A';
		await dbSaveAss(weekValue, undefined, fldName);

		//Delete AYF A Assistant
		fldName = 'ass' + a + '_ass_A';
		await dbSaveAss(weekValue, undefined, fldName);

		//Delete AYF B
		fldName = 'ass' + a + '_stu_B';
		await dbSaveAss(weekValue, undefined, fldName);

		//Delete AYF B Assistant
		fldName = 'ass' + a + '_ass_B';
		await dbSaveAss(weekValue, undefined, fldName);
	}
};

export const dbBuildScheduleForShare = async (scheduleIndex) => {
	// get current schedule id
	const month = +scheduleIndex.split('/')[0];
	const year = +scheduleIndex.split('/')[1];

	let id;
	const schedule = await appDb.sws_pocket
		.where('[month+year]')
		.equals([month, year])
		.first();

	if (schedule) {
		id = schedule.id;
	} else {
		id = window.crypto.randomUUID();
		await appDb.sws_pocket.add({
			id: id,
			month: month,
			year: year,
		});
	}

	let objSchedule = [];
	let objSource = [];

	const getWeeks = await dbGetWeekListBySched(scheduleIndex);
	for (let i = 0; i < getWeeks.length; i++) {
		const weekValue = getWeeks[i].value;
		const schedData = await dbGetScheduleDataPocket(weekValue);
		const sourceData = await dbGetSourceMaterialPocket(weekValue);
		objSchedule.push({ ...schedData });
		objSource.push({ ...sourceData });
	}

	const dataPocket = {
		cong_schedule: {
			schedules: objSchedule,
			month: month,
			year: year,
			id: id,
		},
		cong_sourceMaterial: {
			sources: objSource,
			id: id,
		},
	};

	return dataPocket;
};

export const dbSaveScheduleByAss = async (field, value, weekOf) => {
	var obj = {};
	obj[field] = value;

	await appDb.table('sched_MM').update(weekOf, { ...obj });
};
