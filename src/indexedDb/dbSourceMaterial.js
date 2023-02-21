import appDb from './mainDb';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import dateFormat from 'dateformat';
import { sourceLangState } from '../states/main';
import { assTypeListState, assTypeLocalState } from '../states/sourceMaterial';
import { dbHistoryAssignment, dbLastAssignment } from './dbAssignment';
import { allStudentsState, filteredStudentsState, studentsAssignmentHistoryState } from '../states/persons';
import { dbGetStudentsMini } from './dbPersons';

export const dbGetListWeekType = async () => {
  const weekTypeList = [];
  const appData = await appDb.table('week_type').reverse().reverse().sortBy('id_week_type');

  appData.forEach((weekType) => {
    const obj = {};
    obj.id_week_type = weekType.id_week_type;
    obj.week_type_name = weekType.week_type_name;
    obj.sort_index = weekType.sort_index;
    weekTypeList.push(obj);
  });

  return weekTypeList;
};

export const dbGetScheduleWeekInfo = async (weekOf) => {
  const appData = await appDb.table('sched_MM').get({ weekOf: weekOf });
  const obj = {};
  obj.week_type = appData.week_type || 1;
  obj.noMeeting = appData.noMeeting || false;
  return obj;
};

export const dbGetWeekTypeName = async (weekType) => {
  const sourceLang = (await promiseGetRecoil(sourceLangState)) || 'e';
  const lang = sourceLang.toUpperCase();

  let srcWeekType = '';
  if (weekType === '') {
    return srcWeekType;
  } else {
    const i = parseInt(weekType, 10);
    const appData = await appDb.table('week_type').get(i);
    srcWeekType = appData.week_type_name[lang];
    return srcWeekType;
  }
};

export const dbGetWeekTypeNamePocket = async (weekType) => {
  let srcWeekType = '';
  if (weekType === '') {
    return srcWeekType;
  } else {
    const i = parseInt(weekType, 10);
    const appData = await appDb.table('week_type').get(i);
    srcWeekType = appData.week_type_name;
    return srcWeekType;
  }
};

export const dbGetAllSourceMaterials = async () => {
  const appData = await appDb.table('src').toArray();
  return appData;
};

export const dbGetSourceMaterial = async (weekOf) => {
  const appLang = (await promiseGetRecoil(sourceLangState)) || 'e';
  const lang = appLang.toUpperCase();
  const assTypeList = await promiseGetRecoil(assTypeLocalState);

  const appData = await appDb.table('src').get({ weekOf: weekOf });

  let obj = {};
  let indexType;

  obj.weekOf = appData.weekOf;
  obj.weekDate_src = appData.weekDate_src ? appData.weekDate_src[lang] || '' : '';
  obj.weeklyBibleReading_src = appData.weeklyBibleReading_src ? appData.weeklyBibleReading_src[lang] || '' : '';
  obj.songFirst_src = appData.songFirst_src || '';
  obj.tgwTalk_src = appData.tgwTalk_src ? appData.tgwTalk_src[lang] || '' : '';
  obj.bibleReading_src = appData.bibleReading_src ? appData.bibleReading_src[lang] || '' : '';
  obj.bibleReading_study = appData.bibleReading_study || '';
  obj.ayfCount = appData.ayfCount;

  obj.ass1_type = '';
  if (typeof appData.ass1_type === 'object') {
    if (appData.ass1_type[lang] !== '') obj.ass1_type = +appData.ass1_type[lang];
  }
  if (appData.ass1_type && typeof appData.ass1_type !== 'object') {
    obj.ass1_type = +appData.ass1_type;
  }

  indexType = assTypeList.findIndex((type) => type.value === obj.ass1_type);
  obj.ass1_type_name = indexType >= 0 ? assTypeList[indexType].label : '';
  obj.ass1_time = appData.ass1_time || '';
  obj.ass1_study = appData.ass1_study || '';
  obj.ass1_src = appData.ass1_src ? appData.ass1_src[lang] || '' : '';

  obj.ass2_type = '';
  if (typeof appData.ass2_type === 'object') {
    if (appData.ass2_type[lang] !== '') obj.ass2_type = +appData.ass2_type[lang];
  }
  if (appData.ass2_type && typeof appData.ass2_type !== 'object') {
    obj.ass2_type = +appData.ass2_type;
  }

  indexType = assTypeList.findIndex((type) => type.value === obj.ass2_type);
  obj.ass2_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

  obj.ass2_time = appData.ass2_time || '';
  obj.ass2_study = appData.ass2_study || '';
  obj.ass2_src = appData.ass2_src ? appData.ass2_src[lang] || '' : '';

  obj.ass3_type = '';
  if (typeof appData.ass3_type === 'object') {
    if (appData.ass3_type[lang] !== '') obj.ass3_type = +appData.ass3_type[lang];
  }
  if (appData.ass3_type && typeof appData.ass3_type !== 'object') {
    obj.ass3_type = +appData.ass3_type;
  }

  indexType = assTypeList.findIndex((type) => type.value === obj.ass3_type);
  obj.ass3_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

  obj.ass3_time = appData.ass3_time || '';
  obj.ass3_study = appData.ass3_study || '';
  obj.ass3_src = appData.ass3_src ? appData.ass3_src[lang] || '' : '';

  obj.ass4_type = '';
  if (typeof appData.ass4_type === 'object') {
    if (appData.ass4_type[lang] !== '') obj.ass4_type = +appData.ass4_type[lang];
  }
  if (appData.ass4_type && typeof appData.ass4_type !== 'object') {
    obj.ass4_type = +appData.ass4_type;
  }

  indexType = assTypeList.findIndex((type) => type.value === obj.ass4_type);
  obj.ass4_type_name = indexType >= 0 ? assTypeList[indexType].label : '';

  obj.ass4_time = appData.ass4_time ? (typeof appData.ass4_time === 'object' ? '' : appData.ass4_time) : '';
  obj.ass4_study = appData.ass4_study || '';
  obj.ass4_src = appData.ass4_src ? appData.ass4_src[lang] || '' : '';

  obj.songMiddle_src = appData.songMiddle_src || '';
  obj.lcCount = appData.lcCount;
  obj.lcCount_override = appData.lcCount_override;
  obj.lcPart1_time = appData.lcPart1_time || '';
  obj.lcPart1_time_override = appData.lcPart1_time_override || '';
  obj.lcPart1_src = appData.lcPart1_src ? appData.lcPart1_src[lang] || '' : '';
  obj.lcPart1_src_override = appData.lcPart1_src_override ? appData.lcPart1_src_override[lang] || '' : '';
  obj.lcPart1_content = appData.lcPart1_content ? appData.lcPart1_content[lang] || '' : '';
  obj.lcPart1_content_override = appData.lcPart1_content_override ? appData.lcPart1_content_override[lang] || '' : '';
  obj.lcPart2_time = appData.lcPart2_time || '';
  obj.lcPart2_time_override = appData.lcPart2_time_override || '';
  obj.lcPart2_src = appData.lcPart2_src ? appData.lcPart2_src[lang] || '' : '';
  obj.lcPart2_src_override = appData.lcPart2_src_override ? appData.lcPart2_src_override[lang] || '' : '';
  obj.lcPart2_content = appData.lcPart2_content ? appData.lcPart2_content[lang] || '' : '';
  obj.lcPart2_content_override = appData.lcPart2_content_override ? appData.lcPart2_content_override[lang] || '' : '';
  obj.cbs_src = appData.cbs_src ? appData.cbs_src[lang] || '' : '';
  obj.cbs_time_override = appData.cbs_time_override || '';
  obj.songConclude_src = appData.songConclude_src || '';
  obj.songConclude_src_override = appData.songConclude_src_override || '';
  obj.co_talk_title = appData.co_talk_title || '';

  const weekSchedInfo = await dbGetScheduleWeekInfo(weekOf);
  obj.week_type = weekSchedInfo.week_type;
  obj.noMeeting = weekSchedInfo.noMeeting;
  return obj;
};

export const dbGetSourceMaterialPocket = async (weekOf) => {
  const appLang = (await promiseGetRecoil(sourceLangState)) || 'e';
  const lang = appLang.toUpperCase();

  const assTypeList = await promiseGetRecoil(assTypeListState);

  const appData = await appDb.table('src').get({ weekOf: weekOf });
  let obj = {};

  obj.weekOf = appData.weekOf;
  obj.weekDate_src = appData.weekDate_src;
  obj.weeklyBibleReading_src = appData.weeklyBibleReading_src;
  obj.songFirst_src = appData.songFirst_src;
  obj.tgwTalk_src = appData.tgwTalk_src;
  obj.bibleReading_src = appData.bibleReading_src;
  obj.bibleReading_study = appData.bibleReading_study;

  obj.ass1_type = '';
  if (typeof appData.ass1_type === 'object') {
    if (appData.ass1_type[lang] !== '') obj.ass1_type = +appData.ass1_type[lang];
  }
  if (appData.ass1_type && typeof appData.ass1_type !== 'object') {
    obj.ass1_type = +appData.ass1_type;
  }

  obj.ass1_type_name = assTypeList.find((type) => type.code === obj.ass1_type)?.assignment_type_name || '';
  obj.ass1_time = +appData.ass1_time || '';
  obj.ass1_study = appData.ass1_study || '';
  obj.ass1_src = appData.ass1_src;

  obj.ass2_type = '';
  if (typeof appData.ass2_type === 'object') {
    if (appData.ass2_type[lang] !== '') obj.ass2_type = +appData.ass2_type[lang];
  }
  if (appData.ass2_type && typeof appData.ass2_type !== 'object') {
    obj.ass2_type = +appData.ass2_type;
  }

  obj.ass2_type_name = assTypeList.find((type) => type.code === obj.ass2_type).assignment_type_name || '';
  obj.ass2_time = +appData.ass2_time || '';
  obj.ass2_study = appData.ass2_study || '';
  obj.ass2_src = appData.ass2_src;

  obj.ass3_type = '';
  if (typeof appData.ass3_type === 'object') {
    if (appData.ass3_type[lang] !== '') obj.ass3_type = +appData.ass3_type[lang];
  }
  if (appData.ass3_type && typeof appData.ass3_type !== 'object') {
    obj.ass3_type = +appData.ass3_type;
  }

  obj.ass3_type_name = assTypeList.find((type) => type.code === obj.ass3_type).assignment_type_name || '';
  obj.ass3_time = +appData.ass3_time || '';
  obj.ass3_study = appData.ass3_study || '';
  obj.ass3_src = appData.ass3_src;

  obj.ass4_type = '';
  if (typeof appData.ass4_type === 'object') {
    if (appData.ass4_type[lang] !== '') obj.ass4_type = +appData.ass4_type[lang];
  }
  if (appData.ass4_type && typeof appData.ass4_type !== 'object') {
    obj.ass4_type = +appData.ass4_type;
  }

  obj.ass4_type_name = assTypeList.findIndex((type) => type.code === obj.ass4_type).assignment_type_name || '';
  obj.ass4_time = appData.ass4_time ? (typeof appData.ass4_time === 'object' ? '' : +appData.ass4_time) : '';
  obj.ass4_study = appData.ass4_study || '';
  obj.ass4_src = appData.ass4_src;

  obj.songMiddle_src = appData.songMiddle_src;
  obj.lcCount = appData.lcCount;
  obj.lcCount_override = appData.lcCount_override;
  obj.lcPart1_time = appData.lcPart1_time;
  obj.lcPart1_time_override = appData.lcPart1_time_override;
  obj.lcPart1_src = appData.lcPart1_src;
  obj.lcPart1_src_override = appData.lcPart1_src_override;
  obj.lcPart1_content = appData.lcPart1_content;
  obj.lcPart1_content_override = appData.lcPart1_content_override;
  obj.lcPart2_time = appData.lcPart2_time;
  obj.lcPart2_time_override = appData.lcPart2_time_override;
  obj.lcPart2_src = appData.lcPart2_src;
  obj.lcPart2_src_override = appData.lcPart2_src_override;
  obj.lcPart2_content = appData.lcPart2_content;
  obj.lcPart2_content_override = appData.lcPart2_content_override;
  obj.cbs_src = appData.cbs_src;
  obj.cbs_time_override = appData.cbs_time_override;
  obj.songConclude_src = appData.songConclude_src;
  obj.songConclude_src_override = appData.songConclude_src_override || '';
  obj.co_talk_title = appData.co_talk_title || '';

  const weekSchedInfo = await dbGetScheduleWeekInfo(weekOf);
  obj.week_type = weekSchedInfo.week_type;
  obj.noMeeting = weekSchedInfo.noMeeting;
  return obj;
};

export const dbGetSMUpdate = async (weekOf) => {
  const appData = await appDb.table('src').get({ weekOf: weekOf });
  const obj = {};

  obj.weekDate_src = appData ? appData.weekDate_src || {} : {};
  obj.weeklyBibleReading_src = appData ? appData.weeklyBibleReading_src || {} : {};
  obj.tgwTalk_src = appData ? appData.tgwTalk_src || {} : {};
  obj.bibleReading_src = appData ? appData.bibleReading_src || {} : {};
  obj.ass1_src = appData ? appData.ass1_src || {} : {};
  obj.ass1_type = appData ? appData.ass1_type || {} : {};
  obj.ass2_src = appData ? appData.ass2_src || {} : {};
  obj.ass2_type = appData ? appData.ass2_type || {} : {};
  obj.ass3_src = appData ? appData.ass3_src || {} : {};
  obj.ass3_type = appData ? appData.ass3_type || {} : {};
  obj.ass4_src = appData ? appData.ass4_src || {} : {};
  obj.ass4_type = appData ? appData.ass4_type || {} : {};
  obj.lcCount_override = appData ? appData.lcCount_override || undefined : undefined;
  obj.lcPart1_time_override = appData ? appData.lcPart1_time_override || undefined : undefined;
  obj.lcPart1_src_override = appData ? appData.lcPart1_src_override || {} : {};
  obj.lcPart1_src = appData ? appData.lcPart1_src || {} : {};
  obj.lcPart1_content = appData ? appData.lcPart1_content || {} : {};
  obj.lcPart1_content_override = appData ? appData.lcPart1_content_override || {} : {};
  obj.lcPart2_time_override = appData ? appData.lcPart2_time_override || undefined : undefined;
  obj.lcPart2_src = appData ? appData.lcPart2_src || {} : {};
  obj.lcPart2_src_override = appData ? appData.lcPart2_src_override || {} : {};
  obj.lcPart2_content = appData ? appData.lcPart2_content || {} : {};
  obj.lcPart2_content_override = appData ? appData.lcPart2_content_override || {} : {};
  obj.cbs_time_override = appData ? appData.cbs_time_override || undefined : undefined;
  obj.cbs_src = appData ? appData.cbs_src || {} : {};
  obj.keepOverride = appData ? appData.keepOverride || undefined : undefined;

  return obj;
};

export const dbSaveSrcData = async (srcData, localOverride) => {
  let isSuccess = false;
  const sourceLang = (await promiseGetRecoil(sourceLangState)) || 'e';
  const lang = sourceLang.toUpperCase();

  const {
    weekDate_src,
    weeklyBibleReading_src,
    tgwTalk_src,
    bibleReading_src,
    ass1_src,
    ass1_type,
    ass2_src,
    ass2_type,
    ass3_src,
    ass3_type,
    ass4_src,
    ass4_type,
    lcCount_override,
    lcPart1_time_override,
    lcPart1_src,
    lcPart1_src_override,
    lcPart1_content,
    lcPart1_content_override,
    lcPart2_time_override,
    lcPart2_src,
    lcPart2_src_override,
    lcPart2_content,
    lcPart2_content_override,
    cbs_time_override,
    cbs_src,
    keepOverride,
  } = await dbGetSMUpdate(srcData.weekOf);

  await appDb
    .table('src')
    .put(
      {
        weekOf: srcData.weekOf,
        weekDate_src: {
          ...weekDate_src,
          [lang]: srcData.weekDate_src || '',
        },
        weeklyBibleReading_src: {
          ...weeklyBibleReading_src,
          [lang]: srcData.weeklyBibleReading_src || '',
        },
        songFirst_src: srcData.songFirst_src,
        tgwTalk_src: {
          ...tgwTalk_src,
          [lang]: srcData.tgwTalk_src || '',
        },
        bibleReading_src: {
          ...bibleReading_src,
          [lang]: srcData.bibleReading_src || '',
        },
        bibleReading_study: srcData.bibleReading_study,
        ayfCount: srcData.ayfCount,
        ass1_type: {
          ...ass1_type,
          [lang]: srcData.ass1_type || '',
        },
        ass1_time: srcData.ass1_time,
        ass1_study: srcData.ass1_study,
        ass1_src: {
          ...ass1_src,
          [lang]: srcData.ass1_src || '',
        },
        ass2_type: {
          ...ass2_type,
          [lang]: srcData.ass2_type || '',
        },
        ass2_time: srcData.ass2_time,
        ass2_study: srcData.ass2_study,
        ass2_src: {
          ...ass2_src,
          [lang]: srcData.ass2_src || '',
        },
        ass3_type: {
          ...ass3_type,
          [lang]: srcData.ass3_type || '',
        },
        ass3_time: srcData.ass3_time,
        ass3_study: srcData.ass3_study,
        ass3_src: {
          ...ass3_src,
          [lang]: srcData.ass3_src || '',
        },
        ass4_type: {
          ...ass4_type,
          [lang]: srcData.ass4_type || '',
        },
        ass4_time: srcData.ass4_time,
        ass4_study: srcData.ass4_study,
        ass4_src: {
          ...ass4_src,
          [lang]: srcData.ass4_src || '',
        },
        songMiddle_src: srcData.songMiddle_src,
        lcCount: srcData.lcCount,
        lcCount_override: localOverride ? lcCount_override : srcData.lcCount_override,
        lcPart1_time: srcData.lcPart1_time,
        lcPart1_time_override: localOverride ? lcPart1_time_override : srcData.lcPart1_time_override,
        lcPart1_src: {
          ...lcPart1_src,
          [lang]: srcData.lcPart1_src || '',
        },
        lcPart1_src_override: localOverride
          ? lcPart1_src_override
          : {
              ...lcPart1_src_override,
              [lang]: srcData.lcPart1_src_override || '',
            },
        lcPart1_content: {
          ...lcPart1_content,
          [lang]: srcData.lcPart1_content || '',
        },
        lcPart1_content_override: localOverride
          ? lcPart1_content_override
          : {
              ...lcPart1_content_override,
              [lang]: srcData.lcPart1_content_override || '',
            },
        lcPart2_time: srcData.lcPart2_time,
        lcPart2_time_override: localOverride ? lcPart2_time_override : srcData.lcPart2_time_override,
        lcPart2_src: {
          ...lcPart2_src,
          [lang]: srcData.lcPart2_src || '',
        },
        lcPart2_src_override: localOverride
          ? lcPart2_src_override
          : {
              ...lcPart2_src_override,
              [lang]: srcData.lcPart2_src_override || '',
            },
        lcPart2_content: {
          ...lcPart2_content,
          [lang]: srcData.lcPart2_content || '',
        },
        lcPart2_content_override: localOverride
          ? lcPart2_content_override
          : {
              ...lcPart2_content_override,
              [lang]: srcData.lcPart2_content_override || '',
            },
        cbs_src: {
          ...cbs_src,
          [lang]: srcData.cbs_src || '',
        },
        cbs_time_override: localOverride ? cbs_time_override : srcData.cbs_time_override,
        songConclude_src: srcData.songConclude_src,
        songConclude_src_override: srcData.songConclude_src_override,
        co_talk_title: srcData.co_talk_title,
        keepOverride: localOverride ? keepOverride : new Date().toISOString(),
      },
      srcData.weekOf
    )
    .then(async () => {
      const isSub = await dbSaveSchedData(srcData.weekOf, srcData.week_type, srcData.noMeeting, srcData.isOverride);
      if (isSub === true) {
        isSuccess = true;
      }
    })
    .catch(() => {
      isSuccess = false;
    });
  return isSuccess;
};

export const dbMigrateSrcData = async (srcData) => {
  let isSuccess = false;

  await appDb
    .table('src')
    .put(
      {
        weekOf: srcData.weekOf,
        bibleReading_src: {
          ...srcData.bibleReading_src,
        },
        ass1_type: srcData.ass1_type,
        ass1_time: srcData.ass1_time,
        ass1_src: {
          ...srcData.ass1_src,
        },
        ass2_type: srcData.ass2_type,
        ass2_time: srcData.ass2_time,
        ass2_src: {
          ...srcData.ass2_src,
        },
        ass3_type: srcData.ass3_type,
        ass3_time: srcData.ass3_time,
        ass3_src: {
          ...srcData.ass3_src,
        },
        ass4_type: srcData.ass4_type,
        ass4_time: srcData.ass4_time,
        ass4_src: {
          ...srcData.ass4_src,
        },
      },
      srcData.weekOf
    )
    .then(async () => {
      const isSub = await dbSaveSchedData(srcData.weekOf, srcData.week_type, srcData.noMeeting, srcData.isOverride);
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
  let isSuccess = false;
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
    const changes = appData.changes ? [...appData.changes] : [];

    const sourceWeekType = appData.week_type;
    if (sourceWeekType !== weekType) {
      const findIndex = changes.findIndex((item) => item.field === 'week_type');
      if (findIndex !== -1) changes.splice(findIndex, 1);
      changes.push({ date: new Date().toISOString(), field: 'week_type', value: weekType });
    }

    const sourceNoMeeting = appData.noMeeting;
    if (sourceNoMeeting !== noMeeting) {
      const findIndex = changes.findIndex((item) => item.field === 'noMeeting');
      if (findIndex !== -1) changes.splice(findIndex, 1);
      changes.push({ date: new Date().toISOString(), field: 'noMeeting', value: noMeeting });
    }

    await appDb
      .table('sched_MM')
      .update(weekOf, {
        weekOf: weekOf,
        week_type: weekType,
        noMeeting: noMeeting,
        changes: changes,
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
  let varBool = true;
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monDay = new Date(today.setDate(diff));
  const fMonday = dateFormat(monDay, 'mm/dd/yyyy');
  const congData = await appDb.table('src').get({ weekOf: fMonday });
  if (typeof congData === 'undefined') {
    varBool = false;
  }
  return varBool;
};

export const checkSrcUpdate = async () => {
  const checkCurrentWeek = await hasCurrentWeek();
  if (checkCurrentWeek === false) {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monDay = new Date(today.setDate(diff));
    const fMonday = dateFormat(monDay, 'mm/dd/yyyy');
    await dbAddWeekToSource(fMonday);
    await dbAddWeekToSchedule(fMonday);
  }
};

export const dbAddWeekToSource = async (varSrcWeek) => {
  await appDb.table('src').put({ weekOf: varSrcWeek }, varSrcWeek);
};

export const dbAddWeekToSchedule = async (varSchedWeek) => {
  let weekType = 1;
  let noMeeting = false;
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
  const allSchedules = [];

  const appData = await appDb.table('src').reverse().reverse().sortBy('weekOf');

  for (let i = 0; i < appData.length; i++) {
    const weekDate = appData[i].weekOf;
    const month = weekDate.split('/')[0];
    const year = weekDate.split('/')[2];
    const tempMain = month + '/' + year;
    if (tempMain === scheduleIndex) {
      const obj = {};
      obj.weekOf = weekDate;
      obj.value = appData[i].weekOf;
      allSchedules.push(obj);
    }
  }

  return allSchedules;
};

export const dbGetYearList = async () => {
  const allYear = [];

  const appData = await appDb.table('src').reverse().reverse().sortBy('weekOf');

  for (let i = 0; i < appData.length; i++) {
    const weekDate = appData[i].weekOf;
    const varYear = weekDate.split('/')[2];

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

export const dbGetScheduleListByYear = async (varYear) => {
  const allSchedules = [];

  const appData = await appDb.table('src').reverse().sortBy('weekOf');

  for (let i = 0; i < appData.length; i++) {
    const weekDate = appData[i].weekOf;
    const year = weekDate.split('/')[2];

    if (year === varYear) {
      const month = weekDate.split('/')[0];

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

export const dbAddManualSource = async () => {
  const appData = await appDb.table('src').toArray();
  appData.sort((a, b) => {
    const dateA = a.weekOf.split('/')[2] + '/' + a.weekOf.split('/')[0] + '/' + a.weekOf.split('/')[1];
    const dateB = b.weekOf.split('/')[2] + '/' + b.weekOf.split('/')[0] + '/' + b.weekOf.split('/')[1];
    return dateA > dateB ? 1 : -1;
  });

  const key = appData.length - 1;
  const lastWeek = appData[key].weekOf;

  const day = lastWeek.split('/')[1];
  const month = lastWeek.split('/')[0];
  const year = lastWeek.split('/')[2];
  const result = new Date(year, month - 1, day);
  result.setDate(result.getDate() + 7);
  const fMonday = dateFormat(result, 'mm/dd/yyyy');
  await dbAddWeekToSource(fMonday);
  await dbAddWeekToSchedule(fMonday);
  return;
};

export const dbDeleteWeek = async (week) => {
  await appDb.src.delete(week);
  await appDb.sched_MM.delete(week);

  const history = await dbHistoryAssignment();
  await promiseSetRecoil(studentsAssignmentHistoryState, history);

  const persons = await dbGetStudentsMini();
  for await (const person of persons) {
    const stuAssignment = await dbLastAssignment(person.person_uid);
    const obj = {};
    obj.lastAssignment = stuAssignment;
    obj.changes = person.changes || [];
    const findIndex = obj.changes.findIndex((item) => item.field === 'lastAssignment');
    if (findIndex !== -1) obj.changes.splice(findIndex, 1);
    obj.changes.push({ date: new Date().toISOString(), field: 'lastAssignment', value: stuAssignment });
    await appDb.persons.update(person.id, { ...obj });
  }

  const data = await dbGetStudentsMini();
  await promiseSetRecoil(allStudentsState, data);
  await promiseSetRecoil(filteredStudentsState, data);
};

export const dbIsWeekExist = async (varWeek) => {
  let varBool = true;
  const congData = await appDb.table('src').get({ weekOf: varWeek });
  if (typeof congData === 'undefined') {
    varBool = false;
  }
  return varBool;
};
