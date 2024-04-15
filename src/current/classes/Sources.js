import dateFormat from 'dateformat';
import { getI18n } from 'react-i18next';

import appDb from '../../shared/indexedDb/mainDb';
import { Schedules } from './Schedules';
import { Setting } from './Setting';
import { SourceClass } from './Source';
import { AssignmentType } from './AssignmentType';

class SourcesClass {
  constructor() {
    this.list = [];
  }
}

SourcesClass.prototype.sort = function () {
  this.list.sort((a, b) => {
    return a.weekOf < b.weekOf ? 1 : -1;
  });
};

SourcesClass.prototype.loadAll = async function () {
  this.list.length = 0;
  const appData = await appDb.sources.toArray();

  for (const source of appData) {
    const week = new SourceClass(source.weekOf);
    await week.loadDetails();
    this.list.push(week);
  }

  this.sort();
};

SourcesClass.prototype.get = function (weekOf) {
  return this.list.find((source) => source.weekOf === weekOf);
};

SourcesClass.prototype.add = async function (weekOf) {
  const week = new SourceClass(weekOf);
  await week.loadDetails();
  this.list.push(week);
  this.sort();
};

SourcesClass.prototype.scheduleListByYear = function (varYear, userSort = 'desc') {
  const allSchedules = [];
  let appData = [];

  if (userSort === null) userSort = 'desc';

  appData = [...this.list];

  if (userSort === 'asc') {
    appData = appData.reverse();
  }

  for (const source of appData) {
    const weekDate = source.weekOf;
    const year = weekDate.split('/')[0];

    if (year === varYear) {
      const month = weekDate.split('/')[1];

      const tempMain = month + '/' + year;
      const scheduleIndex = allSchedules.findIndex((schedule) => schedule.value === tempMain);

      if (scheduleIndex < 0) {
        const obj = {};
        obj.value = month + '/' + year;
        allSchedules.push(obj);
      }
    }
  }

  return allSchedules;
};

SourcesClass.prototype.addWeekManually = async function () {
  let weekDate;

  if (this.list.length === 0) {
    weekDate = new Date();
  } else {
    const lastWeek = this.list[0].weekOf;
    const day = lastWeek.split('/')[2];
    const month = lastWeek.split('/')[1];
    const year = lastWeek.split('/')[0];
    weekDate = new Date(year, month - 1, day);
    weekDate.setDate(weekDate.getDate() + 7);
  }

  const day = weekDate.getDay();
  const diff = weekDate.getDate() - day + (day === 0 ? -6 : 1);
  const monDay = new Date(weekDate.setDate(diff));
  const fMonday = dateFormat(monDay, 'yyyy/mm/dd');

  if (!this.get(fMonday)) {
    await appDb.sources.put({ weekOf: fMonday }, fMonday);
    await this.add(fMonday);
  }

  if (!Schedules.get(fMonday)) {
    await appDb.sched.put({ weekOf: fMonday }, fMonday);
    await Schedules.add(fMonday);
  }
};

SourcesClass.prototype.delete = async function (week) {
  if (this.get(week)) {
    await appDb.sources.delete(week);
    this.list = this.list.filter((source) => source.weekOf !== week);
  }

  await Schedules.delete(week);
};

SourcesClass.prototype.weekListBySchedule = function (scheduleIndex) {
  const allWeeks = [];

  for (const source of this.list) {
    const weekDate = source.weekOf;
    const month = weekDate.split('/')[1];
    const year = weekDate.split('/')[0];
    const tempMain = month + '/' + year;
    if (tempMain === scheduleIndex) {
      allWeeks.push(weekDate);
    }
  }

  return allWeeks.reverse();
};

SourcesClass.prototype.weekListByScheduleLocal = function (scheduleIndex) {
  const data = this.weekListBySchedule(scheduleIndex);

  const newData = [];
  data.forEach((week) => {
    const day = week.split('/')[2];
    const month = week.split('/')[1];
    const year = week.split('/')[0];
    const newDate = new Date(year, +month - 1, day);
    const dateFormatted = dateFormat(newDate, Setting.shortDateFormat());
    newData.push({ value: week, label: dateFormatted });
  });

  return newData;
};

SourcesClass.prototype.S89WeekList = function (scheduleName) {
  const sourceLang = Setting.source_lang;
  const s89Data = [];
  const allWeeks = this.weekListBySchedule(scheduleName);

  for (const week of allWeeks) {
    const scheduleData = Schedules.get(week);
    if (!scheduleData.noMMeeting) {
      const parentWeek = {};
      parentWeek.value = week;
      const dateW = new Date(week);
      const weekDateFormatted = dateFormat(dateW, getI18n().t('shortDateFormat', { ns: 'ui' }));
      parentWeek.label = weekDateFormatted;
      parentWeek.children = [];

      const sourceData = this.get(week).local();
      let assClass = {};
      let assType = {};

      if (
        (scheduleData.bRead_stu_A && scheduleData.bRead_stu_A !== '') ||
        (scheduleData.bRead_stu_B && scheduleData.bRead_stu_B !== '')
      ) {
        assType.label = getI18n().t('bibleReading', { ns: 'source', lng: sourceLang });
        assType.value = week + '-0@bRead';
        assType.children = [];

        if (scheduleData.bRead_stu_A && scheduleData.bRead_stu_A !== '') {
          assClass = {};
          assClass.value = week + '-0@bRead-A';
          assClass.label = getI18n().t('mainHall', { ns: 'ui', lng: sourceLang });
          assType.children.push(assClass);
        }
        if (scheduleData.bRead_stu_B && scheduleData.bRead_stu_B !== '') {
          assClass = {};
          assClass.value = week + '-0@bRead-B';
          assClass.label = getI18n().t('auxClass1', { ns: 'ui', lng: sourceLang });
          assType.children.push(assClass);
        }
        parentWeek.children.push(assType);
      }

      const assTypeList = AssignmentType.local();
      for (let z = 1; z <= 4; z++) {
        const fldStuA = 'ass' + z + '_stu_A';
        const fldStuB = 'ass' + z + '_stu_B';
        const fldAss = 'mwb_ayf_part' + z + '_type';
        if (
          (scheduleData[fldStuA] && scheduleData[fldStuA] !== '') ||
          (scheduleData[fldStuB] && scheduleData[fldStuB] !== '')
        ) {
          assType = {};
          let indexType;
          indexType = assTypeList.findIndex((type) => type.value === sourceData[fldAss]);
          assType.label = indexType >= 0 ? assTypeList[indexType].label : '';
          assType.value = week + '-' + z + '@ass' + z;
          assType.children = [];
          if (scheduleData[fldStuA] && scheduleData[fldStuA] !== '') {
            assClass = {};
            assClass.value = week + '-' + z + '@ass' + z + '-A';
            assClass.label = getI18n().t('mainHall', { ns: 'ui', lng: sourceLang });
            assType.children.push(assClass);
          }
          if (scheduleData[fldStuB] && scheduleData[fldStuB] !== '') {
            assClass = {};
            assClass.value = week + '-' + z + '@ass' + z + '-B';
            assClass.label = getI18n().t('auxClass1', { ns: 'ui', lng: sourceLang });
            assType.children.push(assClass);
          }

          parentWeek.children.push(assType);
        }
      }
      if (parentWeek.children.length > 0) {
        s89Data.push(parentWeek);
      }
    }
  }

  const obj = {};
  obj.value = 'S89';
  obj.label = getI18n().t('allWeeks', { ns: 'ui' });
  obj.children = s89Data;

  return obj;
};

SourcesClass.prototype.updatePocketSource = async function (data) {
  for await (const week of data) {
    const source = this.get(week.weekOf) || new SourceClass(week.weekOf);
    await source.save(week, false, true);
  }
};

SourcesClass.prototype.checkCurrentWeek = async function () {
  if (this.list.length === 0) await this.loadAll();

  if (this.hasCurrentWeek() === false) await this.addWeekManually();
};

SourcesClass.prototype.yearsList = function () {
  const allYear = [];

  for (const source of this.list) {
    const weekDate = source.weekOf;
    const varYear = weekDate.split('/')[0];

    const yearIndex = allYear.findIndex((year) => year.label === varYear);

    if (yearIndex < 0) {
      const obj = {};
      obj.label = varYear;
      obj.value = varYear;
      allYear.push(obj);
    }
  }
  return allYear;
};

SourcesClass.prototype.schedulesListForShare = function () {
  const { t } = getI18n();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const finalList = { label: t('selectAll', { ns: 'ui' }), value: 'sched', children: [] };
  for (const year of this.yearsList()) {
    const yearValue = +year.value;

    if (yearValue >= currentYear) {
      const obj = {};

      obj.value = year.value;
      obj.label = year.label;
      obj.children = [];

      const yearSchedules = this.scheduleListByYear(year.value);

      yearSchedules.forEach((schedule) => {
        const monthIndex = parseInt(schedule.value.split('/')[0], 10) - 1;

        let passed = true;
        if (yearValue === currentYear && monthIndex < currentMonth) passed = false;

        if (passed) {
          const scheduleName = `${Setting.monthNames()[monthIndex]} ${schedule.value.split('/')[1]}`;
          obj.children.push({ label: scheduleName, value: schedule.value });
        }
      });

      finalList.children.push(obj);
    }
  }
  return finalList;
};

SourcesClass.prototype.oldestIssues = function () {
  const options = [];

  const getMWB = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekDate = new Date(today.setDate(diff));
    const currentMonth = weekDate.getMonth() + 1;
    const currentMonthOdd = currentMonth % 2 === 0 ? false : true;
    const currentMonthMwb = currentMonthOdd ? currentMonth : currentMonth - 1;
    const currentYear = weekDate.getFullYear();
    const currentIssue = `${currentYear}${currentMonthMwb}`;

    const validDate = weekDate.setMonth(weekDate.getMonth() - 12);
    const oldestDate = new Date(validDate);
    const oldestMonth = oldestDate.getMonth() + 1;
    const oldestMonthOdd = oldestMonth % 2 === 0 ? false : true;
    let oldMonthMwb = oldestMonthOdd ? oldestMonth : oldestMonth - 1;
    let oldYear = oldestDate.getFullYear();
    let activeIssue = `${oldYear}${oldMonthMwb}`;

    do {
      let validIssue = false;

      if (oldYear === 2022 && oldMonthMwb > 5) validIssue = true;
      if (oldYear > 2022) validIssue = true;

      if (validIssue) {
        const issueDate = oldYear + String(oldMonthMwb).padStart(2, '0');

        const label = `(mwb) ${Setting.monthNames()[oldMonthMwb - 1]} ${oldYear}`;
        const obj = { label, value: `pub-mwb_${issueDate}` };
        options.push(obj);
      }

      // assigning next issue
      oldMonthMwb = oldMonthMwb + 2;
      if (oldMonthMwb === 13) {
        oldMonthMwb = 1;
        oldYear++;
      }

      activeIssue = `${oldYear}${oldMonthMwb}`;
    } while (currentIssue !== activeIssue);
  };

  const getW = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekDate = new Date(today.setDate(diff));
    const currentW = new Date(weekDate.setMonth(weekDate.getMonth() - 2));
    const currentMonthW = currentW.getMonth() + 1;
    const currentYear = currentW.getFullYear();
    const currentIssue = `${currentYear}${currentMonthW}`;

    const validDate = weekDate.setMonth(currentW.getMonth() - 12);
    const oldestDate = new Date(validDate);
    let oldestMonthW = oldestDate.getMonth() + 1;
    let oldYear = oldestDate.getFullYear();
    let activeIssue = `${oldYear}${oldestMonthW}`;

    do {
      let validIssue = false;

      if (oldYear === 2023 && oldestMonthW > 4) validIssue = true;
      if (oldYear > 2023) validIssue = true;

      if (validIssue) {
        const issueDate = oldYear + String(oldestMonthW).padStart(2, '0');

        const label = `(w) ${Setting.monthNames()[oldestMonthW - 1]} ${oldYear}`;
        const obj = { label, value: `pub-w_${issueDate}` };
        options.push(obj);
      }

      // assigning next issue
      oldestMonthW = oldestMonthW + 1;
      if (oldestMonthW === 13) {
        oldestMonthW = 1;
        oldYear++;
      }

      activeIssue = `${oldYear}${oldestMonthW}`;
    } while (currentIssue !== activeIssue);
  };

  getMWB();
  getW();

  return options;
};

SourcesClass.prototype.hasCurrentWeek = function () {
  const weeksIgnore = ['04/03/2023'];

  let varBool = true;
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monDay = new Date(today.setDate(diff));
  const fMonday = dateFormat(monDay, 'yyyy/mm/dd');

  if (weeksIgnore.includes(fMonday)) {
    return true;
  }

  const congData = this.get(fMonday);
  if (typeof congData === 'undefined') {
    varBool = false;
  }
  return varBool;
};

export const Sources = new SourcesClass();
