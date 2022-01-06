import appDb from './mainDb';
import { promiseGetRecoil } from 'recoil-outside';
import { appLangState } from '../appStates/appSettings';
import { assTypeLocalState } from '../appStates/appSourceMaterial';

export const dbGetListWeekType = async () => {
	var weekType = [];
	const appData = await appDb
		.table('week_type')
		.reverse()
		.reverse()
		.sortBy('id_week_type');

	for (let i = 0; i < appData.length; i++) {
		var obj = {};
		obj.id_week_type = appData[i].id_week_type;
		obj.week_type_name = appData[i].week_type_name;
		weekType.push(obj);
	}
	return weekType;
};

export const dbGetScheduleWeekInfo = async (weekOf) => {
	const appData = await appDb.table('sched_MM').get({ weekOf: weekOf });
	var obj = {};
	obj.week_type = appData.week_type;
	obj.noMeeting = appData.noMeeting;
	return obj;
};

export const dbGetWeekTypeName = async (weekType) => {
	var srcWeekType = '';
	if (weekType === '') {
		return srcWeekType;
	} else {
		var i = parseInt(weekType, 10);
		const appData = await appDb.table('week_type').get(i);
		srcWeekType = appData.week_type_name;
		return srcWeekType;
	}
};

export const dbGetSourceMaterial = async (weekOf) => {
	const appLang = (await promiseGetRecoil(appLangState)) || 'e';
	const lang = appLang.toUpperCase();
	const assTypeList = await promiseGetRecoil(assTypeLocalState);

	const appData = await appDb.table('src').get({ weekOf: weekOf });

	let obj = {};
	let indexType;

	obj.weekOf = appData.weekOf;
	obj.bibleReading_src = appData.bibleReading_src
		? appData.bibleReading_src[lang] || ''
		: '';
	obj.ass1_type = +appData.ass1_type || '';

	indexType = assTypeList.findIndex((type) => type.value === obj.ass1_type);
	obj.ass1_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

	obj.ass1_time = appData.ass1_time || '';
	obj.ass1_src = appData.ass1_src ? appData.ass1_src[lang] || '' : '';
	obj.ass2_type = +appData.ass2_type || '';

	indexType = assTypeList.findIndex((type) => type.value === obj.ass2_type);
	obj.ass2_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

	obj.ass2_time = appData.ass2_time || '';
	obj.ass2_src = appData.ass2_src ? appData.ass2_src[lang] || '' : '';
	obj.ass3_type = +appData.ass3_type || '';

	indexType = assTypeList.findIndex((type) => type.value === obj.ass3_type);
	obj.ass3_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

	obj.ass3_time = appData.ass3_time || '';
	obj.ass3_src = appData.ass3_src ? appData.ass3_src[lang] || '' : '';
	obj.ass4_type = +appData.ass4_type || '';

	indexType = assTypeList.findIndex((type) => type.value === obj.ass4_type);
	obj.ass4_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

	obj.ass4_time = appData.ass4_time || '';
	obj.ass4_src = appData.ass4_src ? appData.ass4_src[lang] || '' : '';

	const weekSchedInfo = await dbGetScheduleWeekInfo(weekOf);
	obj.week_type = weekSchedInfo.week_type;
	obj.noMeeting = weekSchedInfo.noMeeting;

	return obj;
};

export const dbGetSMUpdate = async (weekOf) => {
	const appData = await appDb.table('src').get({ weekOf: weekOf });
	var obj = {};

	obj.bibleReading_src = appData ? appData.bibleReading_src || {} : {};
	obj.ass1_src = appData ? appData.ass1_src || {} : {};
	obj.ass2_src = appData ? appData.ass2_src || {} : {};
	obj.ass3_src = appData ? appData.ass3_src || {} : {};
	obj.ass4_src = appData ? appData.ass4_src || {} : {};

	return obj;
};

export const dbSaveSrcData = async (srcData) => {
	var isSuccess = false;
	const appLang = (await promiseGetRecoil(appLangState)) || 'e';
	const lang = appLang.toUpperCase();

	const { bibleReading_src, ass1_src, ass2_src, ass3_src, ass4_src } =
		await dbGetSMUpdate(srcData.weekOf);

	await appDb
		.table('src')
		.put(
			{
				weekOf: srcData.weekOf,
				bibleReading_src: {
					...bibleReading_src,
					[lang]: srcData.bibleReading_src || '',
				},
				ass1_type: srcData.ass1_type,
				ass1_time: srcData.ass1_time,
				ass1_src: {
					...ass1_src,
					[lang]: srcData.ass1_src || '',
				},
				ass2_type: srcData.ass2_type,
				ass2_time: srcData.ass2_time,
				ass2_src: {
					...ass2_src,
					[lang]: srcData.ass2_src || '',
				},
				ass3_type: srcData.ass3_type,
				ass3_time: srcData.ass3_time,
				ass3_src: {
					...ass3_src,
					[lang]: srcData.ass3_src || '',
				},
				ass4_type: srcData.ass4_type,
				ass4_time: srcData.ass4_time,
				ass4_src: {
					...ass4_src,
					[lang]: srcData.ass4_src || '',
				},
			},
			srcData.weekOf
		)
		.then(async () => {
			const isSub = await dbSaveSchedData(
				srcData.weekOf,
				srcData.week_type,
				srcData.noMeeting,
				srcData.isOverride
			);
			if (isSub === true) {
				isSuccess = true;
			}
		})
		.catch(() => {
			isSuccess = false;
		});
	return isSuccess;
};

const dbSaveSchedData = async (weekOf, weekType, noMeeting, isOverride) => {
	var isSuccess = false;
	const appData = await appDb.table('sched_MM').get({ weekOf: weekOf });
	if (isOverride === false) {
		if (appData !== undefined) {
			weekType = appData.week_type;
			noMeeting = appData.noMeeting;
		}
	}

	if (appData === undefined) {
		await appDb
			.table('sched_MM')
			.put(
				{
					weekOf: weekOf,
					week_type: weekType,
					noMeeting: noMeeting,
				},
				weekOf
			)
			.then(() => {
				isSuccess = true;
			})
			.catch(() => {
				isSuccess = false;
			});
	} else {
		await appDb
			.table('sched_MM')
			.update(weekOf, {
				weekOf: weekOf,
				week_type: weekType,
				noMeeting: noMeeting,
			})
			.then(() => {
				isSuccess = true;
			})
			.catch((error) => {
				isSuccess = false;
			});
	}

	return isSuccess;
};

export const hasCurrentWeek = async () => {
	var varBool = true;
	var dateFormat = require('dateformat');
	var today = new Date();
	var day = today.getDay();
	var diff = today.getDate() - day + (day === 0 ? -6 : 1);
	var monDay = new Date(today.setDate(diff));
	const fMonday = dateFormat(monDay, 'mm/dd/yyyy');
	const congData = await appDb.table('src').get({ weekOf: fMonday });
	if (typeof congData === 'undefined') {
		varBool = false;
	}
	return varBool;
};

export const checkSrcUpdate = async () => {
	var checkCurrentWeek = await hasCurrentWeek();
	if (checkCurrentWeek === false) {
		var dateFormat = require('dateformat');
		var today = new Date();
		var day = today.getDay();
		var diff = today.getDate() - day + (day === 0 ? -6 : 1);
		var monDay = new Date(today.setDate(diff));
		const fMonday = dateFormat(monDay, 'mm/dd/yyyy');
		await dbAddWeekToSource(fMonday);
		await dbAddWeekToSchedule(fMonday);
	}
};

export const dbAddWeekToSource = async (varSrcWeek) => {
	await appDb.table('src').put({ weekOf: varSrcWeek }, varSrcWeek);
};

export const dbAddWeekToSchedule = async (varSchedWeek) => {
	var weekType = 1;
	var noMeeting = false;
	const appData = await appDb.table('sched_MM').get({ weekOf: varSchedWeek });
	if (typeof appData !== 'undefined') {
		weekType = appData.week_type;
		noMeeting = appData.noMeeting;
	}

	await appDb.table('sched_MM').put(
		{
			weekOf: varSchedWeek,
			week_type: weekType,
			noMeeting: noMeeting,
		},
		varSchedWeek
	);
};

export const dbGetWeekListBySched = async (scheduleIndex) => {
	var allSchedules = [];

	const appData = await appDb.table('src').reverse().reverse().sortBy('weekOf');

	for (let i = 0; i < appData.length; i++) {
		const weekDate = appData[i].weekOf;
		const month = weekDate.split('/')[0];
		const year = weekDate.split('/')[2];
		const tempMain = month + '/' + year;
		if (tempMain === scheduleIndex) {
			var obj = {};
			obj.weekOf = weekDate;
			obj.value = appData[i].weekOf;
			allSchedules.push(obj);
		}
	}
	return allSchedules;
};

export const dbGetYearList = async () => {
	var allYear = [];

	const appData = await appDb.table('src').reverse().reverse().sortBy('weekOf');

	for (let i = 0; i < appData.length; i++) {
		const weekDate = appData[i].weekOf;
		const varYear = weekDate.split('/')[2];

		const yearIndex = allYear.findIndex((year) => year.label === varYear);

		if (yearIndex < 0) {
			var obj = {};
			obj.label = varYear;
			obj.value = varYear;
			allYear.push(obj);
		}
	}
	return allYear;
};

export const dbGetScheduleListByYear = async (varYear) => {
	var allSchedules = [];

	const appData = await appDb.table('src').reverse().sortBy('weekOf');

	for (let i = 0; i < appData.length; i++) {
		const weekDate = appData[i].weekOf;
		const year = weekDate.split('/')[2];

		if (year === varYear) {
			const month = weekDate.split('/')[0];

			const tempMain = month + '/' + year;
			const scheduleIndex = allSchedules.findIndex(
				(schedule) => schedule.value === tempMain
			);

			if (scheduleIndex < 0) {
				var obj = {};
				obj.value = month + '/' + year;
				allSchedules.push(obj);
			}
		}
	}
	return allSchedules;
};

export const dbAddManualSource = async () => {
	var appData = [];
	appData = await appDb.table('src').toArray();
	appData.sort((a, b) => {
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
	console.log(appData);
	var key = appData.length - 1;
	const lastWeek = appData[key].weekOf;
	console.log(lastWeek);
	const day = lastWeek.split('/')[1];
	const month = lastWeek.split('/')[0];
	const year = lastWeek.split('/')[2];
	var result = new Date(year, month - 1, day);
	result.setDate(result.getDate() + 7);
	var dateFormat = require('dateformat');
	const fMonday = dateFormat(result, 'mm/dd/yyyy');
	await dbAddWeekToSource(fMonday);
	await dbAddWeekToSchedule(fMonday);
	return;
};

export const dbIsWeekExist = async (varWeek) => {
	let varBool = true;
	const congData = await appDb.table('src').get({ weekOf: varWeek });
	if (typeof congData === 'undefined') {
		varBool = false;
	}
	return varBool;
};
