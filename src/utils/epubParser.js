import { loadEPUB } from 'jw-epub-parser';
import dateFormat from 'dateformat';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { dbSaveSrcData, dbGetYearList } from '../indexedDb/dbSourceMaterial';
import { monthNamesState } from '../states/main';
import { assTypeAYFOnlyState, yearsListState } from '../states/sourceMaterial';

export const addEpubDataToDb = async (fileEPUB) => {
  const data = await loadEPUB(fileEPUB);
  await addDataToDb(data);
};

export const addJwDataToDb = async (dataJw) => {
  for (let i = 0; i < dataJw.length; i++) {
    const data = dataJw[i];
    await addDataToDb(data);
  }
};

const addDataToDb = async (data) => {
  try {
    const monthNames = await promiseGetRecoil(monthNamesState);
    const assTypeList = await promiseGetRecoil(assTypeAYFOnlyState);

    for (let i = 0; i < data.weeksData.length; i++) {
      const src = data.weeksData[i];
      const cnAYF = src.ayfCount;
      let a = 0;

      const obj = {};
      let toSplit1;
      let assType = '';
      let assSource = '';

      //WeekOf Source
      let dayParse = src.weekDate.match(/(\w|\s)*\w(?=")|\w+/g);
      let varDay;
      let varMonthName;

      for (let b = 0; b < dayParse.length; b++) {
        if (!varDay) {
          if (!isNaN(dayParse[b]) && dayParse[b].length < 4) {
            varDay = +dayParse[b];
          }
        }
        if (!varMonthName) {
          if (isNaN(dayParse[b])) {
            varMonthName = dayParse[b];
          }
        }

        if (varDay && varMonthName) {
          break;
        }
      }

      const monthIndex = monthNames.indexOf(varMonthName);

      const schedDate = new Date(data.mwbYear, monthIndex, varDay);
      obj.weekOf = dateFormat(schedDate, 'mm/dd/yyyy');
      obj.weekDate_src = src.weekDate;

      // Weekly Bible Reading
      obj.weeklyBibleReading_src = src.weeklyBibleReading;

      // Opening Song
      obj.songFirst_src = src.songFirst;

      // TGW Talk 10 min
      toSplit1 = src.tgw10Talk.replaceAll(/\u00A0/g, ' ').split(': (10 ');
      obj.tgwTalk_src = toSplit1[0].trim();

      //Bible Reading Source
      toSplit1 = src.tgwBRead.split('.) ');
      assSource = toSplit1[1];
      assSource = assSource.trim();
      obj.bibleReading_src = assSource;

      // AYF Count
      obj.ayfCount = src.ayfCount;

      //AYF1 Assignment Type
      for (a = assTypeList.length - 1; a >= 0; a--) {
        if (new RegExp('^\\b' + assTypeList[a].label + '\\b').test(src.ayfPart1)) {
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
      obj.ass4_type = '';
      obj.ass4_time = '';
      obj.ass4_src = '';

      if (cnAYF > 1) {
        //AYF2 Assignment Type
        assType = '';
        for (a = assTypeList.length - 1; a >= 0; a--) {
          if (new RegExp('^\\b' + assTypeList[a].label + '\\b').test(src.ayfPart2)) {
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
          if (new RegExp('^\\b' + assTypeList[a].label + '\\b').test(src.ayfPart3)) {
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
          if (new RegExp('^\\b' + assTypeList[a].label + '\\b').test(src.ayfPart4)) {
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

      // Middle Song
      obj.songMiddle_src = src.songMiddle;

      // LC Count
      obj.lcCount = src.lcCount;

      let lcSplit = '';

      // LC Part 1 Time
      const numberPattern = /\d+/g;
      lcSplit = ': (';
      toSplit1 = src.lcPart1.split(lcSplit);
      obj.lcPart1_time = +toSplit1[1].match(numberPattern)[0];

      // LC Part 1 Source
      lcSplit = ': (' + obj.lcPart1_time;
      toSplit1 = src.lcPart1.split(lcSplit);
      obj.lcPart1_src = toSplit1[0];

      obj.lcPart2_time = '';
      obj.lcPart2_src = '';

      // LC Part 2
      if (src.lcCount > 1) {
        // LC Part 2 Time
        lcSplit = ': (';
        toSplit1 = src.lcPart2.split(lcSplit);
        obj.lcPart2_time = +toSplit1[1].match(numberPattern)[0];

        // LC Part 2 Source
        lcSplit = ': (' + obj.lcPart2_time;
        toSplit1 = src.lcPart2.split(lcSplit);
        obj.lcPart2_src = toSplit1[0];
      }

      // CBS Source
      const forSplit = '.) ';
      toSplit1 = src.lcCBS.split(forSplit);
      obj.cbs_src = toSplit1[1];

      // Concluding Song
      obj.songConclude_src = src.songConclude;

      obj.week_type = 1;
      obj.noMeeting = false;
      obj.isOverride = false;

      await dbSaveSrcData(obj);
    }

    const years = await dbGetYearList();
    await promiseSetRecoil(yearsListState, years);
  } catch (err) {
    return 'error';
  }
};
