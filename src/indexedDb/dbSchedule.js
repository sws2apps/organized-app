import { promiseGetRecoil } from 'recoil-outside';
import { getI18n } from 'react-i18next';
import dateFormat from 'dateformat';
import { classCountState } from '../states/congregation';
import { monthNamesState, shortDateFormatState } from '../states/main';
import { yearsListState } from '../states/sourceMaterial';
import { dbGetStudentByUid } from './dbPersons';
import {
  dbGetScheduleListByYear,
  dbGetSourceMaterial,
  dbGetSourceMaterialPocket,
  dbGetWeekListBySched,
  dbGetWeekTypeName,
  dbGetWeekTypeNamePocket,
} from './dbSourceMaterial';
import appDb from './mainDb';

export const dbGetBaseScheduleDate = async (weekValue) => {
  const appData = await appDb.table('sched_MM').get({ weekOf: weekValue });
  const schedule = {};
  schedule.weekOf = appData.weekOf;

  const assList = [];
  const excludeFiles = ['weekOf', 'week_type', 'noMeeting', 'isReleased', 'changes'];
  for (const [key, value] of Object.entries(appData)) {
    if (excludeFiles.indexOf(key) === -1) {
      assList.push({ assignment: key, person: value });
    }
  }

  for await (const item of assList) {
    const fldDispName = `${item.assignment}_dispName`;

    if (item.person) {
      const student = await dbGetStudentByUid(item.person);
      schedule[item.assignment] = item.person;
      schedule[fldDispName] = student.person_displayName;
    } else {
      schedule[item.assignment] = '';
      schedule[fldDispName] = '';
    }
  }

  schedule.week_type = parseInt(appData.week_type, 10) || 1;
  schedule.noMeeting = appData.noMeeting || false;
  return schedule;
};

export const dbGetScheduleData = async (weekValue) => {
  const baseSchedule = await dbGetBaseScheduleDate(weekValue);
  const schedule = { ...baseSchedule };
  schedule.week_type_name = await dbGetWeekTypeName(schedule.week_type);
  return schedule;
};

export const dbGetScheduleDataPocket = async (weekValue) => {
  const baseSchedule = await dbGetBaseScheduleDate(weekValue);
  const schedule = { ...baseSchedule };
  schedule.week_type_name = await dbGetWeekTypeNamePocket(schedule.week_type);
  return schedule;
};

export const dbBuildScheduleForShare = async (scheduleIndex) => {
  // get current schedule id
  const month = +scheduleIndex.split('/')[0];
  const year = +scheduleIndex.split('/')[1];

  let id;
  const schedule = await appDb.sws_pocket.where('[month+year]').equals([month, year]).first();

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
    sources: objSource,
    id: id,
    schedules: objSchedule,
    month: month,
    year: year,
  };

  return dataPocket;
};

export const dbSaveScheduleByAss = async (field, value, weekOf) => {
  const obj = {};
  obj[field] = value;

  await appDb.table('sched_MM').update(weekOf, { ...obj });
};

export const dbCountAssignmentsInfo = async (week) => {
  let assTotal = 0;
  let assAssigned = 0;

  const classCount = await promiseGetRecoil(classCountState);
  const schedData = await dbGetScheduleData(week);
  const sourceData = await dbGetSourceMaterial(week);

  if (schedData.noMeeting) {
    return { total: 0, assigned: 0 };
  }

  // chairman
  assTotal = assTotal + 1;

  // chairman aux
  if (schedData.week_type === 1 && classCount > 1) {
    assTotal = assTotal + 1;
  }

  if (schedData.chairmanMM_A && schedData.chairmanMM_A !== '') {
    assAssigned = assAssigned + 1;
  }

  if (schedData.chairmanMM_B && schedData.chairmanMM_B !== '') {
    assAssigned = assAssigned + 1;
  }

  // opening prayer
  assTotal = assTotal + 1;

  if (schedData.opening_prayer && schedData.opening_prayer !== '') {
    assAssigned = assAssigned + 1;
  }

  // TGW 10 Talk
  assTotal = assTotal + 1;

  if (schedData.tgw_talk && schedData.tgw_talk !== '') {
    assAssigned = assAssigned + 1;
  }

  // TGW 10 Gems
  assTotal = assTotal + 1;

  if (schedData.tgw_gems && schedData.tgw_gems !== '') {
    assAssigned = assAssigned + 1;
  }

  // bible reading
  assTotal = assTotal + 1;

  // aux
  if (schedData.week_type === 1 && classCount > 1) {
    assTotal = assTotal + 1;
  }

  if (schedData.bRead_stu_A && schedData.bRead_stu_A !== '') {
    assAssigned = assAssigned + 1;
  }

  if (schedData.bRead_stu_B && schedData.bRead_stu_B !== '') {
    assAssigned = assAssigned + 1;
  }

  // field ministry
  for (let a = 1; a <= 4; a++) {
    const assType = `ass${a}_type`;
    const assValue = sourceData[assType];

    // discussion part
    if (assValue === 101 || assValue === 102 || assValue === 103 || assValue === 108) {
      assTotal = assTotal + 2;

      // aux
      if (schedData.week_type === 1 && classCount > 1) {
        assTotal = assTotal + 2;
      }
    }

    // talk part
    if (assValue === 104) {
      assTotal = assTotal + 1;

      // aux
      if (schedData.week_type === 1 && classCount > 1) {
        assTotal = assTotal + 1;
      }
    }

    const stuFieldA = `ass${a}_stu_A`;
    const assFieldA = `ass${a}_ass_A`;
    const stuFieldB = `ass${a}_stu_B`;
    const assFieldB = `ass${a}_ass_B`;

    if (schedData[stuFieldA] && schedData[stuFieldA] !== '') {
      assAssigned = assAssigned + 1;
    }

    if (schedData[assFieldA] && schedData[assFieldA] !== '') {
      assAssigned = assAssigned + 1;
    }

    if (schedData[stuFieldB] && schedData[stuFieldB] !== '') {
      assAssigned = assAssigned + 1;
    }

    if (schedData[assFieldB] && schedData[assFieldB] !== '') {
      assAssigned = assAssigned + 1;
    }
  }

  // LC Part 1
  assTotal = assTotal + 1;

  if (schedData.lc_part1 && schedData.lc_part1 !== '') {
    assAssigned = assAssigned + 1;
  }

  // LC Part 2
  let cnLC2 = false;
  if (sourceData.lcCount_override === undefined && sourceData.lcCount === 2) {
    cnLC2 = true;
  }
  if (sourceData.lcCount_override !== undefined && sourceData.lcCount_override === 2) {
    cnLC2 = true;
  }
  if (cnLC2) {
    assTotal = assTotal + 1;

    if (schedData.lc_part2 && schedData.lc_part2 !== '') {
      assAssigned = assAssigned + 1;
    }
  }

  // CBS
  if (schedData.week_type === 1) {
    // Conductor
    assTotal = assTotal + 1;

    if (schedData.cbs_conductor && schedData.cbs_conductor !== '') {
      assAssigned = assAssigned + 1;
    }

    // Reader
    assTotal = assTotal + 1;

    if (schedData.cbs_reader && schedData.cbs_reader !== '') {
      assAssigned = assAssigned + 1;
    }
  }

  // Closing Prayer
  assTotal = assTotal + 1;

  if (schedData.closing_prayer && schedData.closing_prayer !== '') {
    assAssigned = assAssigned + 1;
  }

  return { total: assTotal, assigned: assAssigned };
};

export const dbBuildSchedulesListForShare = async () => {
  const { t } = getI18n();
  const years = await promiseGetRecoil(yearsListState);
  const monthNames = await promiseGetRecoil(monthNamesState);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const finalList = { label: t('selectAll', { ns: 'ui' }), value: 'sched', children: [] };
  for await (const year of years) {
    const yearValue = +year.value;

    if (yearValue >= currentYear) {
      const obj = {};

      obj.value = year.value;
      obj.label = year.label;
      obj.children = [];

      const yearSchedules = await dbGetScheduleListByYear(year.value);

      yearSchedules.forEach((schedule) => {
        const monthIndex = parseInt(schedule.value.split('/')[0], 10) - 1;

        let passed = true;
        if (yearValue === currentYear && monthIndex < currentMonth) passed = false;

        if (passed) {
          const scheduleName = `${monthNames[monthIndex]} ${schedule.value.split('/')[1]}`;
          obj.children.push({ label: scheduleName, value: schedule.value });
        }
      });

      finalList.children.push(obj);
    }
  }
  return finalList;
};

export const formatSelectedSchedulesForShare = (data) => {
  const result = data.filter((item) => item.indexOf('/') >= 0) || [];
  return result;
};

export const getWeeksBySchedule = async (schedule) => {
  const shortDateFormat = await promiseGetRecoil(shortDateFormatState);

  const data = await dbGetWeekListBySched(schedule);
  const newData = [];
  data.forEach((week) => {
    const weekDate = week.weekOf;
    const day = weekDate.split('/')[1];
    const month = weekDate.split('/')[0];
    const year = weekDate.split('/')[2];
    const newDate = new Date(year, +month - 1, day);
    const dateFormatted = dateFormat(newDate, shortDateFormat);
    newData.push({ value: week.value, label: dateFormatted });
  });

  return newData;
};

export const dbFetchScheduleInfo = async (condition, currentSchedule, currentWeek) => {
  const newData = [];

  if (condition) {
    let data = await dbGetWeekListBySched(currentSchedule.value);
    for (let i = 0; i < data.length; i++) {
      const obj = {};
      obj.value = data[i].weekOf;
      newData.push(obj);
    }
  } else {
    newData.push({ value: currentWeek.value });
  }

  let cnTotal = 0;
  let cnAssigned = 0;
  for await (const item of newData) {
    const week = item.value;
    const { total, assigned } = await dbCountAssignmentsInfo(week);

    cnTotal += total;
    cnAssigned += assigned;
  }

  return { weeks: newData, total: cnTotal, assigned: cnAssigned };
};
