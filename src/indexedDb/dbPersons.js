import { dbGetAppSettings } from './dbAppSettings';
import { dbGetSourceMaterial } from './dbSourceMaterial';
import { getI18n } from 'react-i18next';
import appDb from './mainDb';

const dateFormat = require('dateformat');

const { t } = getI18n();

export const dbGetStudents = async () => {
	var appData = [];
	var allStudents = [];

	appData = await appDb
		.table('persons')
		.reverse()
		.reverse()
		.sortBy('person_name');

	for (let i = 0; i < appData.length; i++) {
		var person = {};
		person.source = 'lmm_oa';
		person.id = appData[i].id;
		person.person_name = appData[i].person_name;
		person.person_displayName = appData[i].person_displayName;
		person.isMale = appData[i].isMale;
		person.isFemale = appData[i].isFemale;
		person.isBRead = appData[i].isBRead;
		person.isInitialCall = appData[i].isInitialCall;
		person.isReturnVisit = appData[i].isReturnVisit;
		person.isBibleStudy = appData[i].isBibleStudy;
		person.isTalk = appData[i].isTalk;
		person.isUnavailable = appData[i].isUnavailable;
		person.forLivePart = appData[i].forLivePart;
		person.viewOnlineSchedule = appData[i].viewOnlineSchedule || false;
		person.student_PIN = appData[i].student_PIN || '';
		person.viewStudent_Part = appData[i].viewStudent_Part || [];
		person.lastBRead = appData[i].lastBRead || '';
		person.lastInitialCall = appData[i].lastInitialCall || '';
		person.lastReturnVisit = appData[i].lastReturnVisit || '';
		person.lastBibleStudy = appData[i].lastBibleStudy || '';
		person.lastTalk = appData[i].lastTalk || '';

		allStudents.push(person);
	}
	return allStudents;
};

export const dbIsStudentExist = async (varName) => {
	var isExist = false;
	const appData = await appDb.table('persons').get({ person_name: varName });
	if (typeof appData !== 'undefined') {
		isExist = true;
	}
	return isExist;
};

export const dbSavePersonData = async (personData) => {
	await appDb.table('persons').put(
		{
			id: personData.id,
			person_name: personData.person_name,
			person_displayName: personData.person_displayName,
			isMale: personData.isMale,
			isFemale: personData.isFemale,
			isBRead: personData.isBRead,
			isInitialCall: personData.isInitialCall,
			isReturnVisit: personData.isReturnVisit,
			isBibleStudy: personData.isBibleStudy,
			isTalk: personData.isTalk,
			isUnavailable: personData.isUnavailable,
			forLivePart: personData.forLivePart,
			viewOnlineSchedule: personData.viewOnlineSchedule,
			student_PIN: personData.student_PIN,
			viewStudent_Part: personData.viewStudent_Part,
		},
		personData.id
	);
};

export const dbDeleteStudent = async (id) => {
	await appDb.persons.delete(id);
};

export const dbAddPersonData = async (personData) => {
	await appDb.persons.add({
		person_name: personData.person_name,
		person_displayName: personData.person_displayName,
		isMale: personData.isMale,
		isFemale: personData.isFemale,
		isBRead: personData.isBRead,
		isInitialCall: personData.isInitialCall,
		isReturnVisit: personData.isReturnVisit,
		isBibleStudy: personData.isBibleStudy,
		isTalk: personData.isTalk,
		isUnavailable: personData.isUnavailable,
		forLivePart: personData.forLivePart,
	});
};

export const dbGetStudentDetails = async (id) => {
	id = parseInt(id, 10);
	const appData = await appDb.table('persons').get({ id: id });
	var person = {};
	person.source = 'lmm_oa';
	person.id = appData.id;
	person.person_name = appData.person_name;
	person.person_displayName = appData.person_displayName;
	person.isMale = appData.isMale;
	person.isFemale = appData.isFemale;
	person.isBRead = appData.isBRead;
	person.isInitialCall = appData.isInitialCall;
	person.isReturnVisit = appData.isReturnVisit;
	person.isBibleStudy = appData.isBibleStudy;
	person.isTalk = appData.isTalk;
	person.isUnavailable = appData.isUnavailable;
	person.forLivePart = appData.forLivePart;
	person.viewOnlineSchedule = appData.viewOnlineSchedule || false;
	person.student_PIN = appData.student_PIN || '';
	person.viewStudent_Part = appData.viewStudent_Part | [];
	person.lastBRead = appData.lastBRead || '';
	person.lastInitialCall = appData.lastInitialCall || '';
	person.lastReturnVisit = appData.lastReturnVisit || '';
	person.lastBibleStudy = appData.lastBibleStudy || '';
	person.lastTalk = appData.lastTalk || '';

	return person;
};

export const dbGetPersonsByAssType = async (assType) => {
	const appData = await appDb.table('persons').toArray();
	const appSettings = await dbGetAppSettings();
	const isLiveClass = appSettings.liveEventClass;
	var dbPersons = [];
	if (isLiveClass === true) {
		if (assType === 'isAssistant') {
			dbPersons = appData.filter(
				(person) =>
					(person.isInitialCall === true ||
						person.isReturnVisit === true ||
						person.isBibleStudy === true) &
					(person.isUnavailable === false) &
					(person.forLivePart === true)
			);
		} else {
			dbPersons = appData.filter(
				(person) =>
					(person[assType] === true) &
					(person.isUnavailable === false) &
					(person.forLivePart === true)
			);
		}
	} else {
		if (assType === 'isAssistant') {
			dbPersons = appData.filter(
				(person) =>
					(person.isInitialCall === true ||
						person.isReturnVisit === true ||
						person.isBibleStudy === true) &
					(person.isUnavailable === false)
			);
		} else {
			dbPersons = appData.filter(
				(person) =>
					(person[assType] === true) & (person.isUnavailable === false)
			);
		}
	}
	var persons = [];

	for (let i = 0; i < dbPersons.length; i++) {
		var person = {};
		person.id = dbPersons[i].id;
		person.lastAssignment = dbPersons[i].lastAssignment;
		if (typeof dbPersons[i].lastAssignment === 'undefined') {
			person.lastAssignmentFormat = '';
		} else {
			const [varMonth, varDay, varYear] =
				dbPersons[i].lastAssignment.split('/');
			var lDate = new Date(varYear, varMonth - 1, varDay);
			const dateFormatted = dateFormat(lDate, t('global.shortDateFormat'));
			person.lastAssignmentFormat = dateFormatted;
		}
		person.person_displayName = dbPersons[i].person_displayName;
		persons.push(person);
	}

	persons.sort((a, b) => {
		if (typeof a.lastAssignment === 'undefined') return -1;
		if (typeof b.lastAssignment === 'undefined') return 1;
		if (a.lastAssignment === b.lastAssignment) return 0;
		var dateA =
			a.lastAssignment.split('/')[2] +
			'/' +
			a.lastAssignment.split('/')[0] +
			'/' +
			a.lastAssignment.split('/')[1];
		var dateB =
			b.lastAssignment.split('/')[2] +
			'/' +
			b.lastAssignment.split('/')[0] +
			'/' +
			b.lastAssignment.split('/')[1];
		return dateA > dateB ? 1 : -1;
	});
	return persons;
};

export const dbHistoryAssignment = async () => {
	const appData = await appDb.table('sched_MM').reverse().sortBy('weekOf');
	var dbHistory = [];
	var histID = 0;
	for (let i = 0; i < appData.length; i++) {
		var person = {};

		const weekData = await dbGetSourceMaterial(appData[i].weekOf);
		const [varMonth, varDay, varYear] = appData[i].weekOf.split('/');
		const lDate = new Date(varYear, varMonth - 1, varDay);
		const dateFormatted = dateFormat(lDate, t('global.shortDateFormat'));
		const cnAss = [{ iAss: 1 }, { iAss: 2 }, { iAss: 3 }];
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
				person.assignmentName = t('global.bibleReading');
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
						person.assignmentName = t('global.initialCall');
					} else if (assType === 2) {
						person.assignmentName = t('global.returnVisit');
					} else if (assType === 3) {
						person.assignmentName = t('global.bibleStudy');
					} else if (assType === 4) {
						person.assignmentName = t('global.talk');
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
		return dateA > dateB ? 1 : -1;
	});
	return dbHistory;
};

export const dbStudentID = async (varName) => {
	const appData = await appDb
		.table('persons')
		.get({ person_displayName: varName });
	return appData.id;
};

export const dbHistoryAssistant = async (mainStuID) => {
	mainStuID = await dbStudentID(mainStuID);
	const appData = await appDb.table('sched_MM').reverse().sortBy('weekOf');
	var dbHistory = [];
	var histID = 0;
	for (let i = 0; i < appData.length; i++) {
		var person = {};

		const weekData = await dbGetSourceMaterial(appData[i].weekOf);
		const [varMonth, varDay, varYear] = appData[i].weekOf.split('/');
		const lDate = new Date(varYear, varMonth - 1, varDay);
		const dateFormatted = dateFormat(lDate, 'dd/mm/yyyy');
		const cnAss = [{ iAss: 1 }, { iAss: 2 }, { iAss: 3 }];
		const varClasses = [{ classLabel: 'A' }, { classLabel: 'B' }];

		//AYF Assigment History
		for (let b = 0; b < cnAss.length; b++) {
			var weekFld = 'ass' + cnAss[b].iAss + '_type';
			const assType = weekData[weekFld];

			if (assType === 1 || assType === 2 || assType === 3) {
				for (let a = 0; a < varClasses.length; a++) {
					const fldName =
						'ass' + cnAss[b].iAss + '_stu_' + varClasses[a].classLabel;
					if (typeof appData[i][fldName] !== 'undefined') {
						if (appData[i][fldName] === mainStuID) {
							const assFldName =
								'ass' + cnAss[b].iAss + '_ass_' + varClasses[a].classLabel;
							if (typeof appData[i][assFldName] !== 'undefined') {
								person.ID = histID;
								person.weekOf = appData[i].weekOf;
								person.weekOfFormatted = dateFormatted;
								person.mainStuID = appData[i][fldName];
								person.assistantStuID = appData[i][assFldName];
								const stuDetails = await dbGetStudentDetails(
									person.assistantStuID
								);
								person.assistantName = stuDetails.person_displayName;
								dbHistory.push(person);
								person = {};
								histID++;
							}
						}
					}
				}
			}
		}
	}
	return dbHistory;
};
