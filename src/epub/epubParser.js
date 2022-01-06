import loadEPUB from 'jw-epub-parser';
import { promiseGetRecoil } from 'recoil-outside';
import { dbSaveSrcData } from '../indexedDb/dbSourceMaterial';
import { monthNamesState } from '../appStates/appSettings';
import { assTypeLocalState } from '../appStates/appSourceMaterial';

const dateFormat = require('dateformat');

export const addEpubDataToDb = async (fileEPUB) => {
	try {
		const data = await loadEPUB(fileEPUB);
		const monthNames = await promiseGetRecoil(monthNamesState);
		const assTypeList = await promiseGetRecoil(assTypeLocalState);

		for (let i = 0; i < data.weeksData.length; i++) {
			const src = data.weeksData[i];
			const cnAYF = src.ayfCount;
			let a = 0;

			var obj = {};
			var toSplit1;
			var assType = '';
			var assSource = '';

			//WeekOf Source
			let dayParse = src.weekDate.match(/(\w|\s)*\w(?=")|\w+/g);
			let varDay;
			let varMonthName;

			for (a = 0; a < dayParse.length; a++) {
				if (!varDay) {
					if (!isNaN(dayParse[a]) && dayParse[a].length < 4) {
						varDay = +dayParse[a];
					}
				}
				if (!varMonthName) {
					if (isNaN(dayParse[a])) {
						varMonthName = dayParse[a];
					}
				}

				if (varDay && varMonthName) {
					break;
				}
			}

			const monthIndex = monthNames.indexOf(varMonthName);

			const schedDate = new Date(data.mwbYear, monthIndex, varDay);
			obj.weekOf = dateFormat(schedDate, 'mm/dd/yyyy');

			//Bible Reading Source
			toSplit1 = src.tgwBRead.split('.) ');
			assSource = toSplit1[1];
			assSource = assSource.trim();
			obj.bibleReading_src = assSource;

			//AYF1 Assignment Type
			for (a = assTypeList.length - 1; a >= 0; a--) {
				if (
					new RegExp('\\b' + assTypeList[a].label + '\\b').test(src.ayfPart1)
				) {
					assType = assTypeList[a].value;
					break;
				}
			}
			if (assType === '') {
				assType = '7';
			}
			obj.ass1_type = assType;

			//AYF1 Assignment Time
			obj.ass1_time = src.ayfPart1.match(/(\d+)/)[0];

			//AYF1 Assignment Source
			if (assType === '7') {
				const forSplit = ': (' + obj.ass1_time;
				toSplit1 = src.ayfPart1.split(forSplit);
				assSource = toSplit1[0];
			} else {
				toSplit1 = src.ayfPart1.split('min.) ');
				assSource = toSplit1[1];
			}
			obj.ass1_src = assSource;

			obj.ass2_type = '';
			obj.ass2_time = '';
			obj.ass2_src = '';
			obj.ass3_type = '';
			obj.ass3_time = '';
			obj.ass3_src = '';

			if (cnAYF > 1) {
				//AYF2 Assignment Type
				assType = '';
				for (a = assTypeList.length - 1; a >= 0; a--) {
					if (
						new RegExp('\\b' + assTypeList[a].label + '\\b').test(src.ayfPart2)
					) {
						assType = assTypeList[a].value;
						break;
					}
				}
				if (assType === '') {
					assType = '7';
				}
				obj.ass2_type = assType;

				//AYF2 Assignment Time
				obj.ass2_time = src.ayfPart2.match(/(\d+)/)[0];

				//AYF2 Assignment Source
				if (assType === '7') {
					const forSplit = ': (' + obj.ass1_time;
					toSplit1 = src.ayfPart2.split(forSplit);
					assSource = toSplit1[0];
				} else {
					toSplit1 = src.ayfPart2.split('min.) ');
					assSource = toSplit1[1];
				}
				obj.ass2_src = assSource;
			}

			if (cnAYF > 2) {
				//AYF3 Assignment Type
				assType = '';
				for (a = assTypeList.length - 1; a >= 0; a--) {
					if (
						new RegExp('\\b' + assTypeList[a].label + '\\b').test(src.ayfPart3)
					) {
						assType = assTypeList[a].value;
						break;
					}
				}
				if (assType === '') {
					assType = '7';
				}
				obj.ass3_type = assType;

				//AYF3 Assignment Time
				obj.ass3_time = src.ayfPart3.match(/(\d+)/)[0];

				//AYF3 Assignment Source
				if (assType === '7') {
					const forSplit = ': (' + obj.ass1_time;
					toSplit1 = src.ayfPart3.split(forSplit);
					assSource = toSplit1[0];
				} else {
					toSplit1 = src.ayfPart3.split('min.) ');
					assSource = toSplit1[1];
				}
				obj.ass3_src = assSource;
			}

			if (cnAYF > 3) {
				//AYF4 Assignment Type
				assType = '';
				for (a = assTypeList.length - 1; a >= 0; a--) {
					if (
						new RegExp('\\b' + assTypeList[a].label + '\\b').test(src.ayfPart4)
					) {
						assType = assTypeList[a].value;
						break;
					}
				}
				if (assType === '') {
					assType = '7';
				}
				obj.ass4_type = assType;

				//AYF4 Assignment Time
				obj.ass4_time = src.ayfPart4.match(/(\d+)/)[0];

				//AYF3 Assignment Source
				if (assType === '7') {
					const forSplit = ': (' + obj.ass1_time;
					toSplit1 = src.ayfPart4.split(forSplit);
					assSource = toSplit1[0];
				} else {
					toSplit1 = src.ayfPart4.split('min.) ');
					assSource = toSplit1[1];
				}
				obj.ass4_src = assSource;
			}

			obj.week_type = 1;
			obj.noMeeting = false;
			obj.isOverride = false;

			await dbSaveSrcData(obj);
		}
	} catch {
		return 'error';
	}
};
