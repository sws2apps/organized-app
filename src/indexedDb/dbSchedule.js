import { promiseGetRecoil } from 'recoil-outside';
import { classCountState } from '../states/congregation';
import { dbGetStudentByUid } from './dbPersons';
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
  const schedule = {};
  let student = {};
  schedule.weekOf = appData.weekOf;

  const assList = [];
  const excludeFiles = ['weekOf', 'week_type'];
  for (const [key, value] of Object.entries(appData)) {
    if (excludeFiles.indexOf(key) === -1) {
      assList.push({ assignment: key, person: value });
    }
  }

  for (const item of assList) {
    const fldDispName = `${item.assignment}_dispName`;

    if (item.person) {
      student = await dbGetStudentByUid(item.person);
      schedule[item.assignment] = item.person;
      schedule[fldDispName] = student.person_displayName;
    } else {
      schedule[item.assignment] = '';
      schedule[fldDispName] = '';
    }
  }

  schedule.week_type = parseInt(appData.week_type, 10) || 1;

  schedule.week_type_name = await dbGetWeekTypeName(schedule.week_type);
  schedule.noMeeting = appData.noMeeting || false;
  return schedule;
};

export const dbGetScheduleDataPocket = async (weekValue) => {
  const appData = await appDb.table('sched_MM').get({ weekOf: weekValue });
  const schedule = {};
  let student = {};
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
    }

    // aux
    if (schedData.week_type === 1 && classCount > 1) {
      assTotal = assTotal + 2;
    }

    // talk part
    if (assValue === 104) {
      assTotal = assTotal + 1;
    }

    // aux
    if (schedData.week_type === 1 && classCount > 1) {
      assTotal = assTotal + 1;
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
  if (sourceData.lcCount === 2) {
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
