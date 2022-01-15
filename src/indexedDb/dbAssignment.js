import { getI18n } from 'react-i18next';
import { promiseGetRecoil } from 'recoil-outside';
import { dbGetAppSettings } from './dbAppSettings';
import { dbGetStudentDetails } from './dbPersons';
import { dbGetScheduleData } from './dbSchedule';
import { dbGetSourceMaterial, dbGetWeekListBySched } from './dbSourceMaterial';
import appDb from './mainDb';
import { assTypeLocalState } from '../appStates/appSourceMaterial';

const dateFormat = require('dateformat');

const { t } = getI18n();

export const dbGetAssType = async (assType, appLang) => {
	var srcAssType = '';
	if (assType === '') {
		return srcAssType;
	} else {
		var i = parseInt(assType, 10);
		const appData = await appDb.table('ass_type').get(i);
		srcAssType = appData.ass_type_name[appLang];
		return srcAssType;
	}
};

export const dbGetAssTypeId = async (assType, appLang) => {
	var srcAssType = '';
	if (assType === '') {
		return srcAssType;
	} else {
		const appData = await appDb
			.table('ass_type')
			.get({ ass_type_name: assType });
		if (typeof appData === 'undefined') {
			return '';
		} else {
			srcAssType = appData.id_type;
			return srcAssType;
		}
	}
};

export const dbGetListAssType = async () => {
	var assType = [];
	var obj = {};
	const appData = await appDb
		.table('ass_type')
		.reverse()
		.reverse()
		.sortBy('id_type');

	for (let i = 0; i < appData.length; i++) {
		obj = {};
		obj.id_type = appData[i].id_type;
		obj.ass_type_name = appData[i].ass_type_name;
		assType.push(obj);
	}
	return assType;
};

export const dbSaveAss = async (weekOf, stuID, varSave, idAss) => {
	const appData = await appDb.table('sched_MM').get({ weekOf: weekOf });
	const stuPrev = appData[varSave];

	var obj = {};
	obj[varSave] = stuID;

	await appDb.table('sched_MM').update(weekOf, { ...obj });
	await dbRefreshStudentHistory(stuPrev, stuID, idAss);
};

export const dbHistoryAssignment = async () => {
	const appData = await appDb.table('sched_MM').toArray();
	var dbHistory = [];
	var histID = 0;
	for (let i = 0; i < appData.length; i++) {
		var person = {};

		const weekData = await dbGetSourceMaterial(appData[i].weekOf);
		var dateFormat = require('dateformat');
		const [varMonth, varDay, varYear] = appData[i].weekOf.split('/');
		const lDate = new Date(varYear, varMonth - 1, varDay);
		const dateFormatted = dateFormat(lDate, 'dd/mm/yyyy');
		const cnAss = [{ iAss: 1 }, { iAss: 2 }, { iAss: 3 }, { iAss: 4 }];
		const varClasses = [{ classLabel: 'A' }, { classLabel: 'B' }];

		//Bible Reading History
		for (let a = 0; a < varClasses.length; a++) {
			const fldName = 'bRead_stu_' + varClasses[a].classLabel;
			if (typeof appData[i][fldName] !== 'undefined') {
				person.ID = histID;
				person.weekOf = appData[i].weekOf;
				person.weekOfFormatted = dateFormatted;
				person.studentID = appData[i][fldName];
				const stuDetails = await dbGetStudentDetails(person.studentID);
				person.studentName = stuDetails.person_displayName;
				person.assignmentID = 0;
				person.assignmentName = 'Famakiana Baiboly';
				person.class = varClasses[a].classLabel;
				dbHistory.push(person);
				person = {};
				histID++;
			}
		}

		//AYF Assigment History
		for (let b = 0; b < cnAss.length; b++) {
			var weekFld = 'ass' + cnAss[b].iAss + '_type';
			const assType = weekData[weekFld];

			for (let a = 0; a < varClasses.length; a++) {
				var fldName =
					'ass' + cnAss[b].iAss + '_stu_' + varClasses[a].classLabel;
				if (typeof appData[i][fldName] !== 'undefined') {
					person.ID = histID;
					person.weekOf = appData[i].weekOf;
					person.weekOfFormatted = dateFormatted;
					person.studentID = appData[i][fldName];
					const stuDetails = await dbGetStudentDetails(person.studentID);
					person.studentName = stuDetails.person_displayName;
					person.assignmentID = assType;
					if (assType === 1) {
						person.assignmentName = 'Fitoriana';
					} else if (assType === 2) {
						person.assignmentName = 'Fiverenana Mitsidika';
					} else if (assType === 3) {
						person.assignmentName = 'Fampianarana Baiboly';
					} else if (assType === 4) {
						person.assignmentName = 'Lahateny';
					}
					person.class = varClasses[a].classLabel;
					dbHistory.push(person);
					person = {};
					histID++;
				}

				fldName = 'ass' + cnAss[b].iAss + '_ass_' + varClasses[a].classLabel;
				if (typeof appData[i][fldName] !== 'undefined') {
					person.ID = histID;
					person.weekOf = appData[i].weekOf;
					person.weekOfFormatted = dateFormatted;
					person.studentID = appData[i][fldName];
					const stuDetails = await dbGetStudentDetails(person.studentID);
					person.studentName = stuDetails.person_displayName;
					person.assignmentID = 8;
					person.assignmentName = 'Mpanampy';
					person.class = varClasses[a].classLabel;
					dbHistory.push(person);
					person = {};
					histID++;
				}
			}
		}
	}
	dbHistory.sort((a, b) => {
		var dateA =
			a.weekOf.split('/')[2] +
			'/' +
			a.weekOf.split('/')[0] +
			'/' +
			a.weekOf.split('/')[1];
		var dateB =
			b.weekOf.split('/')[2] +
			'/' +
			b.weekOf.split('/')[0] +
			'/' +
			b.weekOf.split('/')[1];
		return dateA < dateB ? 1 : -1;
	});
	return dbHistory;
};

export const dbLastBRead = async (stuID) => {
	stuID = parseInt(stuID, 10);
	const appData = await dbHistoryAssignment();
	const lastBRead = appData.filter(
		(data) => (data.assignmentID === 0) & (data.studentID === stuID)
	);

	var dLast;
	if (lastBRead.length > 0) {
		dLast = lastBRead[0].weekOf;
	}
	return dLast;
};

export const dbLastIniCall = async (stuID) => {
	stuID = parseInt(stuID, 10);
	const appData = await dbHistoryAssignment();
	const lastIniCall = appData.filter(
		(data) => (data.assignmentID === 1) & (data.studentID === stuID)
	);

	var dLast;
	if (lastIniCall.length > 0) {
		dLast = lastIniCall[0].weekOf;
	}
	return dLast;
};

export const dbLastRV = async (stuID) => {
	stuID = parseInt(stuID, 10);
	const appData = await dbHistoryAssignment();
	const lastRV = appData.filter(
		(data) => (data.assignmentID === 2) & (data.studentID === stuID)
	);

	var dLast;
	if (lastRV.length > 0) {
		dLast = lastRV[0].weekOf;
	}
	return dLast;
};

export const dbLastBibleStudy = async (stuID) => {
	stuID = parseInt(stuID, 10);
	const appData = await dbHistoryAssignment();
	const lastBibleStudy = appData.filter(
		(data) => (data.assignmentID === 3) & (data.studentID === stuID)
	);

	var dLast;
	if (lastBibleStudy.length > 0) {
		dLast = lastBibleStudy[0].weekOf;
	}
	return dLast;
};

export const dbLastTalk = async (stuID) => {
	stuID = parseInt(stuID, 10);
	const appData = await dbHistoryAssignment();
	const lastTalk = appData.filter(
		(data) => (data.assignmentID === 4) & (data.studentID === stuID)
	);

	var dLast;
	if (lastTalk.length > 0) {
		dLast = lastTalk[0].weekOf;
	}
	return dLast;
};

export const dbLastAssistant = async (stuID) => {
	stuID = parseInt(stuID, 10);
	const appData = await dbHistoryAssignment();
	const lastAssistant = appData.filter(
		(data) => (data.assignmentID === 8) & (data.studentID === stuID)
	);
	var dLast;
	if (lastAssistant.length > 0) {
		dLast = lastAssistant[0].weekOf;
	}
	return dLast;
};

export const dbLastAssignment = async (stuID) => {
	stuID = parseInt(stuID, 10);
	const appData = await dbHistoryAssignment();
	const lastAssignment = appData.filter((data) => data.studentID === stuID);
	var dLast;
	if (lastAssignment.length > 0) {
		dLast = lastAssignment[0].weekOf;
	}
	return dLast;
};

export const dbRefreshStudentHistory = async (varPrev, varNew, varAss) => {
	let varPers;
	for (let a = 1; a <= 2; a++) {
		if (a === 1) {
			varPers = varPrev;
		} else {
			varPers = varNew;
		}

		if ((typeof varPers !== 'undefined') & (varPers !== '')) {
			const stuBRead = await dbLastBRead(varPers);
			const stuIniCall = await dbLastIniCall(varPers);
			const stuRV = await dbLastRV(varPers);
			const stuBS = await dbLastBibleStudy(varPers);
			const stuAssistant = await dbLastAssistant(varPers);
			const stuTalk = await dbLastTalk(varPers);
			const stuAssignment = await dbLastAssignment(varPers);

			var fldToUpdate;
			var newValue;

			if (varAss === 0) {
				fldToUpdate = 'lastBRead';
				newValue = stuBRead;
			} else if (varAss === 1) {
				fldToUpdate = 'lastInitialCall';
				newValue = stuIniCall;
			} else if (varAss === 2) {
				fldToUpdate = 'lastReturnVisit';
				newValue = stuRV;
			} else if (varAss === 3) {
				fldToUpdate = 'lastBibleStudy';
				newValue = stuBS;
			} else if (varAss === 4) {
				fldToUpdate = 'lastTalk';
				newValue = stuTalk;
			} else if (varAss === 8) {
				fldToUpdate = 'lastAssistant';
				newValue = stuAssistant;
			}

			const idPers = parseInt(varPers, 10);
			var obj = {};
			obj[fldToUpdate] = newValue;
			obj.lastAssignment = stuAssignment;
			await appDb.table('persons').update(idPers, { ...obj });
		}
	}
};

export const dbGetS89WeekList = async (scheduleName) => {
	var s89Data = [];
	const allWeeks = await dbGetWeekListBySched(scheduleName);
	for (let i = 0; i < allWeeks.length; i++) {
		const week = allWeeks[i].value;
		const scheduleData = await dbGetScheduleData(week);
		if (!scheduleData.noMeeting) {
			var parentWeek = {};
			parentWeek.value = week;
			const dateW = new Date(week);
			const weekDateFormatted = dateFormat(dateW, t('global.shortDateFormat'));
			parentWeek.label = weekDateFormatted;
			parentWeek.children = [];

			const sourceData = await dbGetSourceMaterial(week);

			if (scheduleData.bRead_stu_A !== '' || scheduleData.bRead_stu_B !== '') {
				var assType = {};
				assType.label = t('global.bibleReading');
				assType.value = week + '-0@bRead-A';
				if (
					scheduleData.bRead_stu_A !== '' &&
					scheduleData.bRead_stu_B !== ''
				) {
					assType.children = [];
					var assClass = {};
					assClass.value = week + '-0@bRead-A';
					assClass.label = t('global.mainHall');
					assType.children.push(assClass);
					assClass.value = week + '-0@bRead-B';
					assClass.label = t('global.auxClass1');
					assType.children.push(assClass);
				}
				parentWeek.children.push(assType);
			}

			const assTypeList = await promiseGetRecoil(assTypeLocalState);
			for (let i = 1; i <= 4; i++) {
				const fldStuA = 'ass' + i + '_stu_A';
				const fldStuB = 'ass' + i + '_stu_B';
				const fldAss = 'ass' + i + '_type';
				if (
					scheduleData[fldStuA] !== undefined ||
					scheduleData[fldStuB] !== undefined
				) {
					if (scheduleData[fldStuA] !== '' || scheduleData[fldStuB] !== '') {
						assType = {};
						let indexType;
						indexType = assTypeList.findIndex(
							(type) => type.value === sourceData[fldAss]
						);
						assType.label = indexType >= 0 ? assTypeList[indexType].label : '';
						assType.value = week + '-' + i + '@ass' + i + '-A';
						if (scheduleData[fldStuA] !== '' && scheduleData[fldStuB] !== '') {
							assType.children = [];
							assClass = {};
							assClass.value = week + '-' + i + '@ass' + i + '-A';
							assClass.label = t('global.mainHall');
							assType.children.push(assClass);
							assClass.value = week + '-' + i + '@ass' + i + '-B';
							assClass.label = t('global.auxClass1');
							assType.children.push(assClass);
						}
						parentWeek.children.push(assType);
					}
				}
			}
			if (parentWeek.children.length > 0) {
				s89Data.push(parentWeek);
			}
		}
	}
	var obj = {};
	obj.value = 'S89';
	obj.label = t('global.allWeeks');
	obj.children = s89Data;
	return obj;
};

export const dbGetS89ItemData = async (week, assName, classLabel) => {
	var stuFld = '';
	var assFld = '';
	var assTimeFld = '';
	var assTypeFld = 0;

	if (assName === 'bRead') {
		stuFld = 'bRead_stu_' + classLabel;
	} else if (assName === 'ass1') {
		stuFld = 'ass1_stu_' + classLabel;
		assFld = 'ass1_ass_' + classLabel;
		assTypeFld = 'ass1_type';
		assTimeFld = 'ass1_time';
	} else if (assName === 'ass2') {
		stuFld = 'ass2_stu_' + classLabel;
		assFld = 'ass2_ass_' + classLabel;
		assTypeFld = 'ass2_type';
		assTimeFld = 'ass2_time';
	} else if (assName === 'ass3') {
		stuFld = 'ass3_stu_' + classLabel;
		assFld = 'ass3_ass_' + classLabel;
		assTypeFld = 'ass3_type';
		assTimeFld = 'ass3_time';
	} else if (assName === 'ass4') {
		stuFld = 'ass4_stu_' + classLabel;
		assFld = 'ass4_ass_' + classLabel;
		assTypeFld = 'ass4_type';
		assTimeFld = 'ass4_time';
	}

	const appSettings = await dbGetAppSettings();
	var midDay = parseInt(appSettings.meeting_day, 10);

	const [varMonth, varDay, varYear] = week.split('/');
	midDay = parseInt(varDay, 10) + midDay - 1;
	const lDate = new Date(varYear, varMonth - 1, midDay);
	const dateFormatted = dateFormat(lDate, t('global.shortDateFormat'));

	const sourceData = await dbGetSourceMaterial(week);
	const scheduleData = await dbGetScheduleData(week);

	var s89Data = {};
	const stuID = scheduleData[stuFld];
	const { person_name } = await dbGetStudentDetails(stuID);
	s89Data.studentName = person_name;
	s89Data.assistantName = '';
	s89Data.isBRead = false;
	s89Data.isInitialCall = false;
	s89Data.initialCallSpec = '';
	s89Data.isReturnVisit = false;
	s89Data.returnVisitSpec = '';
	s89Data.isBibleStudy = false;
	s89Data.bibleStudySpec = '';
	s89Data.isTalk = false;
	s89Data.assignmentDate = dateFormatted;

	if (
		assName === 'ass1' ||
		assName === 'ass2' ||
		assName === 'ass3' ||
		assName === 'ass4'
	) {
		const assType = sourceData[assTypeFld];
		if (assType === 1 || assType === 2 || assType === 3) {
			const assID = scheduleData[assFld];
			if (typeof assID !== 'undefined' && assID !== '') {
				const assInfo = await dbGetStudentDetails(assID);
				s89Data.assistantName = assInfo.person_name;
			}
		}

		const ass1Type = sourceData['ass1_type'];
		const ass2Type = sourceData['ass2_type'];
		const ass3Type = sourceData['ass3_type'];
		const ass4Type = sourceData['ass4_type'];
		const assTime = sourceData[assTimeFld];

		if (assType === 1) {
			s89Data.isInitialCall = true;
			if (assName === 'ass1') {
				if (
					ass1Type === ass2Type ||
					ass1Type === ass3Type ||
					ass1Type === ass4Type
				) {
					s89Data.initialCallSpec = t('schedule.assignmentPart', {
						id: 1,
						time: assTime,
					});
				}
			} else if (assName === 'ass2') {
				if (
					ass2Type === ass1Type ||
					ass2Type === ass3Type ||
					ass2Type === ass4Type
				) {
					s89Data.initialCallSpec = t('schedule.assignmentPart', {
						id: 2,
						time: assTime,
					});
				}
			} else if (assName === 'ass3') {
				if (
					ass3Type === ass1Type ||
					ass3Type === ass2Type ||
					ass3Type === ass4Type
				) {
					s89Data.initialCallSpec = t('schedule.assignmentPart', {
						id: 3,
						time: assTime,
					});
				}
			} else if (assName === 'ass4') {
				if (
					ass4Type === ass1Type ||
					ass4Type === ass2Type ||
					ass4Type === ass3Type
				) {
					s89Data.initialCallSpec = t('schedule.assignmentPart', {
						id: 4,
						time: assTime,
					});
				}
			}
		} else if (assType === 2) {
			s89Data.isReturnVisit = true;
			if (assName === 'ass1') {
				if (
					ass1Type === ass2Type ||
					ass1Type === ass3Type ||
					ass1Type === ass4Type
				) {
					s89Data.returnVisitSpec = t('schedule.assignmentPart', {
						id: 1,
						time: assTime,
					});
				}
			} else if (assName === 'ass2') {
				if (
					ass2Type === ass1Type ||
					ass2Type === ass3Type ||
					ass2Type === ass4Type
				) {
					s89Data.returnVisitSpec = t('schedule.assignmentPart', {
						id: 2,
						time: assTime,
					});
				}
			} else if (assName === 'ass3') {
				if (
					ass3Type === ass1Type ||
					ass3Type === ass2Type ||
					ass3Type === ass4Type
				) {
					s89Data.returnVisitSpec = t('schedule.assignmentPart', {
						id: 3,
						time: assTime,
					});
				}
			} else if (assName === 'ass4') {
				if (
					ass4Type === ass1Type ||
					ass4Type === ass2Type ||
					ass4Type === ass3Type
				) {
					s89Data.returnVisitSpec = t('schedule.assignmentPart', {
						id: 4,
						time: assTime,
					});
				}
			}
		} else if (assType === 3) {
			s89Data.isBibleStudy = true;
		} else if (assType === 4) {
			s89Data.isTalk = true;
		}
	} else {
		s89Data.isBRead = true;
	}

	if (classLabel === 'A') {
		s89Data.isMainHall = true;
		s89Data.isAuxClass = false;
	} else {
		s89Data.isMainHall = false;
		s89Data.isAuxClass = true;
	}

	return s89Data;
};

export const dbGetScheduleForPrint = async (scheduleName) => {
	var data = [];
	const allWeeks = await dbGetWeekListBySched(scheduleName);
	for (let i = 0; i < allWeeks.length; i++) {
		const week = allWeeks[i].value;
		const scheduleData = await dbGetScheduleData(week);
		const sourceData = await dbGetSourceMaterial(week);
		var obj = {};
		obj.week = week;
		obj.scheduleData = scheduleData;
		obj.sourceData = sourceData;
		data.push(obj);
	}
	return data;
};
